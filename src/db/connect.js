const mongoose = require("mongoose");

const connectDB = async (mongoUrl) => {
  try {
    await mongoose.connect(mongoUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error; // Re-throw the error to be caught by the caller
  }
};

module.exports = connectDB;
