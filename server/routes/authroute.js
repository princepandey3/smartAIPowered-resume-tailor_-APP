//authroute.js
import express from "express";
import User from "../model/User.js";
import { authenticate, login, register } from "../middleware/userauth.js";

const router = express.Router();

router.post("/register", register);

router.post("/login", login);

// Get current user
router.get("/profile", authenticate, async (req, res) => {
  try {
    const user = req.user; // User is set by the authenticate middleware
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
