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

// ✅ Allowed Origins (UPDATE WITH YOUR DEPLOYED FRONTEND URL)
const allowedOrigins = [
  "https://bookings-client-three.vercel.app",  // Your frontend (Vercel)
  "https://bookings-admin-one.vercel.app",    // Admin panel (if applicable)
  "http://localhost:3000"  // Allow local development
];

// ✅ CORS Middleware (MUST BE BEFORE ROUTES)
app.use(
  cors({
    origin: allowedOrigins,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true, // Allow cookies (important for authentication)
    optionsSuccessStatus: 204,
  })
);

// ✅ Other Middleware
app.use(cookieParser()); 
app.use(express.json()); 
app.use(express.urlencoded({ extended: false }));

// ✅ Debugging CORS Issues (Optional)
app.use((req, res, next) => {
  console.log("Incoming Request:");
  console.log("Origin:", req.headers.origin);
  console.log("CORS Headers Set:", res.getHeaders());
  next();
});

// ✅ Routes
app.use("/api/rooms", roomRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/users", userRoutes);

// ✅ Default Route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// ✅ Error Handling Middleware
app.use(errorHandler);

// ✅ Start Server
app.listen(port, () => console.log(`Server running on port ${port}`));
