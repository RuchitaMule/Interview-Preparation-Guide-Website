const express = require('express');
const router = express.Router();
const InterviewQuestion = require('../models/InterviewQuestion');
const MockInterviewAnswer = require('../models/MockInterviewAnswer');
const Progress = require('../models/Progress');
const { authenticateUser } = require('../middleware/authMiddleware');

// ==========================
// Utility: Score Calculation
// ==========================
const calculateAnswerScore = (userAnswer, keywords) => {
    if (!userAnswer || !keywords || keywords.length === 0) return 0;

    const lowerAnswer = userAnswer.toLowerCase();
    let score = 0;

    keywords.forEach(keyword => {
        const trimmedKeyword = keyword.trim().toLowerCase();
        if (trimmedKeyword && lowerAnswer.includes(trimmedKeyword)) {
            score++;
        }
    });

    return score;
};

// ==========================
// 🔹 Admin: Add Question
// ==========================
router.post('/add-question', async (req, res) => {
    try {
        const { questionText, type, topic, difficulty, expectedKeywords, idealAnswer } = req.body;
        const question = new InterviewQuestion({
            questionText,
            type,
            topic,
            difficulty,
            expectedKeywords,
            idealAnswer,
        });
        await question.save();
        res.status(201).json({ message: 'Question added successfully', question });
    } catch (error) {
        res.status(500).json({ message: 'Error adding question', error });
    }
});

// ==========================
// 🔹 User: Get Mock Questions
// ==========================
router.get('/mock-questions', authenticateUser, async (req, res) => {
    try {
        const techQuestions = await InterviewQuestion.aggregate([
            { $match: { type: 'Technical' } },
            { $sample: { size: 5 } },
        ]);

        const hrQuestions = await InterviewQuestion.aggregate([
            { $match: { type: 'HR' } },
            { $sample: { size: 5 } },
        ]);

        const combined = [...techQuestions, ...hrQuestions];
        res.status(200).json({ questions: combined });
    } catch (error) {
        console.error("Fetch Mock Questions Error:", error);
        res.status(500).json({ message: 'Server error while fetching questions' });
    }
});

// ==========================
// 🔹 User: Submit Interview
// ==========================
router.post('/submit', authenticateUser, async (req, res) => {
    try {

        const userId = req.user._id;
        const { answers } = req.body;

        if (!Array.isArray(answers) || answers.length === 0) {
            return res.status(400).json({ message: 'Answers must be a non-empty array.' });
        }

        let techTotal = 0;
        let hrTotal = 0;
        let techCount = 0;
        let hrCount = 0;
        const feedbackList = [];

        for (const ans of answers) {
            const question = await InterviewQuestion.findById(ans.questionId);
            if (!question) continue;

            const score = calculateAnswerScore(ans.userAnswer, question.expectedKeywords || []);
            const feedbackMsg = score === 0
                ? 'Try to include key points like: ' + (question.expectedKeywords?.join(', ') || 'N/A')
                : 'Good. You included some important concepts.';

            const newAnswer = new MockInterviewAnswer({
                userId,
                questionId: ans.questionId,
                userAnswer: ans.userAnswer,
                techScore: question.type === 'Technical' ? score : undefined,
                hrScore: question.type === 'HR' ? score : undefined,
                overallFeedback: feedbackMsg
            });

            await newAnswer.save();

            if (question.type === 'Technical') {
                techTotal += score;
                techCount++;
            } else if (question.type === 'HR') {
                hrTotal += score;
                hrCount++;
            }

            feedbackList.push({
                question: question.questionText,
                userAnswer: ans.userAnswer,
                score,
                type: question.type,
                feedback: feedbackMsg
            });
        }

        const techScore = techCount ? (techTotal / techCount) : 0;
        const hrScore = hrCount ? (hrTotal / hrCount) : 0;

        const overallFeedback = `Technical: ${techScore}/5, HR: ${hrScore}/5. Keep practicing for clearer and more complete answers.`;

        // Update progress
        const progress = await Progress.findOne({ userId });

        if (progress) {
            const currentFeedback = {
                date: new Date(),
                techScore,
                hrScore,
                overallFeedback
            };

            progress.mockInterview.totalInterviews += 1;
            progress.mockInterview.lastInterviewDate = new Date();

            const currentAvg = progress.mockInterview.averageScore || 0;
            const newAvg = ((currentAvg * (progress.mockInterview.totalInterviews - 1)) + ((techScore + hrScore) / 2)) / progress.mockInterview.totalInterviews;

            progress.mockInterview.averageScore = newAvg;
            progress.mockInterview.feedbackSummary.push(currentFeedback);

            await progress.save();
        }

        res.status(200).json({
            message: 'Mock interview submitted and scored successfully.',
            techScore,
            hrScore,
            overallFeedback,
            detailedFeedback: feedbackList
        });

    } catch (error) {
        console.error('Submission error:', error);
        res.status(500).json({ message: 'Server error during submission.' });
    }
});

//GET /api/progress/mock-interview
router.get('/progress', authenticateUser, async (req, res) => {
    try {
        const userId = req.user._id;

        const progress = await Progress.findOne({ userId });

        if (!progress || !progress.mockInterview) {
            return res.status(404).json({ message: 'No interview progress found.' });
        }

        const {
            totalInterviews,
            lastInterviewDate,
            averageScore,
            feedbackSummary
        } = progress.mockInterview;

        res.status(200).json({
            totalInterviews,
            lastInterviewDate,
            averageScore,
            feedbackSummary
        });

    } catch (error) {
        console.error('Error fetching mock interview progress:', error);
        res.status(500).json({ message: 'Server error while fetching progress.' });
    }
});

// //HR Speech based
// router.get("/hr", async (req, res) => {
//     try {
//         const hrQuestions = await InterviewQuestion.find({ type: "HR" });
//         res.json(hrQuestions);
//     } catch (error) {
//         console.error("Error fetching HR questions:", error);
//         res.status(500).json({ message: "Failed to fetch HR questions." });
//     }
// });

// HR Speech-Based Interview Questions (with auth)
router.get("/hr", authenticateUser, async (req, res) => {
    try {
        const hrQuestions = await InterviewQuestion.aggregate([
            { $match: { type: "HR" } },
            { $sample: { size: 5 } } // returns 5 random HR questions
        ]);

        res.status(200).json({ questions: hrQuestions });
    } catch (error) {
        console.error("Error fetching HR questions:", error);
        res.status(500).json({ message: "Failed to fetch HR questions." });
    }
});
module.exports = router;