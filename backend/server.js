// backend/server.js
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// This function will start the server
const startServer = async () => {
  try {
    // 1. Connect to the database first
    await connectDB();

    // 2. Set up middleware after the connection is successful

    // --- START OF CORRECTION ---

    // Create a specific CORS configuration to trust only your live frontend
    const corsOptions = {
      origin: "https://alzheimer-analysis-app-1.onrender.com", // Your frontend URL
      optionsSuccessStatus: 200 // For legacy browser support
    };
    
    // Use the specific CORS options
    app.use(cors(corsOptions));

    // --- END OF CORRECTION ---

    app.use(express.json());

    // Define Routes
    app.use('/api/auth', require('./routes/authRoutes'));
    app.use('/api/analysis', require('./routes/analysisRoutes'));

    app.get('/', (req, res) => res.send('API is running...'));

    // 3. Start listening for requests only after everything is ready
    app.listen(PORT, () => console.log(`✅ Server is running on port: ${PORT}`));

  } catch (error) {
    console.error('Failed to connect to the database', error);
    process.exit(1);
  }
};

// Call the function to start the server
startServer();