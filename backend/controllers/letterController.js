import Letter from "../models/Letter.js";
import User from "../models/User.js";
import nodemailer from "nodemailer";

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

    // Handle file attachment (multer puts it in req.file)
    let attachmentsArr = [];
    if (req.file) {
      console.log("Received file:", req.file.originalname); // <-- Add this line
      attachmentsArr.push(req.file.originalname);
    }

    // Prepare letter data, only include ccEmployees if it's a valid object
    const letterData = {
      ...req.body,
      from: sender._id,
      fromName: sender.name,
      fromEmail: sender.email,
      toEmail: recipient.email,
      attachments: attachmentsArr, // Save file name(s) in DB
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

    // ...existing code...
    const mailOptions = {
      from: `"${sender.name} (${req.body.department})" <${sender.email}>`, // Show sender name and department
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
    // ...existing code...

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
