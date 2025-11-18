// controllers/otpController.js
import User from "../models/User.js";
import transporter from "../config/nodemailer.js";

// Generate 6-digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// SEND OTP — server sends email via transporter
export const sendOTP = async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: "Name and email are required" });
    }

    // Generate OTP and expiry
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    // Save or update user in DB
    let user = await User.findOne({ email });
    if (!user) {
      user = new User({ name, email, otp, otpExpiry, verified: false });
    } else {
      user.name = name;
      user.otp = otp;
      user.otpExpiry = otpExpiry;
      user.verified = false;
    }
    await user.save();

    // Prepare email
    const mailOptions = {
      from: `"Exam System" <${process.env.MAIL_USER || "no-reply@example.com"}>`,
      to: email,
      subject: "Your Exam OTP (valid for 5 minutes)",
      text: `Hello ${name},\n\nYour one-time password (OTP) is: ${otp}\nIt will expire in 5 minutes.\n\nIf you did not request this, ignore this email.`,
      html: `<p>Hello <strong>${name}</strong>,</p>
             <p>Your one-time password (OTP) is: <strong>${otp}</strong></p>
             <p>This OTP will expire in 5 minutes.</p>`,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    console.log("OTP GENERATED & EMAILED:", otp, "→", email);

    // For security: do not return OTP to client in production.
    res.status(200).json({
      message: "OTP generated and emailed successfully!",
      email,
    });
  } catch (error) {
    console.error("SEND OTP ERROR:", error);
    res.status(500).json({ message: "Server error sending OTP", error: error.message });
  }
};

// VERIFY OTP — returns user info and id on success
export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Please request an OTP first!" });
    }
    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }
    if (user.otpExpiry < Date.now()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    // Mark as verified
    user.verified = true;
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    console.log("OTP VERIFIED FOR:", email);

    // Return minimal user info including _id
    res.status(200).json({
      message: "OTP verified successfully!",
      user: { _id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error("VERIFY OTP ERROR:", error);
    res.status(500).json({ message: "Verification failed", error: error.message });
  }
};
