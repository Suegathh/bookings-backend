// Global Error Handling
process.on('unhandledRejection', (reason, promise) => {
  console.error('🚨 Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('🚨 Uncaught Exception:', error);
});

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const { errorHandler } = require("./middleware/errorHandler");
const connectDB = require("./config/db");
const roomRoutes = require("./routes/roomRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const userRoutes = require("./routes/userRoutes");

// Initialize Express App
const app = express();

// Enhanced Logging Middleware
app.use((req, res, next) => {
  console.log(`📡 Request: ${req.method} ${req.path}`);
  next();
});

// Define Allowed Origins
const allowedOrigins = 
  process.env.NODE_ENV === 'production'
    ? [
        "https://bookings-admin-one.vercel.app", 
        "https://bookings-client-three.vercel.app"
      ]
    : ["http://localhost:3000", "http://127.0.0.1:3000"];

// CORS Configuration
const corsOptions = {
  origin: function (origin, callback) {
    console.log(`🌐 Incoming Origin: ${origin}`);
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.warn(`❌ CORS Blocked: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type", 
    "Authorization", 
    "Access-Control-Allow-Methods", 
    "Access-Control-Allow-Origin", 
    "Access-Control-Allow-Headers"
  ]
};

// Middleware
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Enhanced Security Headers
app.use((req, res, next) => {
  res.header("X-Content-Type-Options", "nosniff");
  res.header("X-Frame-Options", "DENY");
  res.header("X-XSS-Protection", "1; mode=block");
  res.header("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  next();
});

// API Routes
app.use("/api/rooms", roomRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/users", userRoutes);

// Default Route
app.get("/", (req, res) => {
  res.status(200).json({
    message: "API is running...",
    timestamp: new Date().toISOString()
  });
});

// 404 Handler
app.use((req, res, next) => {
  res.status(404).json({
    error: "Not Found",
    path: req.path,
    timestamp: new Date().toISOString()
  });
});

// Error Handling Middleware
app.use(errorHandler);

// Vercel Serverless Function Handler
const serverlessHandler = async (req, res) => {
  try {
    // Ensure database connection
    await connectDB();
    
    // Log serverless invocation
    console.log(`🚀 Serverless Invocation: ${req.method} ${req.path}`);
    
    // Process request through Express app
    return app(req, res);
  } catch (error) {
    console.error('🔥 Serverless Handler Error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message
    });
  }
};

module.exports = app;
module.exports.handler = serverlessHandler;