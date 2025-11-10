import dotenv from "dotenv";
dotenv.config(); // ✅ must come first

import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import otpRoutes from "./routes/otpRoutes.js";
import examRoutes from "./routes/examRoutes.js";
import questionRoutes from "./routes/questionRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import resultRoutes from "./routes/resultRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";




const app = express();

app.use(express.json());

// ✅ FIX: Proper CORS setup
app.use(cors({
  origin: "http://localhost:3000", // update if hosted frontend
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// routes
app.use("/api/otp", otpRoutes);
app.use("/api/exam", examRoutes); 
app.use("/api/questions", questionRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/result", resultRoutes);
app.use("/api/admin", analyticsRoutes);



app.get("/", (req, res) => {
  res.send("Backend is running...");
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
