const express = require("express");
const router = express.Router();
const Question = require("../models/Questions");
const QuizAttempt = require("../models/QuizAttempt");
const { authenticateUser } = require("../middleware/authMiddleware");

// Route to get distinct topics from the Question collection
router.get('/distinct-topics', async (req, res) => {
    try {
        // Fetch distinct topics from the Question collection
        const topics = await Question.distinct('topic');
        res.status(200).json(topics); // Send the topics as a response
    } catch (error) {
        console.error("Error fetching topics:", error);
        res.status(500).json({ message: "Error fetching topics" });
    }
});


//  Fetch 10 Quiz Questions Based on Topic

router.get("/get-quiz", authenticateUser, async (req, res) => {
    try {
        const { topic } = req.query;
        if (!topic) {
            return res.status(400).json({ message: "Topic is required!" });
        }

        const questions = await Question.aggregate([
            { $match: { topic } },
            { $sample: { size: 10 } }
        ]);

        res.json(questions);
    } catch (error) {
        console.error("Error fetching quiz questions:", error);
        res.status(500).json({ message: "Server Error", error });
    }
});




router.post("/save-quiz", authenticateUser, async (req, res) => {
    try {
        const { userId, selectedOption, timeTaken, questions } = req.body;

        // Debug: Check the incoming request body
        console.log('Received request body:', req.body);

        if (!userId || !selectedOption || !questions || !timeTaken) {
            return res.status(400).json({ message: "Missing required fields!" });
        }
        // const formattedTime = `${Math.floor(timeTaken / 60)}m ${timeTaken % 60}s`;
        let score = 0;
        const formattedQuestions = questions.map(q => {
            const isCorrect = q.selectedAnswer?.trim().toLowerCase() === q.correctAnswer?.trim().toLowerCase();
            if (isCorrect) score++;

            return {
                questionId: q.questionId,
                questionText: q.questionText,
                options: q.options,
                correctAnswer: q.correctAnswer,
                explanation: q.explanation,
                selectedAnswer: q.selectedAnswer,
                isCorrect
            };
        });



        const quizAttempt = new QuizAttempt({
            userId,
            quizType: "topic",
            selectedOption,
            timeTaken,
            questions: formattedQuestions,
            score
        });

        await quizAttempt.save();

        res.status(201).json({
            message: "Quiz saved successfully!",
            score,
            timeTaken,
            quizAttempt
        });
    } catch (error) {
        console.error("Error saving quiz attempt:", error);
        res.status(500).json({ message: "Error saving quiz", error });
    }
});




// ========================
// 3. Get Quiz History for a User
// ========================
/**
 * @route   GET /api/quiz/user-quiz-progress/:userId
 * @desc    Get all quiz attempts of a user (latest first)
 */
// router.get("/user-quiz-progress/:userId", authenticateUser, async (req, res) => {
//     try {
//         const { userId } = req.params;
//         const attempts = await QuizAttempt.find({ userId })
//             .select("selectedOption score timeTaken createdAt")
//             .sort({ createdAt: -1 });

//         res.json(attempts);
//     } catch (error) {
//         console.error("Error fetching user quiz progress:", error);
//         res.status(500).json({ message: "Error fetching quiz progress", error });
//     }
// });

router.get("/user-quiz-progress/:userId", authenticateUser, async (req, res) => {
    try {
        const { userId } = req.params;

        const attempts = await QuizAttempt.find({ userId });

        const completedQuizzes = attempts.length;
        const totalQuestionsAttempted = attempts.reduce((sum, attempt) => sum + attempt.questions.length, 0);
        const totalScore = attempts.reduce((sum, attempt) => sum + attempt.score, 0);

        res.json({
            completedQuizzes,
            totalQuestionsAttempted,
            totalScore
        });
    } catch (error) {
        console.error("Error fetching user quiz progress:", error);
        res.status(500).json({ message: "Error fetching quiz progress", error });
    }
});

// GET all quiz attempts for a user
router.get("/user-attempts/:userId", authenticateUser, async (req, res) => {
    try {
        const { userId } = req.params;

        const attempts = await QuizAttempt.find({ userId }).sort({ createdAt: -1 });

        res.status(200).json({ attempts });
    } catch (error) {
        console.error("Error fetching user quiz attempts:", error);
        res.status(500).json({ message: "Error fetching quiz attempts", error });
    }
});




// ========================
// 4. Review Specific Quiz Attempt by ID
// ========================
/**
 * @route   GET /api/quiz/review-quiz/:attemptId
 * @desc    Get full quiz attempt with all questions, selected answers, explanations
 */
router.get("/review-quiz/:attemptId", authenticateUser, async (req, res) => {
    try {
        const { attemptId } = req.params;

        const attempt = await QuizAttempt.findById(attemptId);
        if (!attempt) {
            return res.status(404).json({ message: "Quiz attempt not found" });
        }

        res.json(attempt);
    } catch (error) {
        console.error("Error fetching quiz attempt:", error);
        res.status(500).json({ message: "Error fetching quiz attempt", error });
    }
});

module.exports = router;
