// models/MockInterviewAnswer.js

const mongoose = require('mongoose');

const MockInterviewAnswerSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true
  },
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'InterviewQuestion', // Reference to the InterviewQuestion model
    required: true
  },
  userAnswer: {
    type: String,
    required: true
  },
  techScore: {
    type: Number,
    default: 0
  },
  hrScore: {
    type: Number,
    default: 0
  },
  overallFeedback: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('MockInterviewAnswer', MockInterviewAnswerSchema);
