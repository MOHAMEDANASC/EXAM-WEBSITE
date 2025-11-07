import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import otpRoutes from "./routes/otpRoutes.js"; // your OTP routes file

dotenv.config();
const app = express();

app.use(express.json());

// ✅ FIX: Proper CORS setup
app.use(cors({
  origin: ["http://localhost:3000", "https://exam-frontend.vercel.app"], // update if hosted frontend
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// routes
app.use("/api/otp", otpRoutes);

app.get("/", (req, res) => {
  res.send("Backend is running...");
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
