

const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  roadmapId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Roadmap',
    required: false,
  },
  completedSteps: [{ type: String }],
  quizScores: [
    {
      topic: { type: String },
      score: { type: Number },
      timeTaken: { type: String },
    }
  ],

  aptitudeQuestionsPracticed: { type: Number, default: 0 },
  aptitudeQuestionsEasy: { type: Number, default: 0 },       // Easy questions
  aptitudeQuestionsMedium: { type: Number, default: 0 },     // Medium questions
  aptitudeQuestionsHard: { type: Number, default: 0 },       //Hard questions

  //Mock Interview progress
  mockInterview: {
    totalInterviews: { type: Number, default: 0 },
    lastInterviewDate: { type: Date, default: null },
    averageScore: { type: Number, default: 0 },
    feedbackSummary: [
      {
        date: { type: Date, default: Date.now },
        techScore: { type: Number, default: 0 },
        hrScore: { type: Number, default: 0 },
        overallFeedback: { type: String, default: '' }
      }
    ]
  }
});

module.exports = mongoose.model('Progress', progressSchema);
