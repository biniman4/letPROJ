// filepath: backend/routes/letterRoutes.js
import express from "express";
import multer from "multer";
import { createLetter, getLetters } from "../controllers/letterController.js";

const router = express.Router();
const upload = multer(); // Use memory storage for now

// Use upload.single('attachment') for single file upload
router.post("/", upload.single("attachment"), createLetter);
router.get("/", getLetters);

export default router;
