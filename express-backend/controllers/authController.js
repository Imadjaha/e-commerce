import dotenv from "dotenv";
dotenv.config(); // load environment variables
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export const register = async (req, res) => {
  try {
    const { username, email, password, address, role } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // get allowed admin email
    const adminEmail = process.env.ADMIN_EMAIL;

    let assignedRole = role;

    if (role === "admin") {
      if (email !== adminEmail) {
        return res
          .status(403)
          .json({ message: "You are not allowed to register as an admin" });
      }
    } else {
      assignedRole = "user";
    }
    const newUser = await User.create({
      username,
      email,
      password,
      address,
      role: assignedRole,
    });

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error registering user" });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user || !(await user.matchPassword(password))) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
;
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error: error.message });
  }
};
