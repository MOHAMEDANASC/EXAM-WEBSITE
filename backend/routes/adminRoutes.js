import express from "express";
import Question from "../models/Question.js";

const router = express.Router();

// Simple admin password (you can later replace with JWT auth)
const ADMIN_PASSWORD = "examadmin123";

// Middleware for basic admin protection
const verifyAdmin = (req, res, next) => {
  const { adminPassword } = req.headers;
  if (adminPassword !== ADMIN_PASSWORD) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
};

// Get all questions
router.get("/questions", verifyAdmin, async (req, res) => {
  const questions = await Question.find();
  res.json(questions);
});

// Add new question
router.post("/questions", verifyAdmin, async (req, res) => {
  const { questionText, options, correctAnswer } = req.body;
  if (!questionText || options.length !== 4 || !correctAnswer)
    return res.status(400).json({ message: "Invalid question data" });

  const newQuestion = new Question({ questionText, options, correctAnswer });
  await newQuestion.save();
  res.json({ message: "Question added successfully", newQuestion });
});

// Edit question
router.put("/questions/:id", verifyAdmin, async (req, res) => {
  const { id } = req.params;
  const { questionText, options, correctAnswer } = req.body;

  const updated = await Question.findByIdAndUpdate(
    id,
    { questionText, options, correctAnswer },
    { new: true }
  );
  res.json({ message: "Question updated", updated });
});

// Delete question
router.delete("/questions/:id", verifyAdmin, async (req, res) => {
  await Question.findByIdAndDelete(req.params.id);
  res.json({ message: "Question deleted" });
});

export default router;
