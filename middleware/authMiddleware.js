const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const auth = async (req, res, next) => {
  try {
    console.log("🔍 Cookies Received:", req.cookies);

    let token = req.cookies.jwt; // Check token in cookies first
    if (!token && req.headers.authorization?.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1]; // Extract token from Authorization header
    }

    if (!token) {
      console.log("❌ No token found in cookies or headers");
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    console.log("🔑 Received Token:", token.substring(0, 10) + "...");

    // ✅ Using a Promise-based approach for `jwt.verify`
    const decoded = await new Promise((resolve, reject) => {
      jwt.verify(token, process.env.JWT_SECRET, (err, data) => {
        if (err) reject(err);
        else resolve(data);
      });
    });

    // ✅ Fetch user from database and remove password field
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      console.log("❌ Token valid, but user not found in DB");
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    console.log("✅ User authenticated:", user.email);
    next();
  } catch (error) {
    console.error("❌ Auth error:", error.message);
    
    // Provide specific error messages based on JWT verification failures
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired, please log in again" });
    } else if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token, authentication failed" });
    }

    return res.status(500).json({ message: "Server error, authentication failed" });
  }
};

module.exports = { auth };
