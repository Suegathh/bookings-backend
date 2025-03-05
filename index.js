const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const errorHandler = require("./middleware/errorHandler");

const connectDB = require("./config/db");
const roomRoutes = require("./routes/roomRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const userRoutes = require("./routes/userRoutes");

// Initialize Express App
const app = express();

// ✅ CORS Configuration
const allowedOrigins = [
  "https://bookings-admin-one.vercel.app",
  "https://bookings-client-three.vercel.app",
  "http://localhost:3000",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // ✅ Allows cookies & authentication
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // ✅ Allowed Methods
    allowedHeaders: ["Content-Type", "Authorization"], // ✅ Allowed Headers
  })
);

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
