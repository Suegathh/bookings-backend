const cors = require("cors");

// ✅ Allow CORS for both frontends
app.use(
  cors({
    origin: [
      "https://bookings-admin-one.vercel.app",
      "https://bookings-client-three.vercel.app",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ✅ Manually Allow CORS for All Routes
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", req.headers.origin);
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

// ✅ API Routes
app.use("/api/rooms", roomRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/users", userRoutes);

// ✅ Root Route for Testing
app.get("/", (req, res) => {
  res.send("API is running...");
});

// ✅ Error Handling Middleware
app.use(errorHandler);

// ✅ Start Server
app.listen(port, () => console.log(`Server running on port ${port}`));
