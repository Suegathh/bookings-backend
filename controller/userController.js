const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("-password"); // Exclude password field
    if (!users || users.length === 0) {
      return res.status(400).json({ message: "Users not found" });
    }
    return res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};


const createUser = async (req, res, next) => {
  try {
    const { password, ...rest } = req.body;

    // Generate salt and hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      ...rest,
      password: hashedPassword,
    });

    if (!user) {
      return res.status(400).json({ message: "User not created" });
    }

    // Remove password from response
    const { password: userPassword, ...otherDetails } = user._doc;

    return res.status(201).json(otherDetails);
  } catch (error) {
    next(error);
  }
};

const loginUser = async (req, res, next) => {
    try {
      console.log("Login Request Body:", req.body);
      const { email, password } = req.body;
      const user = await User.findOne({ email });
  
      if (!user) {
        console.log("❌ User not found for email:", email);
        return res.status(400).json({ message: "User not found" });
      }
  
      const isCorrect = await bcrypt.compare(password, user.password);
  
      if (!isCorrect) {
        console.log("❌ Incorrect password for email:", email);
        return res.status(400).json({ message: "Incorrect password" });
      }
  
      // Generate token
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });
  
      // Set cookie properly
      res.cookie("jwt", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Use HTTPS in production
        sameSite: "None", // Fix for cross-origin requests
        maxAge: 24 * 60 * 60 * 1000, // 1 day
      });
  
      // Log cookie headers for debugging
      console.log("✅ Set-Cookie Header:", res.getHeaders()["set-cookie"]);
  
      // Send user details back
      const { password: userPassword, ...userDetails } = user._doc;
  
      return res.status(200).json({
        ...userDetails,
        token, // Also return token in JSON response for debugging
      });
    } catch (error) {
      console.error("❌ Login Error:", error);
      next(error);
    }
  };
  
  const logoutUser = async (req, res, next) => {
    try {
      console.log("Logout Route Accessed");
      console.log("Cookies Before Logout:", req.cookies); // Debugging
  
      res.cookie("jwt", "", {
        httpOnly: true,
        expires: new Date(0),
        secure: true, 
        sameSite: "None",
      });
  
      console.log("Cookies After Logout:", res.getHeaders()["set-cookie"]); // Debugging
  
      return res.status(200).json({ success: true, message: "Logged out successfully" });
    } catch (error) {
      console.error("Logout Error:", error);
      next(error);
    }
    
  };
module.exports = {
  getUsers,
  createUser,
  loginUser,
  logoutUser,
};
