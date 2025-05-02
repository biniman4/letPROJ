// filepath: backend/controllers/userController.js
import User from "../models/User.js";
import bcrypt from "bcryptjs";

export const registerUser = async (req, res) => {
  const { name, email, password, phone, departmentOrSector } = req.body;

  try {
    // Validate email
    if (!email || !email.trim()) {
      return res.status(400).json({ message: "Email is required" });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }
    const existingUser = await User.findOne({ email: email.trim() });
    if (existingUser) {
      return res.status(400).json({ message: "Email is already taken" });
    }

    // Validate password
    if (!password || !password.trim()) {
      return res.status(400).json({ message: "Password is required" });
    }
    if (password.trim().length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
    }

    // Hash password and save user
    const hashedPassword = await bcrypt.hash(password.trim(), 10);
    const user = new User({
      name: name.trim(),
      email: email.trim(),
      password: hashedPassword,
      phone: phone?.trim(),
      departmentOrSector: departmentOrSector?.trim(),
    });
    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const loginUser = async (req, res) => {
  console.log("Request Body:", req.body); // Debugging line
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    res.status(200).json({ message: "Login successful", user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
