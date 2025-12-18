// routes/progressRoutes.js
const express = require('express');
const router = express.Router();
const Progress = require('../models/Progress');
// const QuizAttempt = require("../models/QuizAttempts");

// Update Aptitude Progress (Easy/Medium/Hard Questions)
router.put('/aptitude/:userId', async (req, res) => {
    const { difficulty } = req.body; // Get difficulty from request body (easy, medium, hard)
    const { userId } = req.params; // Get userId from params

    try {
        const progress = await Progress.findOne({ userId });
        if (!progress) {
            return res.status(404).json({ message: 'Progress not found' });
        }

        // Increment the respective difficulty count
        if (difficulty === 'easy') {
            progress.aptitudeQuestionsEasy += 1;
        } else if (difficulty === 'medium') {
            progress.aptitudeQuestionsMedium += 1;
        } else if (difficulty === 'hard') {
            progress.aptitudeQuestionsHard += 1;
        }

        await progress.save();
        res.status(200).json({ message: 'Aptitude progress updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error updating progress' });
    }
});
module.exports = router;
