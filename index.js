const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv").config();
const { errorHandler } = require("./middleware/errorHandler");
const connectDB = require("./config/db");
const roomRoutes = require("./routes/roomRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();
const port = process.env.PORT || 5000;

// ✅ Connect to Database
connectDB();

// ✅ Define Allowed Origins with Environment-based Configuration
const allowedOrigins = 
  process.env.NODE_ENV === 'production'
    ? [
        "https://bookings-admin-one.vercel.app", 
        "https://bookings-client-three.vercel.app"
      ]
    : ["http://localhost:3000", "http://127.0.0.1:3000"];

// ✅ Comprehensive CORS Configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
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

// ✅ Apply CORS Middleware
app.use(cors(corsOptions));

// ✅ Middleware (ORDER MATTERS)
app.use(cookieParser()); // Handles cookies
app.use(express.json()); // Parses JSON
app.use(express.urlencoded({ extended: false })); // Parses form data

// ✅ Debugging Middleware (Optional, can be removed in production)
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    console.log("🔍 CORS Debugging:");
    console.log("Request Origin:", req.headers.origin);
    console.log("Allowed Origins:", allowedOrigins);
    console.log("Request Method:", req.method);
    next();
  });
}

// ✅ Explicit CORS Headers for Additional Security
app.use((req, res, next) => {
  res.header("X-Content-Type-Options", "nosniff");
  res.header("X-Frame-Options", "DENY");
  res.header("X-XSS-Protection", "1; mode=block");
  next();
});

// ✅ API Routes
app.use("/api/rooms", roomRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/users", userRoutes);

// ✅ Default API Test Route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// ✅ 404 Handler for undefined routes
app.use((req, res, next) => {
  res.status(404).json({
    error: "Not Found",
    path: req.path
  });
});

// ✅ Error Handling Middleware
app.use(errorHandler);

// ✅ Graceful Shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});

// ✅ Start Server
const server = app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;