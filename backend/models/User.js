import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    otp: String,
    otpExpiry: Date,
    verified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
