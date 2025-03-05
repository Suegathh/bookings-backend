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

// Define Allowed Origins
const allowedOrigins =
  process.env.NODE_ENV === "production"
    ? [
        "https://bookings-admin-one.vercel.app",
        "https://bookings-client-three.vercel.app",
      ]
    : ["http://localhost:3000", "http://127.0.0.1:3000"];

// CORS Configuration
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.error(`Blocked CORS request from: ${origin}`);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "Access-Control-Allow-Origin",
  ],
};

// Middleware
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Security Headers
app.use((req, res, next) => {
  res.header("X-Content-Type-Options", "nosniff");
  res.header("X-Frame-Options", "DENY");
  res.header("X-XSS-Protection", "1; mode=block");

  res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

// API Routes
app.use("/api/rooms", roomRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/users", userRoutes);

// Default Route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// 404 Handler
app.use((req, res, next) => {
  res.status(404).json({
    error: "Not Found",
    path: req.path,
  });
});

// Error Handling Middleware
app.use(errorHandler);

// Vercel Serverless Function Export
module.exports = app;

// Serverless Handler (Ensures DB connection for each request)
module.exports.handler = async (req, res) => {
  try {
    await connectDB(); // Ensure DB connection per request
    return app(req, res);
  } catch (error) {
    console.error("Database connection error:", error);
    res.status(500).json({ error: "Database connection failed" });
  }
};
