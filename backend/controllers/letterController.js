// filepath: backend/controllers/letterController.js
import Letter from "../models/Letter.js";

export const createLetter = async (req, res) => {
  try {
    const letter = new Letter(req.body);
    await letter.save();
    res.status(201).json({ message: "Letter created successfully", letter });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getLetters = async (req, res) => {
  try {
    const letters = await Letter.find();
    res.status(200).json(letters);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
