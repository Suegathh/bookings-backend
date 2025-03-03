const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000, // Wait up to 30s for MongoDB to respond
      socketTimeoutMS: 45000,          // Wait 45s for socket operations
    });
    console.log(`✅ Connected to DB: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Error connecting to DB: ${error.message}`);
    process.exit(1); // Exit process if MongoDB connection fails
  }
};

module.exports = connectDB;
