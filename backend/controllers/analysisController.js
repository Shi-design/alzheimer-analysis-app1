const axios = require("axios");
const FormData = require("form-data");
const ML_API_BASE_URL = "http://localhost:5001"; // Flask backend

exports.submitAnalysis = async (req, res) => {
  try {
    const { quizScore } = req.body;

    const mriFile = req.files.mriScan?.[0];
    const audioFile = req.files.voiceRecording?.[0];

    if (!mriFile || !audioFile) {
      return res.status(400).json({ error: "MRI or audio file missing" });
    }

    // Prepare a combined form for Flask
    const form = new FormData();
    form.append("mri", mriFile.buffer, { filename: mriFile.originalname });
    form.append("voice", audioFile.buffer, { filename: audioFile.originalname });
    form.append("quizScore", quizScore);

    // Send everything to Flask `/analyze`
    const flaskResponse = await axios.post(`${ML_API_BASE_URL}/analyze`, form, {
      headers: form.getHeaders(),
    });

    // Extract result from Flask response
    const result = flaskResponse.data.result;

    res.json({
      results: {
        quiz: result.cognitive.toFixed(2),
        mri: result.mri.toFixed(2),
        voice: result.voice.toFixed(2),
        finalScore: result.overall_score.toFixed(2),
      },
    });
  } catch (error) {
    console.error("Error during analysis:", error.message);
    if (error.response?.data) {
      console.error("Flask Error Response:", error.response.data);
    }
    res.status(500).send("Server Error during analysis");
  }
};
