import express, { Request, Response, Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user";

const router: Router = express.Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 */
router.post("/register", async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      res
        .status(400)
        .json({ msg: "This username is already claimed in the archives." });
      return;
    }

    // Secure the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({ msg: "User successfully inscribed." });
  } catch (err) {
    console.error("Registration Error:", err);
    res.status(500).send("Server Error in the Auth Chambers");
  }
});

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user & get token
 */
router.post("/login", async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;

    // Find user by username
    const user = await User.findOne({ username });
    if (!user) {
      res.status(400).json({ msg: "Invalid Credentials" });
      return;
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ msg: "Invalid Credentials" });
      return;
    }

    // Create a JSON Web Token (JWT)
    // In production, use a strong secret from your .env file
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || "arcane_secret_key",
      { expiresIn: "2h" },
    );

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
      },
    });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).send("Server Error during Authentication");
  }
});

export default router;
