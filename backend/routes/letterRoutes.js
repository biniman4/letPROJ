// backend/routes/letterRoutes.js
import express from "express";
import multer from "multer";
import {
  createLetter,
  getLetters,
  downloadFile,
  viewFile,
} from "../controllers/letterController.js";

const router = express.Router();

// Configure multer to store files in memory
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Invalid file type. Only PDF, JPEG, and PNG files are allowed."
        ),
        false
      );
    }
  },
});

// Keep your existing routes
router.post("/", upload.single("attachment"), createLetter);
router.get("/", getLetters);
router.get("/download/:letterId/:filename", downloadFile);
router.get("/view/:letterId/:filename", viewFile);

export default router;
