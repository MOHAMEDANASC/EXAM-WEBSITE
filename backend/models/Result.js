import mongoose from "mongoose";

const resultSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    correct: { type: Number, default: 0 },
    wrong: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
    score: { type: Number, default: 0 },
    totalMarks: { type: Number, default: 0 },

    // ✅ Add this section below 👇
    answers: [
      {
        questionId: { type: mongoose.Schema.Types.ObjectId, ref: "Question" },
        selectedOption: String, // student's chosen answer
        isCorrect: Boolean, // optional but useful
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Result", resultSchema);
