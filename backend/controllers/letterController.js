import Letter from "../models/Letter.js";
import User from "../models/User.js";
import nodemailer from "nodemailer";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ...existing code...
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
    const sender =
      (await User.findOne({ name: fromValue })) ||
      (await User.findOne({ email: fromValue })) ||
      (await User.findById(fromValue));

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

    // Prepare letter data, only include ccEmployees if it's a valid object
    const letterData = {
      ...req.body,
      from: sender._id,
      fromName: sender.name,
      fromEmail: sender.email,
      toEmail: recipient.email,
      attachments: attachmentsArr,
    };
    letterData.ccEmployees = ccEmployees;

    const letter = new Letter(letterData);
    await letter.save();
    console.log("Letter saved to DB:", letter);

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
// ...existing code...
export const getLetters = async (req, res) => {
  try {
    const letters = await Letter.find();
    res.status(200).json(letters);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

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

export const updateLetterStatus = async (req, res) => {
  try {
    const { letterId, unread, starred } = req.body;

    const updatedLetter = await Letter.findByIdAndUpdate(
      letterId,
      {
        $set: {
          unread: unread !== undefined ? unread : undefined,
          starred: starred !== undefined ? starred : undefined,
        },
      },
      { new: true }
    );

    if (!updatedLetter) {
      return res.status(404).json({ message: "Letter not found" });
    }

    res.json(updatedLetter);
  } catch (error) {
    console.error("Error updating letter status:", error);
    res.status(500).json({ message: "Error updating letter status" });
  }
};
