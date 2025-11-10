import mongoose from "mongoose";
import dotenv from "dotenv";
import Question from "./models/questionText.js";

dotenv.config();

const questions = [
  // SCIENCE (1–23)
  {
    questionText: "Which of the following is not a state of matter?",
    options: ["Solid", "Liquid", "Gas", "Energy"],
    correctAnswer: "Energy",
  },
  {
    questionText: "Water changes into vapor on:",
    options: ["Melting", "Freezing", "Boiling", "Condensing"],
    correctAnswer: "Boiling",
  },
  {
    questionText: "In a food chain, which one is always at the first level?",
    options: ["Herbivore", "Producer", "Carnivore", "Decomposer"],
    correctAnswer: "Producer",
  },
  {
    questionText: "Which process helps green plants to make food?",
    options: ["Germination", "Pollination", "Photosynthesis", "Fertilization"],
    correctAnswer: "Photosynthesis",
  },
  {
    questionText: "Which part of the plant absorbs water and minerals from the soil?",
    options: ["Leaf", "Stem", "Root", "Flower"],
    correctAnswer: "Root",
  },
  {
    questionText: "Seeds need which of the following to germinate?",
    options: [
      "Air, water, and sunlight",
      "Air, water, and warmth",
      "Water, sunlight, and food",
      "Air, warmth, and soil",
    ],
    correctAnswer: "Air, water, and warmth",
  },
  {
    questionText: "What is the main function of leaves in a plant?",
    options: ["To absorb minerals", "To prepare food", "To store water", "To protect fruits"],
    correctAnswer: "To prepare food",
  },
  {
    questionText: "Pollination is the transfer of pollen from:",
    options: ["Anther to stigma", "Stigma to anther", "Ovary to seed", "Seed to leaf"],
    correctAnswer: "Anther to stigma",
  },
  {
    questionText: "Which one of the following is an example of a communicable disease?",
    options: ["Cancer", "Diabetes", "Malaria", "Asthma"],
    correctAnswer: "Malaria",
  },
  {
    questionText: "Which of the following gives us immunity against diseases?",
    options: ["Antibodies", "Antibiotics", "Vitamins", "Hormones"],
    correctAnswer: "Antibodies",
  },
  {
    questionText: "Which sense do bats use to move in the dark?",
    options: ["Smell", "Touch", "Echolocation (sound)", "Sight"],
    correctAnswer: "Echolocation (sound)",
  },
  {
    questionText: "Which of these animals lives both in water and on land?",
    options: ["Fish", "Crocodile", "Frog", "Whale"],
    correctAnswer: "Frog",
  },
  {
    questionText: "The color diversity in flowers mainly helps in:",
    options: ["Growth", "Pollination", "Water absorption", "Photosynthesis"],
    correctAnswer: "Pollination",
  },
  {
    questionText: "Which of these shows correct order in a food chain?",
    options: [
      "Grass → Rabbit → Fox",
      "Fox → Rabbit → Grass",
      "Rabbit → Grass → Fox",
      "Grass → Fox → Rabbit",
    ],
    correctAnswer: "Grass → Rabbit → Fox",
  },
  {
    questionText: "Water is essential for plants because:",
    options: [
      "It helps seeds to break their coat",
      "It provides energy",
      "It helps in pollination",
      "It helps in fruit ripening",
    ],
    correctAnswer: "It helps seeds to break their coat",
  },
  {
    questionText: "Vaccination helps in:",
    options: ["Curing disease", "Preventing disease", "Spreading disease", "Stopping growth"],
    correctAnswer: "Preventing disease",
  },
  {
    questionText: "The three forms of water are:",
    options: ["Ice, Steam, Snow", "Ice, Water, Steam", "Rain, Snow, Cloud", "Water, Cloud, Rain"],
    correctAnswer: "Ice, Water, Steam",
  },
  {
    questionText: "Which part of the plant grows underground?",
    options: ["Stem", "Leaf", "Root", "Flower"],
    correctAnswer: "Root",
  },
  {
    questionText: "Which gas do plants release during photosynthesis?",
    options: ["Carbon dioxide", "Nitrogen", "Oxygen", "Hydrogen"],
    correctAnswer: "Oxygen",
  },
  {
    questionText: "Which of these animals has a very sharp sense of smell?",
    options: ["Dog", "Cow", "Cat", "Rabbit"],
    correctAnswer: "Dog",
  },
  {
    questionText: "What do vaccines contain?",
    options: ["Antibiotics", "Weak or dead germs", "Vitamins", "Antibodies"],
    correctAnswer: "Weak or dead germs",
  },
  {
    questionText: "Which of the following diseases spreads through mosquito bites?",
    options: ["Tuberculosis", "Malaria", "Cholera", "Typhoid"],
    correctAnswer: "Malaria",
  },
  {
    questionText: "What helps in the movement of water in plants from roots to leaves?",
    options: ["Xylem", "Phloem", "Chlorophyll", "Stomata"],
    correctAnswer: "Xylem",
  },

  // MATHEMATICS (24–46)
  {
    questionText: "The successor of 4999 is:",
    options: ["4998", "5000", "5099", "5999"],
    correctAnswer: "5000",
  },
  {
    questionText: "2658 + 1432 = ?",
    options: ["4080", "3890", "4000", "4100"],
    correctAnswer: "4090",
  },
  {
    questionText: "72 ÷ 9 = ?",
    options: ["6", "7", "8", "9"],
    correctAnswer: "8",
  },
  {
    questionText: "6 × 8 – 4 = ?",
    options: ["44", "42", "48", "40"],
    correctAnswer: "44",
  },
  {
    questionText: "What is the smallest 4-digit number?",
    options: ["100", "999", "1000", "9999"],
    correctAnswer: "1000",
  },
  {
    questionText: "How many minutes are there in 3 hours?",
    options: ["60", "90", "120", "180"],
    correctAnswer: "180",
  },
  {
    questionText: "The perimeter of a square with side 5 cm is:",
    options: ["20 cm", "10 cm", "25 cm", "15 cm"],
    correctAnswer: "20 cm",
  },
  {
    questionText: "A circle has how many lines of symmetry?",
    options: ["2", "4", "Infinite", "1"],
    correctAnswer: "Infinite",
  },
  {
    questionText: "½ of 24 = ?",
    options: ["10", "12", "14", "16"],
    correctAnswer: "12",
  },
  {
    questionText: "1 litre = ? millilitres",
    options: ["10", "100", "1000", "10000"],
    correctAnswer: "1000",
  },
  {
    questionText: "A bottle can hold 500 ml of water. How many such bottles will fill 2 litres?",
    options: ["2", "3", "4", "5"],
    correctAnswer: "4",
  },
  {
    questionText: "Which of the following represents a right angle?",
    options: ["30°", "45°", "60°", "90°"],
    correctAnswer: "90°",
  },
  {
    questionText: "Which number is greater?",
    options: ["3456", "3546", "3564", "3465"],
    correctAnswer: "3564",
  },
  {
    questionText: "9000 – 7899 = ?",
    options: ["1001", "1101", "1201", "1000"],
    correctAnswer: "1101",
  },
  {
    questionText: "A rectangle has length 8 cm and breadth 4 cm. Its perimeter is:",
    options: ["12 cm", "24 cm", "16 cm", "20 cm"],
    correctAnswer: "24 cm",
  },
  {
    questionText: "The pattern: 2, 4, 8, 16, 32, ___",
    options: ["48", "50", "64", "40"],
    correctAnswer: "64",
  },
  {
    questionText: "The difference between the greatest and smallest 4-digit numbers is:",
    options: ["8999", "9000", "9999", "8990"],
    correctAnswer: "8999",
  },
  {
    questionText: "25 × 12 = ?",
    options: ["250", "300", "350", "400"],
    correctAnswer: "300",
  },
  {
    questionText: "The time between 2:15 p.m. and 3:00 p.m. is:",
    options: ["30 minutes", "45 minutes", "50 minutes", "1 hour"],
    correctAnswer: "45 minutes",
  },
  {
    questionText: "A pencil is 12 cm long. Its half length is:",
    options: ["5 cm", "6 cm", "10 cm", "8 cm"],
    correctAnswer: "6 cm",
  },
  {
    questionText: "If length = 6 cm and breadth = 3 cm, what is the perimeter of the rectangle?",
    options: ["9 cm", "18 cm", "12 cm", "15 cm"],
    correctAnswer: "18 cm",
  },
  {
    questionText: "Convert 3 metres into centimetres.",
    options: ["30 cm", "300 cm", "3000 cm", "3 cm"],
    correctAnswer: "300 cm",
  },
  {
    questionText: "If ⅓ of a number is 15, the number is:",
    options: ["30", "45", "50", "60"],
    correctAnswer: "45",
  },

  // MENTAL ABILITY (47–60)
  {
    questionText: "Find the odd one out:",
    options: ["Cat", "Dog", "Cow", "Crow"],
    correctAnswer: "Crow",
  },
  {
    questionText: "If CAT = 3120, then BAT = ?",
    options: ["2120", "2130", "3110", "1120"],
    correctAnswer: "2120",
  },
  {
    questionText: "A is the father of B. B is the sister of C. How is C related to A?",
    options: ["Father", "Daughter or Son", "Mother", "Cousin"],
    correctAnswer: "Daughter or Son",
  },
  {
    questionText: "Which direction is opposite of South-East?",
    options: ["North-East", "North-West", "South-West", "East"],
    correctAnswer: "North-West",
  },
  {
    questionText: "Choose the correct Venn Diagram for: Boys, Students, Teachers.",
    options: [
      "Three separate circles",
      "Students circle containing Boys and Teachers",
      "Boys and Teachers inside Students",
      "Boys overlapping Teachers",
    ],
    correctAnswer: "Boys and Teachers inside Students",
  },
  {
    questionText: "Water image of “b” looks like:",
    options: ["p", "q", "d", "b"],
    correctAnswer: "q",
  },
  {
    questionText: "Which figure completes the series: ⬜️ ⬛️ ⬜️ ⬛️ ?",
    options: ["⬜️", "⬛️", "⬜️⬛️", "None"],
    correctAnswer: "⬜️",
  },
  {
    questionText: "A cube has 6 faces. How many edges does it have?",
    options: ["8", "10", "12", "6"],
    correctAnswer: "12",
  },
  {
    questionText: "Find the odd one out:",
    options: ["Apple", "Mango", "Banana", "Potato"],
    correctAnswer: "Potato",
  },
  {
    questionText: "If A = 1, B = 2, C = 3, then SUM = ?",
    options: ["54", "57", "56", "58"],
    correctAnswer: "57",
  },
  {
    questionText: "In a certain code, DOG = 4157, then CAT = ?",
    options: ["3120", "3121", "3122", "4120"],
    correctAnswer: "3120",
  },
  {
    questionText: "A man facing north turns right, then again right, then left. Which direction is he facing?",
    options: ["East", "South", "West", "North"],
    correctAnswer: "West",
  },
  {
    questionText: "Choose the correct mirror image of the number “276”:",
    options: ["276", "672", "678", "679"],
    correctAnswer: "672",
  },
  {
    questionText: "If two dice are thrown together, what is the maximum total we can get?",
    options: ["10", "11", "12", "13"],
    correctAnswer: "12",
  },
];


mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("✅ Connected to MongoDB for seeding");

    const existing = await Question.countDocuments();
    console.log("Old question count:", existing);

    await Question.deleteMany();
    console.log("🗑️ Old questions deleted");

    await Question.insertMany(questions);
    console.log("✅ Inserted new questions:", questions.length);

    const newCount = await Question.countDocuments();
    console.log("📊 Total questions in DB now:", newCount);

    mongoose.connection.close();
  })
  .catch((err) => console.error("❌ Error:", err));
