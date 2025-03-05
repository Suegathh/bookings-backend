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

// ✅ Log Incoming Requests
app.use((req, res, next) => {
  console.log(`🟢 Incoming request from: ${req.headers.origin}`);
  next();
});

// ✅ Manually Set CORS Headers (Allow All Origins)
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); // Allow any origin
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  
  // ✅ Handle Preflight Requests
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

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
