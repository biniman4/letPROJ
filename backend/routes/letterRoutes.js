import express from "express";
import { createLetter, getLetters } from "../controllers/letterController.js";

const router = express.Router();

router.post("/", createLetter);
router.get("/", getLetters);

export default router;
