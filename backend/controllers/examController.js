import Question from "../models/questionText.js";
import Result from "../models/Result.js";
import User from "../models/User.js";

// ------------- GET ALL QUESTIONS -------------
export const getQuestions = async (req, res) => {
  try {
    const questions = await Question.find().select("-correctAnswer"); // hide answers
    res.json(questions);
  } catch (error) {
    console.error("Fetch questions error:", error);
    res.status(500).json({ message: "Failed to load questions" });
  }
};

// ------------- SUBMIT ANSWERS -------------
export const submitExam = async (req, res) => {
  try {
    const { phone, answers } = req.body; // answers = [{questionId, selectedAnswer}]
    const user = await User.findOne({ phone, verified: true });
    if (!user) return res.status(400).json({ message: "User not verified" });

    const questions = await Question.find();
    let score = 0;
    const resultAnswers = [];

    answers.forEach(ans => {
      const q = questions.find(q => q._id.toString() === ans.questionId);
      if (q) {
        const isCorrect = q.correctAnswer === ans.selectedAnswer;
        if (isCorrect) score++;
        resultAnswers.push({
          questionId: q._id,
          selectedAnswer: ans.selectedAnswer,
          isCorrect,
        });
      }
    });

    const result = new Result({
      userId: user._id,
      score,
      total: questions.length,
      answers: resultAnswers,
    });
    await result.save();

    res.json({
      message: "Exam submitted successfully",
      score,
      total: questions.length,
    });
  } catch (error) {
    console.error("Submit exam error:", error);
    res.status(500).json({ message: "Exam submission failed" });
  }
};
