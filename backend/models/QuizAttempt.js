const mongoose = require("mongoose");

const QuizAttemptSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    quizType: {
        type: String,
        enum: ["topic"],  // Only topic-based quizzes now
        default: "topic"
    },
    selectedOption: {
        type: String,
        required: true  // e.g., "Data Structures"
    },
    timeTaken: {
        type: String,
        required: true  // e.g., "8m 20s"
    },
    questions: [
        {
            questionId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Question"
            },
            questionText: String,
            options: [String],
            correctAnswer: String,
            explanation: String,
            selectedAnswer: String,
            isCorrect: Boolean
        }
    ],
    score: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("QuizAttempt", QuizAttemptSchema);
