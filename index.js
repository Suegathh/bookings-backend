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

app.use(
  cors({
    origin: [
      "https://bookings-admin-one.vercel.app", // ✅ First frontend
      "https://bookings-client-three.vercel.app", // ✅ Second frontend
    ],
    credentials: true, // ✅ Needed if using authentication (cookies/JWT)
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);


// API Routes
app.use("/api/rooms", roomRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/users", userRoutes);


// Error Handling Middleware
app.use(errorHandler);

// Start Server
app.listen(port, () => console.log(`Server running on port ${port}`));
app.get("/", (req, res) => {
    res.send("API is running...");
  });
  
  