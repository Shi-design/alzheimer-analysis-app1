const axios = require('axios');
const FormData = require('form-data');
const ML_API_BASE_URL = 'http://localhost:5001'; // The address of your Python API

// Helper function to calculate quiz score
const calculateQuizPercentage = (score, maxScore) => (1 - (score / maxScore)) * 100;

exports.submitAnalysis = async (req, res) => {
  try {
    const { quizScore } = req.body;
    
    // Extract files from the request
    const mriFile = req.files.mriScan[0];
    const audioFile = req.files.voiceRecording[0];

    // --- Send MRI file to Python API ---
    const mriForm = new FormData();
    mriForm.append('file', mriFile.buffer, { filename: mriFile.originalname });
    const mriResponse = await axios.post(`${ML_API_BASE_URL}/predict_mri`, mriForm, { 
      headers: mriForm.getHeaders() 
    });
    const mriPrediction = mriResponse.data.mri_prediction;

    // --- Send Audio file to Python API ---
    const audioForm = new FormData();
    audioForm.append('file', audioFile.buffer, { filename: audioFile.originalname });
    const audioResponse = await axios.post(`${ML_API_BASE_URL}/predict_audio`, audioForm, { 
      headers: audioForm.getHeaders() 
    });
    const audioPrediction = audioResponse.data.audio_prediction;

    // --- Calculate Final Results ---
    const quizPercentage = calculateQuizPercentage(parseInt(quizScore, 10), 30);
    const mriPercentage = mriPrediction * 100;
    const voicePercentage = audioPrediction * 100;
    const finalPercentage = (quizPercentage * 0.4) + (mriPercentage * 0.5) + (voicePercentage * 0.1);

    // --- Send the final results back to the frontend ---
    res.json({
      results: {
        quiz: quizPercentage.toFixed(2),
        mri: mriPercentage.toFixed(2),
        voice: voicePercentage.toFixed(2),
        finalScore: finalPercentage.toFixed(2),
      },
    });
  } catch (error) {
    console.error('Error during analysis:', error.message);
    res.status(500).send('Server Error during analysis');
  }
};