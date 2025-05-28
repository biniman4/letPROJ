import mongoose from "mongoose";
import { Buffer } from "buffer";

const letterSchema = new mongoose.Schema(
  {
    subject: { type: String, required: true },
    reference: { type: String, required: true },
    from: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    fromName: { type: String, required: true },
    fromEmail: { type: String, required: true },
    to: { type: String, required: true },
    department: { type: String, required: true },
    priority: { type: String, default: "normal" },
    content: { type: String, required: true },
    unread: { type: Boolean, default: true },
    starred: { type: Boolean, default: false },
    attachments: [
      {
        filename: String,
        contentType: String,
        data: Buffer,
        uploadDate: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    cc: [String],
    ccEmployees: { type: Map, of: [String] },
    toEmail: { type: String, required: true },
  },
  { timestamps: true }
);

const Letter = mongoose.model("Letter", letterSchema);
export default Letter;
