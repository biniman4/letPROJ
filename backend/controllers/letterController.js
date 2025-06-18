import Letter from "../models/Letter.js";
import User from "../models/User.js";
import Notification from "../models/Notification.js";
import nodemailer from "nodemailer";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// CREATE LETTER
export const createLetter = async (req, res) => {
  try {
    console.log("Received letter data:", req.body);

    // Handle 'from' as array or string, filter out empty values
    let fromValue = req.body.from;
    if (Array.isArray(fromValue)) {
      fromValue = fromValue.find((val) => val && val.trim() !== "");
    }
    if (!fromValue || fromValue.trim() === "") {
      return res.status(400).json({ error: "Sender information is missing" });
    }

    // Find the sender user by name or email or ID
    const senderById = mongoose.Types.ObjectId.isValid(fromValue)
      ? await User.findById(fromValue)
      : null;
    const senderByName = await User.findOne({ name: fromValue });
    const senderByEmail = await User.findOne({ email: fromValue });

    console.log("Sender search results:", {
      byId: senderById,
      byName: senderByName,
      byEmail: senderByEmail,
    });

    const sender = senderById || senderByName || senderByEmail;

    if (!sender) {
      console.log("Sender not found:", fromValue);
      return res.status(404).json({ error: "Sender user not found" });
    }

    // Find the recipient user by name
    const recipient = await User.findOne({ name: req.body.to });
    if (!recipient) {
      console.log("Recipient not found:", req.body.to);
      return res.status(404).json({ error: "Recipient user not found" });
    }

    // Parse ccEmployees if it's a stringified object
    let ccEmployees = req.body.ccEmployees;
    if (typeof ccEmployees === "string") {
      try {
        ccEmployees = JSON.parse(ccEmployees);
      } catch (e) {
        ccEmployees = {};
      }
    }
    if (
      typeof ccEmployees !== "object" ||
      ccEmployees === null ||
      Array.isArray(ccEmployees)
    ) {
      ccEmployees = {};
    }

    // Optionally, resolve CC emails if you want to send to CC departments/employees
    let ccEmails = [];
    if (Array.isArray(ccEmployees)) {
      ccEmails = ccEmployees;
    } else if (ccEmployees && typeof ccEmployees === "object") {
      for (const dept in ccEmployees) {
        const names = ccEmployees[dept];
        if (Array.isArray(names)) {
          const users = await User.find({ name: { $in: names } });
          ccEmails.push(...users.map((u) => u.email));
        }
      }
    }

    // Handle file attachment for MongoDB storage
    let attachmentsArr = [];
    if (req.file) {
      attachmentsArr.push({
        filename: req.file.originalname,
        contentType: req.file.mimetype,
        data: req.file.buffer,
        uploadDate: new Date(),
      });
    }

    // Only include fields that exist in the schema (NO "reference" field)
    const isHighPriority = req.body.priority && ["high", "urgent"].includes(req.body.priority.toLowerCase());
    const letterData = {
      subject: req.body.subject,
      from: sender._id,
      fromName: sender.name,
      fromEmail: sender.email,
      to: req.body.to,
      toEmail: recipient.email,
      department: req.body.department,
      priority: req.body.priority || "normal",
      content: req.body.content,
      attachments: attachmentsArr,
      cc: req.body.cc || [],
      ccEmployees: ccEmployees,
      unread: true,
      starred: false,
      status: isHighPriority ? "pending" : "sent",
    };

    const letter = new Letter(letterData);
    await letter.save();
    console.log("Letter saved to DB:", letter);

    if (isHighPriority) {
      // Do not send email, just notify admin (optional: create admin notification here)
      return res.status(201).json({ message: "High/urgent priority letter pending admin approval.", letter });
    }

    // Create notification for the recipient
    const notification = new Notification({
      recipient: recipient._id,
      type: "new_letter",
      title: "New Letter Received",
      message: `You have received a new letter from ${sender.name} regarding "${req.body.subject}"`,
      relatedLetter: letter._id,
      priority: req.body.priority === "urgent" ? "high" : "medium",
    });
    await notification.save();

    // Send email to recipient and cc, with attachment if present
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"${sender.name} (${req.body.department})" <${sender.email}>`,
      to: recipient.email,
      cc: ccEmails,
      subject: req.body.subject,
      text:
        `From: ${sender.name} <${sender.email}>\n` +
        `Department: ${req.body.department}\n\n` +
        `Subject: ${req.body.subject}\n\n` +
        `${req.body.content}`,
      html: `
      <div>
        <p><strong>From:</strong> ${sender.name} &lt;${sender.email}&gt;</p>
        <p><strong>Department:</strong> ${req.body.department}</p>
        <p><strong>Subject:</strong> ${req.body.subject}</p>
        <hr>
        <p>${req.body.content.replace(/\n/g, "<br>")}</p>
      </div>
    `,
      attachments: req.file
        ? [
            {
              filename: req.file.originalname,
              content: req.file.buffer,
            },
          ]
        : [],
    };

    await transporter.sendMail(mailOptions);
    console.log("Email sent to:", recipient.email);

    res.status(201).json({ message: "Letter created and emailed", letter });
  } catch (error) {
    console.error("Error in createLetter:", error);
    res.status(500).json({ error: error.message });
  }
};

// GET ALL LETTERS
export const getLetters = async (req, res) => {
  try {
    console.log("Fetching all letters from the database...");
    const letters = await Letter.find();
    console.log("Fetched letters:", letters);
    res.status(200).json(letters);
  } catch (error) {
    console.error("Error in getLetters:", error);
    res.status(500).json({ error: error.message });
  }
};

// FILE DOWNLOAD
export const downloadFile = async (req, res) => {
  try {
    const { letterId, filename } = req.params;

    const letter = await Letter.findById(letterId);
    if (!letter) {
      return res.status(404).json({ error: "Letter not found" });
    }

    const attachment = letter.attachments.find(
      (att) => att.filename === filename
    );

    if (!attachment) {
      return res.status(404).json({ error: "File not found" });
    }

    res.setHeader("Content-Type", attachment.contentType);
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${attachment.filename}"`
    );
    res.send(attachment.data);
  } catch (error) {
    console.error("Error in downloadFile:", error);
    res.status(500).json({ error: error.message });
  }
};

// FILE VIEW
export const viewFile = async (req, res) => {
  try {
    const { letterId, filename } = req.params;

    const letter = await Letter.findById(letterId);
    if (!letter) {
      return res.status(404).json({ error: "Letter not found" });
    }

    const attachment = letter.attachments.find(
      (att) => att.filename === filename
    );

    if (!attachment) {
      return res.status(404).json({ error: "File not found" });
    }

    res.setHeader("Content-Type", attachment.contentType);
    res.setHeader("Content-Disposition", "inline");
    res.send(attachment.data);
  } catch (error) {
    console.error("Error in viewFile:", error);
    res.status(500).json({ error: error.message });
  }
};

// UPDATE LETTER STATUS
export const updateLetterStatus = async (req, res) => {
  try {
    const { letterId, unread, starred, status } = req.body;

    const updateFields = {};
    if (unread !== undefined) updateFields.unread = unread;
    if (starred !== undefined) updateFields.starred = starred;
    if (status !== undefined) updateFields.status = status;

    const updatedLetter = await Letter.findByIdAndUpdate(
      letterId,
      { $set: updateFields },
      { new: true }
    );

    if (!updatedLetter) {
      return res.status(404).json({ message: "Letter not found" });
    }

    // Create notification for letter status changes
    if (unread === false) {
      const notification = new Notification({
        recipient: updatedLetter.from,
        type: "letter_read",
        title: "Letter Read",
        message: `${updatedLetter.to} has read your letter regarding "${updatedLetter.subject}"`,
        relatedLetter: updatedLetter._id,
        priority: "low",
      });
      await notification.save();
    }

    if (starred === true) {
      const notification = new Notification({
        recipient: updatedLetter.from,
        type: "letter_starred",
        title: "Letter Starred",
        message: `${updatedLetter.to} has starred your letter regarding "${updatedLetter.subject}"`,
        relatedLetter: updatedLetter._id,
        priority: "low",
      });
      await notification.save();
    }

    res.json(updatedLetter);
  } catch (error) {
    console.error("Error updating letter status:", error);
    res.status(500).json({ message: "Error updating letter status" });
  }
};

// GET SENT LETTERS
export const getSentLetters = async (req, res) => {
  try {
    const sentLetters = await Letter.find({ status: "sent" }).sort({
      createdAt: -1,
    });
    res.status(200).json(sentLetters);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE LETTER
export const deleteLetter = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedLetter = await Letter.findByIdAndDelete(id);

    if (!deletedLetter) {
      return res.status(404).json({ message: "Letter not found" });
    }

    res.status(200).json({ message: "Letter deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting letter", error });
  }
};

// ADMIN: Approve a pending letter and send it
export const approveLetter = async (req, res) => {
  try {
    const { letterId } = req.body;
    const letter = await Letter.findById(letterId);
    if (!letter) {
      return res.status(404).json({ error: "Letter not found" });
    }
    if (letter.status !== "pending") {
      return res.status(400).json({ error: "Letter is not pending approval" });
    }

    // Find sender and recipient
    const sender = await User.findById(letter.from);
    const recipient = await User.findOne({ name: letter.to });
    if (!sender || !recipient) {
      return res.status(404).json({ error: "Sender or recipient not found" });
    }

    // Optionally, resolve CC emails
    let ccEmails = [];
    if (Array.isArray(letter.ccEmployees)) {
      ccEmails = letter.ccEmployees;
    } else if (letter.ccEmployees && typeof letter.ccEmployees === "object") {
      for (const dept in letter.ccEmployees) {
        const names = letter.ccEmployees[dept];
        if (Array.isArray(names)) {
          const users = await User.find({ name: { $in: names } });
          ccEmails.push(...users.map((u) => u.email));
        }
      }
    }

    // Send email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"${sender.name} (${letter.department})" <${sender.email}>`,
      to: recipient.email,
      cc: ccEmails,
      subject: letter.subject,
      text:
        `From: ${sender.name} <${sender.email}>\n` +
        `Department: ${letter.department}\n\n` +
        `Subject: ${letter.subject}\n\n` +
        `${letter.content}`,
      html: `
      <div>
        <p><strong>From:</strong> ${sender.name} &lt;${sender.email}&gt;</p>
        <p><strong>Department:</strong> ${letter.department}</p>
        <p><strong>Subject:</strong> ${letter.subject}</p>
        <hr>
        <p>${letter.content.replace(/\n/g, "<br>")}</p>
      </div>
    `,
      attachments: letter.attachments && letter.attachments.length > 0
        ? letter.attachments.map(att => ({
            filename: att.filename,
            content: att.data,
          }))
        : [],
    };

    await transporter.sendMail(mailOptions);
    letter.status = "sent";
    await letter.save();

    // Create notification for the recipient
    const notification = new Notification({
      recipient: recipient._id,
      type: "new_letter",
      title: "New Letter Received",
      message: `You have received a new letter from ${sender.name} regarding "${letter.subject}"`,
      relatedLetter: letter._id,
      priority: letter.priority === "urgent" ? "high" : "medium",
    });
    await notification.save();

    res.status(200).json({ message: "Letter approved and sent", letter });
  } catch (error) {
    console.error("Error in approveLetter:", error);
    res.status(500).json({ error: error.message });
  }
};

// GET ALL PENDING LETTERS (for admin)
export const getPendingLetters = async (req, res) => {
  try {
    const pendingLetters = await Letter.find({ status: "pending" }).sort({ createdAt: -1 });
    res.status(200).json(pendingLetters);
  } catch (error) {
    console.error("Error in getPendingLetters:", error);
    res.status(500).json({ error: error.message });
  }
};
