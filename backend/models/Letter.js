import mongoose from "mongoose";

const letterSchema = new mongoose.Schema({
  subject: { type: String, required: true },
  reference: { type: String, required: true },
  to: { type: String, required: true },
  department: { type: String, required: true }, // Updated to required
  priority: { type: String, default: "normal" },
  content: { type: String, required: true }, // Updated to required
  attachments: [String],
  cc: [String], // Added cc field
  ccEmployees: { type: Map, of: String }, // Added ccEmployees field
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Letter", letterSchema);
