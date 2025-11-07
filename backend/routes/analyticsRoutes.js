import express from "express";
import Result from "../models/Result.js";
import Question from "../models/Question.js";

const router = express.Router();

router.get("/question-performance", async (req, res) => {
  try {
    const { adminPassword } = req.headers;
    if (adminPassword !== "examadmin123") {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const results = await Result.find().populate("answers.questionId");
    const stats = {};

    // Loop through all student answers
    results.forEach(result => {
      result.answers.forEach(ans => {
        const qid = ans.questionId._id.toString();
        if (!stats[qid]) {
          stats[qid] = {
            questionText: ans.questionId.questionText,
            totalAttempts: 0,
            correctAttempts: 0,
          };
        }
        stats[qid].totalAttempts++;
        if (ans.isCorrect) stats[qid].correctAttempts++;
      });
    });

    // Convert to array
    const performance = Object.entries(stats).map(([id, q]) => ({
      id,
      questionText: q.questionText,
      totalAttempts: q.totalAttempts,
      correctAttempts: q.correctAttempts,
      accuracy:
        q.totalAttempts > 0
          ? ((q.correctAttempts / q.totalAttempts) * 100).toFixed(1)
          : "0",
    }));

    res.json(performance);
  } catch (error) {
    console.error("Error generating question analytics:", error);
    res.status(500).json({ message: "Failed to fetch analytics" });
  }
});

export default router;
