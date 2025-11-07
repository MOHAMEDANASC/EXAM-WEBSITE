import express from "express";
import { getQuestions, submitExam } from "../controllers/examController.js";

const router = express.Router();

router.get("/questions", getQuestions); // → /api/exam/questions
router.post("/submit", submitExam);     // → /api/exam/submit

export default router;

