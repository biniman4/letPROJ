// filepath: backend/controllers/userController.js
import User from "../models/User.js";
import bcrypt from "bcryptjs";

export const registerUser = async (req, res) => {
  const { name, email, password, phone, departmentOrSector } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      email,
      password: hashedPassword,
      phone,
      departmentOrSector,
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
