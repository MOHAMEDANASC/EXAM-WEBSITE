import mongoose from "mongoose";
import dotenv from "dotenv";
import Question from "./models/Question.js";


dotenv.config();

const questions = [
  {
    questionText: "What is 2 + 2?",
    options: ["1", "2", "3", "4"],
    correctAnswer: "4",
  },
  // ... add all 60 questions here
];

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    await Question.deleteMany({});
    await Question.insertMany(questions);
    console.log("✅ Questions inserted");
    process.exit();
  })
  .catch(err => console.error(err));
