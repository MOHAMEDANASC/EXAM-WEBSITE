import "../config/env.js";
import nodemailer from "nodemailer";
import User from "../models/User.js";

// Generate random 6-digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

console.log("📧 Email user loaded:", process.env.EMAIL_USER);

// ✅ Gmail SMTP Configuration (secure + compatible)
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // true for port 465
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

// ---- SEND OTP ----
export const sendOTP = async (req, res) => {
  try {
    const { name, email } = req.body;
    if (!name || !email)
      return res.status(400).json({ message: "Name and email are required" });

    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    let user = await User.findOne({ email });
    if (!user) user = new User({ name, email });
    user.otp = otp;
    user.otpExpiry = otpExpiry;
    user.verified = false;
    await user.save();

    // ✉️ Send OTP Email
    const mailOptions = {
      from: `"Exam System" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your Exam Login OTP",
      html: `
        <div style="font-family:sans-serif;">
          <h2>Hello ${name},</h2>
          <p>Your OTP for exam login is:</p>
          <h1 style="color:#4F46E5;">${otp}</h1>
          <p>This OTP will expire in 5 minutes.</p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ OTP email sent:", info.response);

    res.json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("❌ OTP send error:", error);
    res.status(500).json({ message: "Failed to send OTP. Check your email or network connection." });
  }
};


export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ message: "User not found" });
    if (user.otp !== otp) return res.status(400).json({ message: "Invalid OTP" });
    if (user.otpExpiry < Date.now())
      return res.status(400).json({ message: "OTP expired" });

    user.verified = true;
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    res.json({ message: "OTP verified successfully", user });
  } catch (error) {
    console.error("OTP verify error:", error);
    res.status(500).json({ message: "Verification failed" });
  }
};
