require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');

const app = express();
app.use(express.json());

// CORS: allow your Render static site + local dev
const allowed = [
  process.env.FRONTEND_ORIGIN,       // set from Render to the static site URL
  'http://localhost:3000',
  'http://localhost:5173'
].filter(Boolean);
app.use(cors({ origin: allowed, credentials: true }));

// Health check for Render
app.get('/healthz', (req, res) => res.send('ok'));

// Example: forward analysis upload to ML API (adjust to your real routes)
const ML_API_URL = process.env.ML_API_URL; // Render will inject this
app.post('/api/analysis/upload', async (req, res) => {
  try {
    // If you currently use multer for file uploads, keep that as-is,
    // then forward the file buffer/form-data to ML_API_URL.
    // This is just a placeholder to show the pattern:
    const resp = await axios.post(`${ML_API_URL}/analyze`, req.body);
    res.json(resp.data);
  } catch (e) {
    console.error(e?.response?.data || e.message);
    res.status(500).json({ error: 'ML analysis failed' });
  }
});

// …your existing routes…

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend listening on ${PORT}`));
