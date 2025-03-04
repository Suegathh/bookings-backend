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

// ✅ Setup CORS Properly
const allowedOrigins = [
  "https://bookings-admin-one.vercel.app",
  "https://bookings-client-three.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // ✅ Allow credentials (cookies, JWT)
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ✅ Handle Preflight Requests Manually
app.options("*", cors());

// ✅ Middleware
app.use(cookieParser());
app.use(express.json());

// ✅ API Routes
app.use("/api/rooms", roomRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/users", userRoutes);

// ✅ Default API Test Route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// ✅ Error Handling Middleware
app.use(errorHandler);

// ✅ Start Server
app.listen(port, () => console.log(`Server running on port ${port}`));
