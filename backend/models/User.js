import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true, // ✅ make email unique instead
   },
  phone: {
    type: String, sparse: true, unique: true, default: null
  },
  otp: { type: String },
  otpExpiry: { type: Date },
  verified: { type: Boolean, default: false },
});

export default mongoose.model("User", userSchema);
