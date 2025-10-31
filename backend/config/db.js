// backend/config/db.js
const mongoose = require('mongoose');

function getMongoUri() {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
  if (!uri) throw new Error('No Mongo URI (MONGODB_URI or MONGO_URI) in env');
  return uri;
}

async function connectDB() {
  const uri = getMongoUri();
  console.log('🟡 Connecting to MongoDB...');
  try {
    await mongoose.connect(uri, {
      dbName: process.env.MONGO_DBNAME || 'alzheimier',
    });
    console.log('✅ MongoDB connected');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  }
}

module.exports = { connectDB, mongoose };
