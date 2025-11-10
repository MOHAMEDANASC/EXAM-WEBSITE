import express from "express";
import Result from "../models/Result.js";
import User from "../models/User.js";

const router = express.Router();

// ✅ Admin-only middleware
const checkAdmin = (req, res, next) => {
  const adminPassword = req.headers["adminpassword"];
  if (adminPassword !== "examadmin123") {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
};

// ✅ Get all results (for Leaderboard, Analytics)
router.get("/", checkAdmin, async (req, res) => {
  try {
    const results = await Result.find()
      .populate("userId", "name phone email") // 👈 this "populates" student info
      .sort({ score: -1, createdAt: -1 });

    res.json(results);
  } catch (error) {
    console.error("Error fetching results:", error);
    res.status(500).json({ message: "Failed to fetch results" });
  }
});

// ✅ Get a specific user’s latest result
router.get("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await Result.findOne({ userId }).sort({ createdAt: -1 });

    if (!result) {
      return res.status(404).json({ message: "Result not found" });
    }

    res.json(result);
  } catch (error) {
    console.error("Error fetching user result:", error);
    res.status(500).json({ message: "Failed to fetch user result" });
  }
});

// ✅ Save Result (used when student submits exam)
router.post("/", async (req, res) => {
  try {
    const { userId, correct, wrong, total, score, totalMarks } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const newResult = new Result({
      userId,
      correct,
      wrong,
      total,
      score,
      totalMarks,
    });

    await newResult.save();
    res.status(201).json({ message: "Result saved successfully", result: newResult });
  } catch (error) {
    console.error("Error saving result:", error);
    res.status(500).json({ message: "Failed to save result" });
  }
});

export default router;
