// backend/server.js
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

/* ------------------------- CORS ------------------------- */
const allowedOrigins = [
  process.env.FRONTEND_ORIGIN,   // e.g. https://alz-frontend.onrender.com
  'http://localhost:3000',
  'http://localhost:5173',
].filter(Boolean);

const corsOptions = {
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

/* --------------------- Body Parsers --------------------- */
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

/* --------------------- Health Routes -------------------- */
app.get('/', (_req, res) => res.send('✅ Alzheimer API is running'));
app.get('/healthz', (_req, res) => res.send('ok'));
app.get('/health/db', (_req, res) =>
  res.json({ readyState: mongoose.connection.readyState }) // 1 = connected
);

/* --------------------- API Routers ---------------------- */
// Auth (uses routes/authRoutes.js and models/userModel.js)
try {
  app.use('/api/auth', require('./routes/authRoutes'));
} catch (e) {
  console.warn('⚠️ ./routes/authRoutes.js not found; skipping auth routes.');
}

// Optional analysis routes if you have them
try {
  app.use('/api/analysis', require('./routes/analysisRoutes'));
} catch (e) {
  console.warn('⚠️ ./routes/analysisRoutes.js not found; skipping analysis routes.');
}

/* -------- Upload → forward to Flask ML API -------------- */
/**
 * Expects form-data:
 *  - mri:   file
 *  - voice: file
 *  - quizScore: number (string)
 */
const ML_API_URL = process.env.ML_API_URL; // e.g. https://alz-ml-api.onrender.com
if (!ML_API_URL) {
  console.warn('⚠️ ML_API_URL not set; /api/analysis/upload forwarding will fail.');
}

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.memoryStorage(); // keep files in memory (free plan has no persistent disk)
const upload = multer({ storage });

app.post(
  '/api/analysis/upload',
  upload.fields([{ name: 'mri' }, { name: 'voice' }]),
  async (req, res) => {
    try {
      if (!req.files?.mri?.[0] || !req.files?.voice?.[0]) {
        return res.status(400).json({ error: 'mri and voice files are required' });
      }
      const quizScore = req.body.quizScore ?? '0';

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

      return res.status(200).json(resp.data);
    } catch (e) {
      const details = e?.response?.data || e.message || 'Unknown error';
      console.error('❌ ML analysis failed:', details);
      return res.status(500).json({ error: 'ML analysis failed', details });
    }
  }
);

/* -------------------- Error Handler --------------------- */
app.use((err, _req, res, _next) => {
  console.error('❌ Unhandled error:', err);
  res.status(err.status || 500).json({ error: err.message || 'Server error' });
});

/* --------------- Start AFTER DB connects ---------------- */
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => console.log(`🚀 Backend listening on ${PORT}`));
});
