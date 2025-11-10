import { Resend } from "resend";
import dotenv from "dotenv";
import User from "../models/User.js";

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

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

    // ✅ Send OTP using Resend
    await resend.emails.send({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: "Your Exam Login OTP",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2>Hi ${name || "User"},</h2>
          <p>Your OTP for exam login is:</p>
          <h1 style="color:#4f46e5;">${otp}</h1>
          <p>This OTP is valid for 5 minutes.</p>
          <br/>
          <p>Best regards,<br/>Exam System</p>
        </div>
      `,
    });

    res.json({ message: "✅ OTP sent successfully to email" });
  } catch (error) {
    console.error("❌ OTP send error:", error);
    res.status(500).json({ message: "Failed to send OTP", error: error.message });
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

    res.json({ message: "✅ OTP verified successfully", user });
  } catch (error) {
    console.error("❌ OTP verify error:", error);
    res.status(500).json({ message: "Verification failed" });
  }
};
