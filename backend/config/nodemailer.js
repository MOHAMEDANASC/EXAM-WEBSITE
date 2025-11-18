// config/nodemailer.js
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();  // ensure .env is loaded

const transporter = nodemailer.createTransport({
  service: "gmail",   // ✅ REQUIRED FOR GMAIL SMTP
  auth: {
    user: process.env.MAIL_USER,  // your Gmail
    pass: process.env.MAIL_PASS,  // your App Password (no spaces)
  },
});

transporter
  .verify()
  .then(() => {
    console.log("✅ Gmail transporter verified & ready");
  })
  .catch((err) => {
    console.warn("⚠️ Gmail transporter error:", err.message || err);
  });

export default transporter;
