// filepath: backend/models/Letter.js
import mongoose from "mongoose";

const letterSchema = new mongoose.Schema({
  subject: { type: String, required: true },
  reference: { type: String, required: true },
  to: { type: String, required: true },
  department: String,
  priority: { type: String, default: "normal" },
  content: String,
  attachments: [String],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Letter", letterSchema);
