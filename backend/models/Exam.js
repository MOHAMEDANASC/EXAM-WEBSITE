import mongoose from "mongoose";

const examSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: "" },
  durationMinutes: { type: Number, default: 60 }, // duration in minutes
  questions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Question" }],
  createdBy: { type: String, default: "admin" }, // optional
}, { timestamps: true });

export default mongoose.model("Exam", examSchema);
