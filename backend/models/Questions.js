const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
    questionText: { type: String, required: true }, // The actual question
    options: [{ type: String, required: true }], // Multiple choices
    correctAnswer: { type: String, required: true }, // Correct answer
    topic: { type: String, required: true }, // Category (e.g., Data Structures, Algorithms)
    difficulty: { type: String, enum: ["easy", "medium", "hard"], required: true }, // Difficulty level
    explanation: { type: String }, // Explanation for correct answer (optional)
    createdAt: { type: Date, default: Date.now }
});

const Question = mongoose.model("Question", questionSchema);
module.exports = Question;
