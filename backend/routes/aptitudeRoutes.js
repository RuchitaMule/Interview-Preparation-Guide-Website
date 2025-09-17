require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const JWT = require('jsonwebtoken');
const User = require('../models/User');
const Roadmap = require('../models/Questions');
const { authenticateUser } = require('../middleware/authMiddleware');
const Progress = require('../models/Progress');

// @route   PATCH /api/aptitude/attempt
// @desc    Update aptitude progress after question attempt
// @access  Private

router.patch('/attempt', authenticateUser, async (req, res) => {
  try {
    const { difficulty } = req.body;

    if (!difficulty || !['easy', 'medium', 'hard'].includes(difficulty)) {
      return res.status(400).json({ message: 'Invalid or missing difficulty level' });
    }

    // Initialize increment object
    const updateFields = {
      aptitudeQuestionsPracticed: 1,
    };

    // Add dynamic field based on difficulty
    if (difficulty === 'easy') updateFields.aptitudeQuestionsEasy = 1;
    else if (difficulty === 'medium') updateFields.aptitudeQuestionsMedium = 1;
    else if (difficulty === 'hard') updateFields.aptitudeQuestionsHard = 1;

    const updatedProgress = await Progress.findOneAndUpdate(
      { userId: req.user.id },
      { $inc: updateFields },
      { upsert: true, new: true }
    );

    res.status(200).json({
      message: 'Progress updated successfully',
      updatedProgress
    });

  } catch (error) {
    console.error('Error updating aptitude progress:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});


// Fetch only aptitude progress for a specific user
router.get('/aptitude-progress', authenticateUser, async (req, res) => {
  try {
    const progress = await Progress.findOne({ userId: req.user.id });

    if (!progress) {
      return res.status(404).json({ message: 'Aptitude progress not found' });
    }

    // Returning only the aptitude related progress
    const aptitudeProgress = {
      aptitudeQuestionsPracticed: progress.aptitudeQuestionsPracticed,
      aptitudeQuestionsEasy: progress.aptitudeQuestionsEasy,
      aptitudeQuestionsMedium: progress.aptitudeQuestionsMedium,
      aptitudeQuestionsHard: progress.aptitudeQuestionsHard,
    };

    res.json(aptitudeProgress);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});






//  Route to fetch aptitude questions by difficulty
const Question = require('../models/Questions'); // Make sure path is correct

router.get('/questions/:difficulty', async (req, res) => {
  const difficulty = req.params.difficulty;

  // Check if difficulty is valid
  if (!["easy", "medium", "hard"].includes(difficulty)) {
    return res.status(400).json({ message: "Invalid difficulty. Use easy, medium, or hard." });
  }

  try {
    const questions = await Question.find({ difficulty: difficulty });

    if (!questions || questions.length === 0) {
      return res.status(404).json({ message: `No ${difficulty} questions found.` });
    }

    return res.status(200).json(questions);
  } catch (error) {
    return res.status(500).json({ message: `Error fetching questions: ${error.message}` });
  }
});

module.exports = router;