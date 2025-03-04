const dotenv = require("dotenv").config();
const express = require("express");
const cors = require("cors"); 
const cookieParser = require("cookie-parser");
const { errorHandler } = require("./middleware/errorHandler");
const path = require("path");
const connectDB = require("./config/db");
const roomRoutes = require("./routes/roomRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express(); // ✅ Initialize Express
const port = process.env.PORT || 5000;

// Connect to database
connectDB();

// Setup middlewares
app.use(cookieParser());
app.use(express.json());

app.use(
    cors({
      origin: [
        'http://localhost:3000', 
        'http://localhost:3001', 
        'http://127.0.0.1:3001'
      ],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
    })
  );


// Setup routes
app.use("/api/rooms", roomRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/users", userRoutes);

// Setup production

app.use(errorHandler);

app.listen(port, () => console.log(`listening on port ${port}`));
