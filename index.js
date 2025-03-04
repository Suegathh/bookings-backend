const dotenv = require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
const { errorHandler } = require("./middleware/errorHandler");
const connectDB = require("./config/db");
const roomRoutes = require("./routes/roomRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();
const port = process.env.PORT || 5000;

// Connect to database
connectDB();

// Middlewares
app.use(cookieParser());
app.use(express.json());

// ✅ CORS Configuration
const corsOptions = {
  origin: [
    "https://bookings-admin-one.vercel.app",
    "https://bookings-client-three.vercel.app"
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
};

// Apply CORS to all routes
app.use(cors(corsOptions));

// ✅ Explicit CORS handling for root route
app.options('/', cors(corsOptions)); // Handle preflight requests
app.get('/', cors(corsOptions), (req, res) => {
  res.header('Content-Type', 'application/json');
  res.json({ message: "API is running..." });
});

// ✅ API Routes
app.use("/api/rooms", roomRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/users", userRoutes);

// ✅ Error Handling Middleware
app.use(errorHandler);

// ✅ Start Server
app.listen(port, () => console.log(`Server running on port ${port}`));