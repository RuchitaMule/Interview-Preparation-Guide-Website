import React, { useState, useEffect } from "react";
import "../styles/MockInterviews.css";

const mockQuestions = [
    {
        question: "Explain quicksort and its time complexity.",
        category: "DSA",
        keywords: ["quicksort", "pivot", "partition", "O(n log n)", "worst case"],
    },
    {
        question: "What are the four pillars of OOP?",
        category: "DSA",
        keywords: ["abstraction", "encapsulation", "inheritance", "polymorphism"],
    },
    {
        question: "Explain REST API and its benefits.",
        category: "Web Dev",
        keywords: ["REST", "stateless", "HTTP", "JSON", "scalable"],
    },
];

const TechnicalInterview = () => {
    const [selectedCategory, setSelectedCategory] = useState("DSA");
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [timeLeft, setTimeLeft] = useState(30);
    const [answer, setAnswer] = useState("");
    const [answers, setAnswers] = useState([]);
    const [score, setScore] = useState(0);
    const [feedback, setFeedback] = useState("");

    useEffect(() => {
        if (timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [timeLeft]);

    const evaluateAnswer = (userAnswer, keywords) => {
        let matched = 0;
        keywords.forEach((keyword) => {
            if (userAnswer.toLowerCase().includes(keyword)) matched++;
        });
        const score = Math.round((matched / keywords.length) * 10);
        return score;
    };

    const handleNextQuestion = () => {
        const currentQ = mockQuestions[currentQuestionIndex];
        const userScore = evaluateAnswer(answer, currentQ.keywords);
        const newAnswer = {
            question: currentQ.question,
            answer,
            score: userScore,
        };

        setAnswers([...answers, newAnswer]);
        setScore(score + userScore);

        if (currentQuestionIndex < mockQuestions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setTimeLeft(30);
            setAnswer("");
        } else {
            generateAI_Feedback([...answers, newAnswer]);
        }
    };

    const generateAI_Feedback = (allAnswers) => {
        let total = 0;
        let msg = "🧠 Feedback Summary:\n";
        allAnswers.forEach((a, i) => {
            total += a.score;
            msg += `\nQ${i + 1}: "${a.question}"\nScore: ${a.score}/10\n`;
        });
        msg += `\n✅ Final Score: ${total}/${mockQuestions.length * 10}`;
        msg += `\n\n✨ Tip: Focus on using technical keywords, examples, and concise structure.`;
        setFeedback(msg);
    };

    return (
        <div className="mock-interview-container">
            <div className="left-sidebar">
                <h3>🚀 Quick Tips</h3>
                <ul>
                    <li>Stay confident 💪</li>
                    <li>Structure your answers 🏗️</li>
                    <li>Think aloud 🤔</li>
                    <li>Use examples 📖</li>
                    <li>Manage time efficiently ⏳</li>
                </ul>
                <div className="progress">
                    <p>Progress: {currentQuestionIndex + 1} / {mockQuestions.length}</p>
                    <progress value={currentQuestionIndex + 1} max={mockQuestions.length}></progress>
                </div>
            </div>

            <div className="interview-box">
                <h2>Technical Interview</h2>
                <label>Select Category: </label>
                <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                    <option value="DSA">DSA</option>
                    <option value="Web Dev">Web Dev</option>
                </select>

                <div className="question-card">
                    <h3>Question {currentQuestionIndex + 1} / {mockQuestions.length}</h3>
                    <p>{mockQuestions[currentQuestionIndex].question}</p>
                    <p className="timer">⏳ Time Left: {timeLeft}s</p>
                    <textarea
                        placeholder="Type your answer here..."
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                    ></textarea>
                    <button className="next-btn" onClick={handleNextQuestion}>
                        {currentQuestionIndex < mockQuestions.length - 1 ? "Next Question" : "Finish Interview"}
                    </button>
                </div>
            </div>

            <div className="right-sidebar">
                <h3>📊 Your Score</h3>
                <p>{score} / {mockQuestions.length * 10}</p>

                <h3>💡 Inspiration</h3>
                <blockquote>“The best way to predict the future is to create it.” – Peter Drucker</blockquote>

                <h3>💬 Feedback</h3>
                <pre className="feedback-box">{feedback}</pre>
            </div>
        </div>
    );
};

export default TechnicalInterview;
