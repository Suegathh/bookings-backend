require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const roomRoutes = require("./routes/roomRoutes");
const { errorHandler } = require("./middleware/errorHandler");
const bookingRoutes = require("./routes/bookingRoutes");
const userRoutes = require("./routes/userRoutes");
const cookieParser = require("cookie-parser");

const app = express();
const port = process.env.PORT || 5000;

// ✅ Allow both frontend URLs
const allowedOrigins = [
  process.env.CLIENT_URL || "https://bookings-client-three.vercel.app",
  process.env.ADMIN_URL || "https://bookings-admin-one.vercel.app",
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));

// Middleware
app.use(cookieParser());
app.use(express.json());

// Routes
app.use("/api/rooms", roomRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/users", userRoutes);

// Default Route
app.get("/", (req, res) => {
  res.send("Backend is running...");
});

app.use(errorHandler);

app.listen(port, () => console.log(`Listening on port ${port}`));
