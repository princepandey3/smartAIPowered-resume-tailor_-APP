import express from "express";
import User from "../model/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "1d", // Token will expire in 30 days
  });
};

export const register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const Userexists = await User.findOne({ email });
    if (Userexists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create new user
    const user = await User.create({ name, email, password });
    await user.save();

    // Generate token for the user
    const token = generateToken(user._id);

    console.log(User);
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      message: "User registered successfully",
    });
  } catch (error) {
    console.log("Error in user registration: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = generateToken(user._id);
    console.log("User logged in successfully");
    res.status(200).json({
      token,
      _id: user._id,
      name: user.name,
      email: user.email,
      message: "User logged in successfully",
    });

    user.lastlogin = new Date();
    await user.save();

    console.log("Token generated successfully", token);
  } catch (error) {
    console.log("Error in user login: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const authenticate = async (req, res, next) => {
  try {
    // const user = req.user;
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ error: "Invalid token" });
    }
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token expired" });
    }
    res.status(500).json({ error: "Server error during authentication" });
  }
};
