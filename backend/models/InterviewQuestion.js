// models/InterviewQuestion.js

const mongoose = require('mongoose');

const InterviewQuestionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['Technical', 'HR'],
    required: true,
  },
  topic: {
    type: String, // e.g., JavaScript, OOP, Communication
    required: true,
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Medium',
  },
  expectedKeywords: [
    {
      type: String, // used for evaluating answers
    }
  ],
  idealAnswer: {
    type: String, // (optional) can be shown after submission
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('InterviewQuestion', InterviewQuestionSchema);
