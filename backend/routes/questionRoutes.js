import express from "express";
import Question from "../models/questionText.js";

const router = express.Router();

// ✅ Admin check middleware
const checkAdmin = (req, res, next) => {
  const adminPassword = req.headers["adminpassword"];
  if (adminPassword !== "examadmin123") {
    return res.status(401).json({ message: "Unauthorized access" });
  }
  next();
};

// ✅ Get all questions (public – for students)
router.get("/", async (req, res) => {
  try {
    const questions = await Question.find();
    res.json(questions);
  } catch (error) {
    console.error("Error fetching questions:", error);
    res.status(500).json({ message: "Failed to fetch questions" });
  }
});

// ✅ Get all questions (admin – includes answers)
router.get("/admin/all", checkAdmin, async (req, res) => {
  try {
    const questions = await Question.find();
    res.json(questions);
  } catch (error) {
    console.error("Error fetching admin questions:", error);
    res.status(500).json({ message: "Failed to fetch admin questions" });
  }
});

// ✅ Add new question (Admin only)
router.post("/admin/questions", checkAdmin, async (req, res) => {
  try {
    const { questionText, options, correctAnswer } = req.body;
    if (!questionText || !options || !correctAnswer) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const newQuestion = new Question({ questionText, options, correctAnswer });
    await newQuestion.save();
    res.status(201).json({ newQuestion });
  } catch (error) {
    console.error("Error adding question:", error);
    res.status(500).json({ message: "Error adding question" });
  }
});

// ✅ Edit question (Admin only)
router.put("/admin/questions/:id", checkAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { questionText, options, correctAnswer } = req.body;

    const updated = await Question.findByIdAndUpdate(
      id,
      { questionText, options, correctAnswer },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Question not found" });
    }

    res.json({ updated });
  } catch (error) {
    console.error("Error updating question:", error);
    res.status(500).json({ message: "Error updating question" });
  }
});

// ✅ Delete question (Admin only)
router.delete("/admin/questions/:id", checkAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Question.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Question not found" });
    }

    res.json({ message: "Question deleted successfully" });
  } catch (error) {
    console.error("Error deleting question:", error);
    res.status(500).json({ message: "Error deleting question" });
  }
});

export default router;
