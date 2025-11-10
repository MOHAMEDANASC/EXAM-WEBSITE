import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";

import otpRoutes from "./routes/otpRoutes.js";
import examRoutes from "./routes/examRoutes.js";
import resultRoutes from "./routes/resultRoutes.js";
import questionRoutes from "./routes/questionRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";

dotenv.config();
const app = express();

const allowedOrigins = [
  "http://localhost:3000",
  "https://online-exam-frontend-5a6cmsg0d-mohamed-anas-cs-projects.vercel.app"
];

// ✅ FIXED CORS — allows frontend access
app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

app.use(express.json());

// ✅ Connect DB
connectDB();

// ✅ Routes
app.use("/api/otp", otpRoutes);
app.use("/api/exam", examRoutes);
app.use("/api/result", resultRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/analytics", analyticsRoutes);

// ✅ Test route
app.get("/", (req, res) => {
  res.send("✅ Backend is running and CORS enabled");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
