import Question from "../models/questionText.js";
import Result from "../models/Result.js";
import User from "../models/User.js";
import Exam from "../models/Exam.js";

// ---------- PUBLIC: list all exams ----------
export const listExams = async (req, res) => {
  try {
    const exams = await Exam.find().populate("questions", "questionText");
    res.json(exams);
  } catch (error) {
    console.error("List exams error:", error);
    res.status(500).json({ message: "Failed to list exams" });
  }
};

// ---------- PUBLIC: get single exam (with questions) ----------
export const getExam = async (req, res) => {
  try {
    const { id } = req.params;
    const exam = await Exam.findById(id).populate("questions", "-correctAnswer"); // hide correct answer
    if (!exam) return res.status(404).json({ message: "Exam not found" });
    res.json(exam);
  } catch (error) {
    console.error("Get exam error:", error);
    res.status(500).json({ message: "Failed to load exam" });
  }
};

// ---------- ADMIN: create exam ----------
export const createExam = async (req, res) => {
  try {
    // admin guard handled by route
    const { title, description, durationMinutes, questions } = req.body;
    if (!title) return res.status(400).json({ message: "Title required" });
    // validate question IDs (optional)
    const exam = new Exam({
      title,
      description,
      durationMinutes: Number(durationMinutes) || 60,
      questions: Array.isArray(questions) ? questions : [],
      createdBy: "admin",
    });
    await exam.save();
    res.status(201).json({ message: "Exam created", exam });
  } catch (error) {
    console.error("Create exam error:", error);
    res.status(500).json({ message: "Failed to create exam" });
  }
};

// ---------- SUBMIT exam (student) ----------
export const submitExam = async (req, res) => {
  try {
    const { userId, examId, answers } = req.body;
    if (!userId || !examId) return res.status(400).json({ message: "Missing userId or examId" });

    const user = await User.findById(userId);
    if (!user || !user.verified) return res.status(400).json({ message: "User not verified or not found" });

    const exam = await Exam.findById(examId).populate("questions");
    if (!exam) return res.status(404).json({ message: "Exam not found" });

    // Build question map
    const qMap = {};
    exam.questions.forEach(q => { qMap[q._id.toString()] = q; });

    let correct = 0;
    let wrong = 0;
    const resultAnswers = [];

    (answers || []).forEach(ans => {
      const q = qMap[ans.questionId];
      if (q) {
        const isCorrect = q.correctAnswer === ans.selectedOption || q.correctAnswer === ans.selectedAnswer || q.correctAnswer === ans.selectedAnswer;
        if (isCorrect) correct++;
        else wrong++;
        resultAnswers.push({
          questionId: q._id,
          selectedOption: ans.selectedAnswer || ans.selectedOption,
          isCorrect,
        });
      }
    });

    const total = exam.questions.length;
    const score = correct; // keep same metric as before
    const totalMarks = correct * 4;

    const newResult = new Result({
      userId,
      examId,
      correct,
      wrong,
      total,
      score,
      totalMarks,
      answers: resultAnswers,
    });

    await newResult.save();

    res.json({
      message: "Exam submitted successfully",
      resultId: newResult._id,
      score,
      total,
      totalMarks,
    });
  } catch (error) {
    console.error("Submit exam error:", error);
    res.status(500).json({ message: "Exam submission failed", error: error.message });
  }
};
