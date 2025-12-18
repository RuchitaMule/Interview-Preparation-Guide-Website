

import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/MockInterviews.css";

const MockInterview = () => {
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answer, setAnswer] = useState("");
    const [responses, setResponses] = useState([]);
    const [isInterviewStarted, setIsInterviewStarted] = useState(false);
    const [isInterviewFinished, setIsInterviewFinished] = useState(false);
    const [timeLeft, setTimeLeft] = useState(180);
    const [cheatingCount, setCheatingCount] = useState(0);
    const navigate = useNavigate();

    // Fetch questions
    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/interview/mock-questions", {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                });
                setQuestions(response.data.questions);
            } catch (error) {
                console.error("Error fetching questions:", error);
            }
        };

        if (isInterviewStarted) fetchQuestions();
    }, [isInterviewStarted]);

    // Submit interview
    const submitInterview = useCallback(async (finalResponses) => {
        try {
            const response = await axios.post(
                "http://localhost:5000/api/interview/submit",
                { answers: finalResponses },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            console.log("Interview Submitted:", response.data);
            setIsInterviewFinished(true);
            setIsInterviewStarted(false);

            setTimeout(() => {
                navigate("/Progress");
            }, 3000);
        } catch (error) {
            console.error("Error submitting interview:", error);
        }
    }, [navigate]);

    // Answer submission
    const handleAnswerSubmit = useCallback(async () => {
        const currentQuestion = questions[currentQuestionIndex];
        const responseObj = {
            questionId: currentQuestion._id,
            userAnswer: answer.trim(),
        };

        const updatedResponses = [...responses, responseObj];
        setResponses(updatedResponses);
        setAnswer("");

        if (currentQuestionIndex === 9) {
            await submitInterview(updatedResponses);
        } else {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setTimeLeft(180);
        }
    }, [answer, currentQuestionIndex, questions, responses, submitInterview]);

    // Timer
    useEffect(() => {
        let timer;
        if (isInterviewStarted && !isInterviewFinished && timeLeft > 0) {
            timer = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
        } else if (timeLeft === 0 && isInterviewStarted && !isInterviewFinished) {
            handleAnswerSubmit();
        }

        return () => clearTimeout(timer);
    }, [timeLeft, isInterviewStarted, isInterviewFinished, handleAnswerSubmit]);

    // Cancel Interview
    const cancelInterview = () => {
        if (window.confirm("Are you sure you want to cancel this interview? All progress will be lost.")) {
            setQuestions([]);
            setResponses([]);
            setIsInterviewStarted(false);
            setIsInterviewFinished(false);
            setCurrentQuestionIndex(0);
            setAnswer("");
            setTimeLeft(180);
            setCheatingCount(0);
        }
    };

    // // Cheating detection (window blur)
    // useEffect(() => {
    //     const handleBlur = async () => {
    //         if (isInterviewStarted && !isInterviewFinished) {
    //             const newCount = cheatingCount + 1;
    //             setCheatingCount(newCount);

    //             if (newCount >= 3) {
    //                 alert("Cheating detected 3 times. Auto-submitting interview.");
    //                 const currentQuestion = questions[currentQuestionIndex];
    //                 const responseObj = {
    //                     questionId: currentQuestion?._id,
    //                     userAnswer: answer.trim(),
    //                 };

    //                 const finalResponses = [...responses];
    //                 if (currentQuestion) {
    //                     finalResponses.push(responseObj);
    //                 }

    //                 await submitInterview(finalResponses);
    //             } else {
    //                 alert(`Cheating detected (${newCount}/3)! Do not switch tabs or minimize the window.`);
    //             }
    //         }
    //     };

    //     window.addEventListener("blur", handleBlur);
    //     return () => window.removeEventListener("blur", handleBlur);
    // }, [isInterviewStarted, isInterviewFinished, cheatingCount, answer, responses, currentQuestionIndex, questions, submitInterview]);

    useEffect(() => {
        const handleBlur = async () => {
            if (isInterviewStarted && !isInterviewFinished) {
                const newCount = cheatingCount + 1;
                setCheatingCount(newCount);

                if (newCount >= 3) {
                    alert("Cheating detected 3 times. Interview will now be submitted.");

                    const currentQuestion = questions[currentQuestionIndex];
                    const responseObj = {
                        questionId: currentQuestion?._id,
                        userAnswer: answer.trim(),
                    };

                    const finalResponses = [...responses];
                    if (currentQuestion) {
                        finalResponses.push(responseObj);
                    }

                    setIsInterviewFinished(true); // 👈 UI immediately reflects end of interview
                    setIsInterviewStarted(false); // 👈 prevent any more interaction

                    await submitInterview(finalResponses); // 👈 formally submit
                } else {
                    alert(`Cheating detected (${newCount}/3)! Do not switch tabs or minimize the window.`);
                }
            }
        };

        window.addEventListener("blur", handleBlur);
        return () => window.removeEventListener("blur", handleBlur);
    }, [isInterviewStarted, isInterviewFinished, cheatingCount, answer, responses, currentQuestionIndex, questions, submitInterview]);


    return (
        <div className="mock-interview-container">
            {!isInterviewStarted ? (
                <div className="text-center">
                    <h2>Mock Interview</h2>
                    <p>Click below to begin a 10-question mock interview (5 Tech + 5 HR)</p>
                    <button onClick={() => setIsInterviewStarted(true)} className="btn start-btn">
                        Start Interview
                    </button>
                </div>
            ) : isInterviewFinished ? (
                <div className="success-message">
                    <h2>Interview Submitted!</h2>
                    <p>Redirecting to your progress page...</p>
                </div>
            ) : (
                <div>
                    <div className="timer">
                        Question {currentQuestionIndex + 1} of 10 — Time Left: {timeLeft}s
                    </div>
                    <div className="question-card">
                        <p>{questions[currentQuestionIndex]?.questionText}</p>
                    </div>
                    <textarea
                        rows="4"
                        placeholder="Type your answer here..."
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                    />
                    <div className="button-group">
                        <button onClick={cancelInterview} className="btn cancel-btn">
                            Cancel
                        </button>
                        <button onClick={handleAnswerSubmit} className="btn next-btn">
                            {currentQuestionIndex === 9 ? "Submit" : "Next"}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MockInterview;
