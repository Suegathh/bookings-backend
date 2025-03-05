const express = require("express");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const errorHandler = require("./middleware/errorHandler");

const connectDB = require("./config/db");
const roomRoutes = require("./routes/roomRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const userRoutes = require("./routes/userRoutes");

// Initialize Express App
const app = express();

// ✅ Define Allowed Frontend Origins (Vercel + Localhost)
const allowedOrigins = [
  "https://bookings-client-three.vercel.app",
  "https://bookings-admin-one.vercel.app",
  "http://localhost:3000"
];

// ✅ CORS Middleware (Manual Headers)
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Credentials", "true"); // ✅ Allows cookies/auth headers
  }
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  
  // ✅ Handle Preflight Requests
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

// ✅ Log Incoming Requests
app.use((req, res, next) => {
  console.log(`🟢 Incoming request from: ${req.headers.origin}`);
  next();
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// ✅ API Routes
app.use("/api/rooms", roomRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/users", userRoutes);

// ✅ Default Route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// ✅ 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: "Not Found", path: req.path });
});

// ✅ Error Handling Middleware (should be the last middleware)
app.use(errorHandler);

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  await connectDB();
  console.log(`🚀 Server running on port ${PORT}`);
});
