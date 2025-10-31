const express = require("express");
const multer = require("multer");
const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// ---------------------------------------------------
// POST /api/analyze
// ---------------------------------------------------
router.post(
  "/analyze",
  upload.fields([
    { name: "mri", maxCount: 1 },
    { name: "voice", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const mriFile = req.files["mri"] ? req.files["mri"][0] : null;
      const voiceFile = req.files["voice"] ? req.files["voice"][0] : null;
      const { quizScore } = req.body;

      if (!mriFile || !voiceFile) {
        return res.status(400).json({ msg: "Both MRI and Voice files are required." });
      }

      console.log("🧠 Cognitive Score received:", quizScore);
      console.log("🚀 Sending files to Flask...");

      // Prepare form data for Flask
      const formData = new FormData();
      formData.append("mri", fs.createReadStream(mriFile.path));
      formData.append("voice", fs.createReadStream(voiceFile.path));
      formData.append("quizScore", quizScore || 0);

      // Send to Flask API
      const flaskResponse = await axios.post(
        "http://127.0.0.1:5001/analyze",
        formData,
        { headers: formData.getHeaders(), timeout: 60000 } // 60s timeout
      );

      console.log("✅ Flask Response:", flaskResponse.data);

      // Delete temporary uploads
      fs.unlinkSync(mriFile.path);
      fs.unlinkSync(voiceFile.path);

      // Validate Flask response
      if (flaskResponse.data.status === "ok") {
        return res.json({ results: flaskResponse.data.result });
      } else {
        return res.status(500).json({
          msg: "Flask returned unexpected response",
          details: flaskResponse.data,
        });
      }
    } catch (error) {
      console.error("❌ Error in Node analysis route:");
      if (error.response) {
        console.error("Flask status:", error.response.status);
        console.error("Flask data:", error.response.data);
      } else {
        console.error("Error message:", error.message);
      }

      return res.status(500).json({
        msg: "Analysis failed. Please try again.",
        details: error.response?.data || error.message,
      });
    }
  }
);

module.exports = router;
