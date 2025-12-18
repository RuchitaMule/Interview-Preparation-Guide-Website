const express = require('express');
const router = express.Router();
const Question = require('../models/Questions');
const { authenticateAdmin } = require('../middleware/adminMiddleware');

// ✅ GET all questions
router.get('/questions', authenticateAdmin, async (req, res) => {
    const questions = await Question.find();
    res.json(questions);
});

// ✅ DELETE a question
router.delete('/question/:id', authenticateAdmin, async (req, res) => {
    const deletedQuestion = await Question.findByIdAndDelete(req.params.id);
    if (!deletedQuestion) return res.status(404).json({ message: "Question not found" });
    res.json({ message: "Question deleted successfully." });
});

router.post('/questions', authenticateAdmin, async (req, res) => {
    try {
        const newQuestion = new Question(req.body);
        await newQuestion.save();
        res.status(201).json({ message: "Question added successfully", question: newQuestion });
    } catch (error) {
        res.status(500).json({ message: "Failed to add question", error });
    }
});


// ✅ UPDATE a question
router.put('/question/:id', authenticateAdmin, async (req, res) => {
    const updatedQuestion = await Question.findByIdAndUpdate(
        req.params.id,
        {
            questionText: req.body.questionText,
            options: req.body.options,
            correctAnswer: req.body.correctAnswer,
            topic: req.body.topic,
            difficulty: req.body.difficulty,
            explanation: req.body.explanation
        },
        { new: true }
    );
    if (!updatedQuestion) return res.status(404).json({ message: "Question not found" });
    res.json(updatedQuestion);
});

module.exports = router;
