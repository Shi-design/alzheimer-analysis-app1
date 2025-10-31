require('dotenv').config();
const path = require('path');
const fs = require('fs');
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const multer = require('multer');
const FormData = require('form-data');

const { connectDB, mongoose } = require('./config/db');

const app = express();

/* ------------ CORS ------------ */
const allowed = [
  process.env.FRONTEND_ORIGIN,         // your Render static site URL
  'http://localhost:3000',
  'http://localhost:5173',
].filter(Boolean);

app.use(cors({ origin: allowed, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

/* ------------ Health ------------ */
app.get('/', (_req, res) => res.send('✅ Alzheimer API is running'));
app.get('/healthz', (_req, res) => res.send('ok'));
app.get('/health/db', (_req, res) =>
  res.json({ readyState: mongoose.connection.readyState }) // 1 = connected
);

/* ------------ Auth routes (if present) ------------ */
// If you have backend/routes/auth.js, this will mount it.
// Remove or adjust the require path if your file name differs.
try {
  app.use('/api/auth', require('./routes/auth'));
} catch {
  console.warn('⚠️ ./routes/auth not found; skipping auth routes.');
}

/* ------------ Upload → forward to ML API ------------ */
const ML_API_URL = process.env.ML_API_URL; // e.g. https://alz-ml-api.onrender.com
if (!ML_API_URL) console.warn('⚠️ ML_API_URL not set; /api/analysis/upload will fail.');

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.memoryStorage(); // keep file in memory; no disk persistence on free plan
const upload = multer({ storage });

/**
 * Expects form-data:
 *  - mri:   file
 *  - voice: file
 *  - quizScore: number (string)
 */
app.post('/api/analysis/upload', upload.fields([{ name: 'mri' }, { name: 'voice' }]), async (req, res) => {
  try {
    if (!req.files?.mri?.[0] || !req.files?.voice?.[0]) {
      return res.status(400).json({ error: 'mri and voice files are required' });
    }
    const quizScore = req.body.quizScore ?? '0';

    // Build form-data to forward to Flask
    const fd = new FormData();
    fd.append('mri', req.files.mri[0].buffer, {
      filename: req.files.mri[0].originalname || 'mri.png',
      contentType: req.files.mri[0].mimetype || 'image/png',
    });
    fd.append('voice', req.files.voice[0].buffer, {
      filename: req.files.voice[0].originalname || 'voice.wav',
      contentType: req.files.voice[0].mimetype || 'audio/wav',
    });
    fd.append('quizScore', quizScore);

    const resp = await axios.post(`${ML_API_URL}/analyze`, fd, {
      headers: fd.getHeaders(),
      maxBodyLength: Infinity,
      maxContentLength: Infinity,
    });

    res.status(200).json(resp.data);
  } catch (e) {
    const errPayload = e?.response?.data || e.message || 'Unknown error';
    console.error('❌ ML analysis failed:', errPayload);
    res.status(500).json({ error: 'ML analysis failed', details: errPayload });
  }
});

/* ------------ Start after DB connects ------------ */
const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  app.listen(PORT, () => console.log(`🚀 Backend listening on ${PORT}`));
});
