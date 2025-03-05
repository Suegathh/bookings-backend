const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const auth = async (req, res, next) => {
  try {
    console.log("Cookies Received:", req.cookies); 

    let token = req.cookies.jwt; // First, check cookies
    if (!token && req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1]; // Extract token from header
    }

    if (!token) {
      console.log("❌ No token found in cookies or headers");
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    const data = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(data.id);

    if (!user) {
      console.log("❌ Token verification failed, user not found");
      return res.status(401).json({ message: "Not authorized" });
    }

    req.user = user;
    console.log("✅ User authenticated:", user.email);
    next();
  } catch (error) {
    console.log("❌ Auth error:", error.message);
    return res.status(401).json({ message: "Token verification failed" });
  }
};


module.exports = { auth };
