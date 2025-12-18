
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "../styles/Quiz.css";

const Quizzes = () => {
    const [selectedTopic, setSelectedTopic] = useState("");
    const [topics, setTopics] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [startTime, setStartTime] = useState(null);
    const [timer, setTimer] = useState(0);
    const [userQuizProgress, setUserQuizProgress] = useState({ completedQuizzes: 0, totalQuestionsAttempted: 0, totalScore: 0 });

    const cheatingCountRef = useRef(0);
    const userId = localStorage.getItem("userId");

    useEffect(() => {
        const fetchQuizAttempts = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/quiz/user-quiz-progress/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setUserQuizProgress(response.data || { completedQuizzes: 0, totalQuestionsAttempted: 0, totalScore: 0 });
            } catch (error) {
                console.error("Error fetching quiz progress:", error);
            }
        };

        if (userId) fetchQuizAttempts();
    }, [userId]);

    useEffect(() => {
        const fetchTopics = async () => {
            try {
                const res = await axios.get("http://localhost:5000/api/quiz/distinct-topics");
                setTopics(res.data);
            } catch (error) {
                console.error("Error fetching topics", error);
            }
        };
        fetchTopics();
    }, []);

    useEffect(() => {
        const handleCheating = () => {
            if (showModal && !isSubmitting) {
                cheatingCountRef.current += 1;
                if (cheatingCountRef.current >= 3) {
                    alert("Cheating detected 3 times! Auto-submitting the quiz.");
                    handleSubmitQuiz();
                } else {
                    alert(`Warning: Cheating detected! (${cheatingCountRef.current}/3)`);
                }
            }
        };

        window.addEventListener("blur", handleCheating);
        document.addEventListener("visibilitychange", () => {
            if (document.hidden) handleCheating();
        });

        return () => {
            window.removeEventListener("blur", handleCheating);
            document.removeEventListener("visibilitychange", handleCheating);
        };
    }, [showModal, isSubmitting]);

    useEffect(() => {
        let interval;
        if (showModal) {
            setStartTime(Date.now());
            interval = setInterval(() => {
                setTimer(Math.floor((Date.now() - startTime) / 1000));
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [showModal, startTime]);

    const fetchQuestions = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                alert("You need to log in first!");
                return;
            }

            const res = await axios.get(`http://localhost:5000/api/quiz/get-quiz?topic=${selectedTopic}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const limitedQuestions = res.data.slice(0, 10); // Only first 10
            setQuestions(limitedQuestions);
            setShowModal(true);
            setUserAnswers({});
            setCurrentQuestionIndex(0);
            cheatingCountRef.current = 0;
            setTimer(0);
        } catch (error) {
            console.error("Error fetching questions", error.response || error);
        }
    };

    const handleQuizStart = () => {
        if (!selectedTopic) {
            alert("Please select a topic before starting the quiz.");
            return;
        }
        fetchQuestions();
    };

    const handleAnswerChange = (selected) => {
        setUserAnswers({ ...userAnswers, [currentQuestionIndex]: selected });
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}m ${secs}s`;
    };

    const handleNextQuestion = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };

    const handleSubmitQuiz = async () => {
        setIsSubmitting(true);
        let score = 0;

        const formattedQuestions = questions.map((q, index) => {
            const selectedAnswer = userAnswers[index];
            const isCorrect = selectedAnswer === q.correctAnswer;
            if (isCorrect) score++;

            return {
                questionId: q._id,
                questionText: q.questionText,
                options: q.options,
                correctAnswer: q.correctAnswer,
                explanation: q.explanation,
                selectedAnswer,
                isCorrect,
                topic: q.topic,
                difficulty: q.difficulty
            };
        });

        const timeTaken = formatTime(timer);

        try {
            const token = localStorage.getItem("token");
            await axios.post("http://localhost:5000/api/quiz/save-quiz", {
                userId,
                selectedOption: selectedTopic,
                timeTaken,
                questions: formattedQuestions,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            alert(`Quiz submitted! Your score: ${score}/${questions.length}`);
            setShowModal(false);
        } catch (error) {
            console.error("Error saving quiz", error);
        }
    };

    return (

        <div className="quiz-container">
            <h2>Choose Your Quiz Topic</h2>
            <select value={selectedTopic} onChange={(e) => setSelectedTopic(e.target.value)} required>
                <option value="">Select Topic</option>
                {topics.map((topic) => (
                    <option key={topic} value={topic}>{topic}</option>
                ))}
            </select>



            <button className="start-quiz-btn" onClick={handleQuizStart}>Start Quiz</button>


            {userQuizProgress && (
                <div className="quiz-progress">
                    <h3>Your Quiz Attempts</h3>
                    <p>{`Completed Quizzes: ${userQuizProgress.completedQuizzes}`}</p>
                    <p>{`Total Questions Attempted: ${userQuizProgress.totalQuestionsAttempted}`}</p>
                    <p>{`Total Score: ${userQuizProgress.totalScore}`}</p>
                </div>
            )}

            {showModal && (
                <div className="quiz-modal-overlay">
                    <div className="quiz-modal">
                        <span className="close-btn" onClick={() => setShowModal(false)}>&times;</span>

                        <h3>Quiz Question {currentQuestionIndex + 1} of {questions.length}</h3>
                        <p><strong>Timer:</strong> {formatTime(timer)}</p>

                        {questions[currentQuestionIndex] && (
                            <div className="question-box">
                                <p><strong>Q:</strong> {questions[currentQuestionIndex].questionText}</p>
                                {questions[currentQuestionIndex].options.map((option, i) => (
                                    <div key={i} style={{ marginBottom: '8px' }}>
                                        <label>
                                            <input
                                                type="radio"
                                                name={`question-${currentQuestionIndex}`}
                                                value={option}
                                                checked={userAnswers[currentQuestionIndex] === option}
                                                onChange={() => handleAnswerChange(option)}
                                            />
                                            {" "}{option}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        )}



                        <div className="modal-buttons">
                            {currentQuestionIndex < questions.length - 1 ? (
                                <button className="submit-quiz-btn" onClick={handleNextQuestion}>Next</button>
                            ) : (
                                <button className="submit-quiz-btn" onClick={handleSubmitQuiz}>Submit Quiz</button>
                            )}
                        </div>

                    </div>

                </div>
            )}

        </div>


    );
};

export default Quizzes;
