const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    if (!users) {
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
      const { email, password } = req.body;
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.status(400).json({ message: "User not found" });
      }
  
      const isCorrect = await bcrypt.compare(password, user.password);
  
      if (!isCorrect) {
        return res.status(400).json({ message: "Incorrect password" });
      }
  
      // Generate token
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });
  
      // 🔥 Ensure cookie is sent correctly
      res.cookie("jwt", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production" ? true : false,
        sameSite: "lax", 
        maxAge: 24 * 60 * 60 * 1000, // 1 day
      });
  
      // Send user details back (excluding password)
      const { password: userPassword, ...userDetails } = user._doc;
  
      return res.status(200).json({
        ...userDetails,
        token // Include token in response
      });
    } catch (error) {
      next(error);
    }
  };
const logoutUser = async (req, res, next) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
    sameSite: "strict",
  });
  return res.json({ message: "You have been logged out" });
};

module.exports = {
  getUsers,
  createUser,
  loginUser,
  logoutUser,
};
