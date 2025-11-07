import nodemailer from "nodemailer";
import User from "../models/User.js";

// Generate random 6-digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// Configure Nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
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

    // Send OTP Email
    await transporter.sendMail({
      from: `"Exam System" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your Exam Login OTP",
      text: `Your OTP for exam login is ${otp}. It is valid for 5 minutes.`,
      html: `<h2>Your OTP: <b>${otp}</b></h2><p>Valid for 5 minutes.</p>`,
    });

    res.json({ message: "OTP sent successfully to email" });
  } catch (error) {
    console.error("OTP send error:", error);
    res.status(500).json({ message: "Failed to send OTP" });
  }
};

// ---- VERIFY OTP ----
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
