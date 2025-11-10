import express from "express";
import Result from "../models/Result.js";
import Question from "../models/questionText.js";

const router = express.Router();

// Admin password check
const checkAdmin = (req, res, next) => {
  const { adminpassword } = req.headers;
  if (adminpassword !== "examadmin123") {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
};

// ✅ Analytics: get all student results
router.get("/analytics", checkAdmin, async (req, res) => {
  try {
    const results = await Result.find().populate("userId", "name");
    res.json(results);
  } catch (error) {
    console.error("Error fetching analytics:", error);
    res.status(500).json({ message: "Failed to load analytics" });
  }
});

// ✅ Question stats (placeholder — can be improved if answers are stored)
router.get("/question-stats", checkAdmin, async (req, res) => {
  try {
    const questions = await Question.find();
    const stats = questions.map((q, i) => ({
      id: `Q${i + 1}`,
      questionText: q.questionText,
      totalAttempts: 50, // placeholder — replace with actual later
      correctAttempts: Math.floor(Math.random() * 50),
      accuracy: Math.floor(Math.random() * 100),
    }));
    res.json(stats);
  } catch (error) {
    console.error("Error fetching question stats:", error);
    res.status(500).json({ message: "Failed to load question stats" });
  }
});

export default router;

