const express = require('express');
const cors = require('cors'); // Make sure cors is required
const connectDB = require('./config/db');
require('dotenv').config();

// Define allowed origins
const allowedOrigins = [
  'http://localhost:3000', // For local development
  process.env.FRONTEND_URL // For your live Render URL
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
};

const app = express();
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    
    // Use the detailed CORS options
    app.use(cors(corsOptions)); 
    
    app.use(express.json());

    // ... (rest of your server.js file) ...
    // Define Routes
    app.use('/api/auth', require('./routes/authRoutes'));
    app.use('/api/analysis', require('./routes/analysisRoutes'));
    
    app.listen(PORT, () => console.log(`🚀 Server running on port: ${PORT}`));
  } catch (error) {
    console.error('Failed to start server', error);
    process.exit(1);
  }
};

startServer();