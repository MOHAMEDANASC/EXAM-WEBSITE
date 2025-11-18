import express from "express";
import {
  listExams,
  getExam,
  createExam,
  submitExam,
} from "../controllers/examController.js";
import Exam from "../models/Exam.js";

const router = express.Router();

// ==========================
// PUBLIC ROUTES
// ==========================

// Get ALL exams
router.get("/", listExams);

// ⭐ MUST BE BEFORE "/:id" ⭐
router.get("/default", async (req, res) => {
  try {
    const exam = await Exam.findOne().populate("questions");

    if (!exam) {
      return res.status(404).json({ message: "No exam found" });
    }

    res.json(exam);
  } catch (err) {
    console.error("DEFAULT EXAM ERROR:", err);
    res.status(500).json({ message: "Failed to load default exam" });
  }
});

// THIS MUST ALWAYS BE LAST
router.get("/:id", getExam);

// ==========================
// ADMIN
// ==========================
const checkAdmin = (req, res, next) => {
  const adminPassword = req.headers["adminpassword"];
  if (adminPassword !== "examadmin123") {
    return res.status(401).json({ message: "Unauthorized access" });
  }
  next();
};

router.post("/", checkAdmin, createExam);

// ==========================
// SUBMIT ROUTE
// ==========================
router.post("/:id/submit", submitExam);

export default router;
