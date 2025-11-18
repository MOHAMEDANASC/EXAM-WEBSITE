import express from "express";
import Result from "../models/Result.js";
import User from "../models/User.js";
import Question from "../models/questionText.js";

const router = express.Router();

// 🧠 Helper function
const checkAdmin = (req, res, next) => {
  const adminPassword = req.headers["adminpassword"];
  if (adminPassword !== "examadmin123") {
    return res.status(401).json({ message: "Unauthorized access" });
  }
  next();
};



// ✅ Leaderboard
router.get("/leaderboard", checkAdmin, async (req, res) => {
  try {
    const leaderboard = await Result.find()
      .populate("userId", "name email phone")
      .sort({ score: -1 })
      .limit(50);
    res.json(leaderboard);
  } catch (error) {
    console.error("Leaderboard error:", error);
    res.status(500).json({ message: "Failed to load leaderboard" });
  }
});

// ✅ Analytics
router.get("/analytics", checkAdmin, async (req, res) => {
  try {
    const results = await Result.find().populate("userId", "name email");

    if (!results.length) {
      return res.json({
        message: "No exam results found",
        results: [],
      });
    }

    const totalExams = results.length;
    const totalStudents = new Set(results.map((r) => r.userId?._id?.toString())).size;
    const avgScore = (
      results.reduce((sum, r) => sum + (r.score || 0), 0) / totalExams
    ).toFixed(2);
    const highest = Math.max(...results.map((r) => r.score));
    const lowest = Math.min(...results.map((r) => r.score));

    const distribution = [
      { range: "0-20%", count: results.filter(r => (r.score / r.totalMarks) * 100 <= 20).length },
      { range: "21-40%", count: results.filter(r => (r.score / r.totalMarks) * 100 > 20 && (r.score / r.totalMarks) * 100 <= 40).length },
      { range: "41-60%", count: results.filter(r => (r.score / r.totalMarks) * 100 > 40 && (r.score / r.totalMarks) * 100 <= 60).length },
      { range: "61-80%", count: results.filter(r => (r.score / r.totalMarks) * 100 > 60 && (r.score / r.totalMarks) * 100 <= 80).length },
      { range: "81-100%", count: results.filter(r => (r.score / r.totalMarks) * 100 > 80).length },
    ];

    res.json({
      totalStudents,
      totalExams,
      avgScore,
      highest,
      lowest,
      distribution,
      results,
    });
  } catch (error) {
    console.error("Analytics error:", error);
    res.status(500).json({ message: "Failed to load analytics" });
  }
});

// ✅ Question Stats (Real Data)
router.get("/question-stats", checkAdmin, async (req, res) => {
  try {
    const questions = await Question.find();
    const results = await Result.find();

    if (!questions.length) {
      return res.json({ message: "No questions found", data: [] });
    }

    // Build question-level analytics
    const questionStats = questions.map((q) => {
      let totalAttempts = 0;
      let correctAttempts = 0;

      results.forEach((r) => {
        if (Array.isArray(r.answers)) {
          r.answers.forEach((ans) => {
            if (ans.questionId?.toString() === q._id.toString()) {
              totalAttempts++;
              if (ans.selectedOption === q.correctAnswer) correctAttempts++;
            }
          });
        }
      });

      const accuracy =
        totalAttempts > 0
          ? ((correctAttempts / totalAttempts) * 100).toFixed(1)
          : 0;

      return {
        id: q._id,
        questionText: q.questionText,
        totalAttempts,
        correctAttempts,
        accuracy: Number(accuracy),
      };
    });

    res.json({ data: questionStats });
  } catch (error) {
    console.error("Question stats error:", error);
    res.status(500).json({ message: "Failed to load question stats" });
  }
});


export default router;

