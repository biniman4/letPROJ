import express from "express";
import multer from "multer";
import {
  createLetter,
  getLetters,
  downloadFile,
  viewFile,
} from "../controllers/letterController.js";

const router = express.Router();

// Use disk storage for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // You may want to use a unique name in production
  },
});
const upload = multer({ storage });

// Use upload.single('attachment') for single file upload
router.post("/", upload.single("attachment"), createLetter);
router.get("/", getLetters);

router.get("/download/:filename", downloadFile);
router.get("/view/:filename", viewFile);

export default router;
