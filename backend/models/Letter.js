import mongoose from "mongoose";

const letterSchema = new mongoose.Schema({
  subject: { type: String, required: true },
  reference: { type: String, required: true },
  from: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  fromName: { type: String, required: true },
  fromEmail: { type: String, required: true },
  to: { type: String, required: true },
  department: { type: String, required: true },
  priority: { type: String, default: "normal" },
  content: { type: String, required: true },
  attachments: [String],
  cc: [String],
  ccEmployees: { type: Map, of: [String] },
  toEmail: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Letter", letterSchema);
