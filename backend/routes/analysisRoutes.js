const express = require('express');
const router = express.Router();
const multer = require('multer');
const { submitAnalysis } = require('../controllers/analysisController');

// Use multer for handling file uploads in memory
const upload = multer({ storage: multer.memoryStorage() });

// This route now accepts two different files with specific names
router.post('/submit', upload.fields([
  { name: 'mriScan', maxCount: 1 },
  { name: 'voiceRecording', maxCount: 1 }
]), submitAnalysis);

module.exports = router;