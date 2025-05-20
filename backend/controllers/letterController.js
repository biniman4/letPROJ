import Letter from "../models/Letter.js";
import User from "../models/User.js";
import nodemailer from "nodemailer";

// ...existing code...
export const createLetter = async (req, res) => {
  try {
    console.log("Received letter data:", req.body);

    // Find the sender user by name or email (assuming 'from' is a name or email)
    const sender =
      (await User.findOne({ name: req.body.from })) ||
      (await User.findOne({ email: req.body.from })) ||
      (await User.findById(req.body.from));

    if (!sender) {
      console.log("Sender not found:", req.body.from);
      return res.status(404).json({ error: "Sender user not found" });
    }

    // Find the recipient user by name
    const recipient = await User.findOne({ name: req.body.to });
    if (!recipient) {
      console.log("Recipient not found:", req.body.to);
      return res.status(404).json({ error: "Recipient user not found" });
    }

    // Optionally, resolve CC emails if you want to send to CC departments/employees
    let ccEmails = [];
    if (Array.isArray(req.body.ccEmployees)) {
      ccEmails = req.body.ccEmployees;
    } else if (
      req.body.ccEmployees &&
      typeof req.body.ccEmployees === "object"
    ) {
      for (const dept in req.body.ccEmployees) {
        const names = req.body.ccEmployees[dept];
        if (Array.isArray(names)) {
          const users = await User.find({ name: { $in: names } });
          ccEmails.push(...users.map((u) => u.email));
        }
      }
    }

    // Save the letter (store recipient's email for easy lookup in inbox)

    const letter = new Letter({
      ...req.body,
      from: sender._id,
      fromName: sender.name, // Add sender's name
      fromEmail: sender.email, // Add sender's email
      toEmail: recipient.email,
    });
    await letter.save();
    console.log("Letter saved to DB:", letter);

    // Send email to recipient and cc
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: recipient.email,
      cc: ccEmails,
      subject: req.body.subject,
      text: req.body.content,
    };

    await transporter.sendMail(mailOptions);
    console.log("Email sent to:", recipient.email);

    res.status(201).json({ message: "Letter created and emailed", letter });
  } catch (error) {
    console.error("Error in createLetter:", error);
    res.status(500).json({ error: error.message });
  }
};
// ...existing code...
export const getLetters = async (req, res) => {
  try {
    const letters = await Letter.find();
    res.status(200).json(letters);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
