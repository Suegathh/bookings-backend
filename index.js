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

// Connect to database
connectDB();

// ✅ Middleware (ORDER MATTERS)
app.use(cookieParser()); // Handles cookies
app.use(express.json()); // Parses JSON
app.use(express.urlencoded({ extended: false })); // Parses form data

// ✅ CORS Configuration (Make Sure It's Correct)
const allowedOrigins = [
  "https://bookings-admin-one.vercel.app",
  "https://bookings-client-three.vercel.app",
];

app.use(
  cors({
    origin: allowedOrigins, // ✅ Allow only these origins
    credentials: true, // ✅ Allow cookies & authentication headers
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ✅ Handle Preflight Requests Manually
app.options("*", cors());

// ✅ Debugging Middleware (Check Headers Sent)
app.use((req, res, next) => {
  console.log("CORS Headers Sent:");
  console.log("Origin:", req.headers.origin);
  console.log("Allowed Origins:", allowedOrigins);
  console.log("Headers:", res.getHeaders());
  next();
});

// ✅ API Routes (AFTER CORS Middleware)
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
