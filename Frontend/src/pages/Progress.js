



import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import axios from "axios";
import "../styles/ProgressTracking.css";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const ProgressTracking = () => {
    const [selectedSection, setSelectedSection] = useState(null);
    const [mockInterviewProgress, setMockInterviewProgress] = useState(null);
    const [quizAttempts, setQuizAttempts] = useState([]);
    const [roadmapProgress, setRoadmapProgress] = useState([]);
    const [aptitudeStats, setAptitudeStats] = useState(null);
    const [showModal, setShowModal] = useState(false);
    // const [selectedRoadmap, setSelectedRoadmap] = useState(null);
    const navigate = useNavigate();

    const handleReviewClick = (attemptId) => {
        navigate(`/review-quiz/${attemptId}`);
    };

    const [overallStats, setOverallStats] = useState({
        Quiz: 0,
        Aptitude: 0,
        "Mock Interview": 0,
        Roadmap: 60
    });

    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    useEffect(() => {
        document.body.style.overflow = showModal ? "hidden" : "auto";
    }, [showModal]);

    const sectionIcons = {
        Quiz: "🧠",
        "Mock Interview": "💬",
        Aptitude: "📊",
        Roadmap: "🛣️"
    };

    const fetchQuizAttempts = useCallback(async () => {
        try {
            // 1. Get full quiz attempts
            const res = await axios.get(
                `http://localhost:5000/api/quiz/user-attempts/${userId}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const attempts = res.data.attempts || [];
            setQuizAttempts(attempts);

            // 2. Calculate overall quiz score percentage
            const totalQuestionsAttempted = attempts.reduce((sum, attempt) => sum + attempt.questions.length, 0);
            const totalScore = attempts.reduce((sum, attempt) => sum + attempt.score, 0);
            // const formattedTime = `${Math.floor(attempt.timeTaken / 60)}m ${attempt.timeTaken % 60}s`;

            const quizPercentage = totalQuestionsAttempted > 0
                ? Math.round((totalScore / totalQuestionsAttempted) * 100)
                : 0;

            setOverallStats(prev => ({
                ...prev,
                Quiz: quizPercentage
            }));

        } catch (error) {
            console.error("Error fetching quiz attempts", error);
        }
    }, [userId, token]);

    const fetchRoadmapProgress = useCallback(async () => {
        try {
            const res = await axios.get(
                `http://localhost:5000/api/roadmap/progress/${userId}`,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            const roadmapData = res.data.data;
            if (Array.isArray(roadmapData) && roadmapData.length > 0) {
                setRoadmapProgress(roadmapData);

                const avgPercent = Math.round(
                    roadmapData.reduce((acc, curr) => acc + (curr.completionPercent || 0), 0) / roadmapData.length
                );

                setOverallStats(prev => ({
                    ...prev,
                    Roadmap: avgPercent
                }));
            } else {
                setRoadmapProgress([]);
                setOverallStats(prev => ({
                    ...prev,
                    Roadmap: 0
                }));
            }
        } catch (error) {
            console.error("Error fetching roadmap progress", error);
        }
    }, [userId, token]);




    const fetchAptitudeProgress = useCallback(async () => {
        try {
            const res = await axios.get(
                "http://localhost:5000/api/aptitude/aptitude-progress",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const {
                aptitudeQuestionsPracticed,
                aptitudeQuestionsEasy,
                aptitudeQuestionsMedium,
                aptitudeQuestionsHard
            } = res.data;



            const TOTAL_EASY = 30;
            const TOTAL_MEDIUM = 40;
            const TOTAL_HARD = 30;

            const totalExpected = TOTAL_EASY + TOTAL_MEDIUM + TOTAL_HARD;
            const totalCompleted = aptitudeQuestionsEasy + aptitudeQuestionsMedium + aptitudeQuestionsHard;

            const aptitudePercentage = Math.round((totalCompleted / totalExpected) * 100);

            // console.log("API Response:", res.data);

            // Update overall stats
            setOverallStats(prev => ({
                ...prev,
                Aptitude: aptitudePercentage
            }));

            // Update individual aptitude stats
            setAptitudeStats({
                practiced: aptitudeQuestionsPracticed,
                easy: aptitudeQuestionsEasy,
                medium: aptitudeQuestionsMedium,
                hard: aptitudeQuestionsHard
            });
        } catch (error) {
            console.error("Error fetching aptitude progress", error);
        }
    }, [token]);

    const fetchMockInterviewProgress = useCallback(async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/interview/progress", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            setMockInterviewProgress(response.data);
        } catch (error) {
            console.error("Error fetching mock interview progress:", error);
        }
    }, []);








    useEffect(() => {
        fetchQuizAttempts();
        fetchRoadmapProgress();
        fetchAptitudeProgress();
        fetchMockInterviewProgress();
    }, [fetchQuizAttempts, fetchRoadmapProgress, fetchAptitudeProgress, fetchMockInterviewProgress]);

    const handleSectionClick = (section) => {
        setSelectedSection(section);
        setShowModal(true);
    };

    // const handleReviewClick = (attemptId) => {
    //     // Navigate to review page (adjust route if needed)
    //     window.location.href = `/review-quiz/${attemptId}`;
    // };



    return (
        <div className="progress-container">
            <h1>📈 My Progress Dashboard</h1>

            <div className="card-section">
                {Object.entries(overallStats).map(([section, percentage]) => (
                    <div className="progress-card" key={section} onClick={() => handleSectionClick(section)}>
                        <h3>{sectionIcons[section]} {section}</h3>
                        <div className="bar">
                            <div className="fill" style={{ width: `${percentage}%` }}></div>
                        </div>
                        <p>{percentage}% Completed</p>
                    </div>
                ))}
            </div>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <span className="close-btn" onClick={() => setShowModal(false)}>&times;</span>

                        {selectedSection === "Quiz" && (
                            <>
                                <h2>🧠 Quiz Attempts</h2>
                                {quizAttempts.length === 0 ? (
                                    <p>No attempts yet!</p>
                                ) : (
                                    quizAttempts.map((attempt, index) => {


                                        return (
                                            <div className="attempt-box" key={index}>
                                                <p>
                                                    <strong>Topic:</strong>{" "}
                                                    <button
                                                        onClick={() => handleReviewClick(attempt._id)}
                                                        className="review-btn"
                                                    >
                                                        {attempt.selectedOption}
                                                    </button>
                                                </p>
                                                <p><strong>Date:</strong> {new Date(attempt.createdAt).toLocaleDateString()}</p>

                                                <p><strong>Time Taken:</strong> {attempt.timeTaken}</p>

                                                <div className="bar-container">
                                                    <div
                                                        className="bar-fill"
                                                        style={{ width: `${(attempt.score / attempt.questions.length) * 100}%` }}
                                                    >
                                                        {attempt.score}/{attempt.questions.length}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </>
                        )}

                        {selectedSection === "Aptitude" && (
                            <>
                                <h2>📊 Aptitude Progress</h2>
                                {aptitudeStats ? (
                                    <>
                                        <p><strong>Total Questions Practiced:</strong> {aptitudeStats.practiced}</p>
                                        <div className="attempt-box">
                                            <p>Easy: {aptitudeStats.easy}</p>
                                            <p>Medium: {aptitudeStats.medium}</p>
                                            <p>Hard: {aptitudeStats.hard}</p>
                                        </div>
                                    </>
                                ) : (
                                    <p>No aptitude attempts yet!</p>
                                )}
                            </>

                        )}


                        {selectedSection === "Mock Interview" && mockInterviewProgress && (
                            <>
                                <h2>🗣️ Mock Interview Progress</h2>
                                <div className="attempt-box" style={{ marginBottom: "20px" }}>
                                    <p><strong>Total Interviews:</strong> {mockInterviewProgress.totalInterviews}</p>
                                    <p><strong>Last Interview:</strong> {new Date(mockInterviewProgress.lastInterviewDate).toLocaleString()}</p>
                                    <p><strong>Average Score:</strong> {mockInterviewProgress.averageScore.toFixed(2)} / 5</p>

                                    <div className="bar-container" style={{ marginBottom: "10px" }}>
                                        <div
                                            className="bar-fill"
                                            style={{
                                                width: `${(mockInterviewProgress.averageScore / 5) * 100}%`,
                                                backgroundColor: "#4caf50",
                                                color: "#fff"
                                            }}
                                        >
                                            {(mockInterviewProgress.averageScore / 5 * 100).toFixed(0)}%
                                        </div>
                                    </div>

                                    <h4 style={{ marginTop: "1rem" }}>📋 Feedback Summary</h4>
                                    {mockInterviewProgress.feedbackSummary.map((item, index) => (
                                        <div key={index} className="attempt-box" style={{ marginTop: "10px" }}>
                                            <p><strong>Date:</strong> {new Date(item.date).toLocaleDateString()}</p>
                                            <p><strong>Tech Score:</strong> {item.techScore}</p>
                                            <p><strong>HR Score:</strong> {item.hrScore}</p>
                                            <p><strong>Feedback:</strong> {item.overallFeedback}</p>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}


                        {selectedSection === "Roadmap" && roadmapProgress.length > 0 && (
                            <>
                                <h2>🗺️ Roadmap Progress</h2>
                                {roadmapProgress.map((roadmap, rIndex) => (
                                    <div key={rIndex} className="attempt-box" style={{ marginBottom: "20px" }}>
                                        <p><strong>{roadmap.title}</strong></p>
                                        <p><strong>Steps Completed:</strong> {roadmap.completedStepsCount} / {roadmap.totalSteps}</p>

                                        <div className="bar-container" style={{ marginBottom: "10px" }}>
                                            <div
                                                className="bar-fill"
                                                style={{ width: `${roadmap.completionPercent}%` }}
                                            >
                                                {roadmap.completionPercent}%
                                            </div>
                                        </div>

                                        {Array.isArray(roadmap.steps) && roadmap.steps.map((step, stepIndex) => (
                                            <div key={stepIndex} style={{ marginBottom: "10px" }}>
                                                <strong>{step.step}</strong>
                                                <ul style={{ marginLeft: "15px", marginTop: "5px" }}>
                                                    {Array.isArray(step.subSteps) && step.subSteps.map((subStep, subIndex) => (
                                                        <li key={subIndex} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                                            <input
                                                                type="checkbox"
                                                                checked={subStep.completed}
                                                                onChange={async (e) => {
                                                                    try {
                                                                        await axios.patch(
                                                                            "http://localhost:5000/api/roadmap/progress/update",
                                                                            {
                                                                                roadmapId: roadmap.roadmapId,
                                                                                subStepText: subStep.text,
                                                                                checked: e.target.checked
                                                                            },
                                                                            {
                                                                                headers: { Authorization: `Bearer ${token}` }
                                                                            }
                                                                        );
                                                                        const updated = [...roadmapProgress];
                                                                        updated[rIndex].steps[stepIndex].subSteps[subIndex].completed = e.target.checked;
                                                                        setRoadmapProgress(updated);
                                                                    } catch (err) {
                                                                        console.error("Failed to update substep:", err);
                                                                    }
                                                                }}
                                                            />
                                                            <span style={{ textDecoration: subStep.completed ? "line-through" : "none" }}>
                                                                {subStep.text}
                                                            </span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </>
                        )}
                    </div>
                </div>
            )}

            <div className="weekly-summary">
                <h3>🌟 Weekly Motivation</h3>
                <p>“Success is the sum of small efforts, repeated day in and day out.”</p>
                <h4>🎯 Achievements:</h4>
                <ul>
                    <li>✅ First Quiz Completed</li>
                    <li>✅ 50% Roadmap Finished</li>
                </ul>
            </div>

            <div className="growth-chart">
                <h2>📊 Overall Growth</h2>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={Object.entries(overallStats).map(([name, value]) => ({ name, value }))}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value" fill="#82ca9d" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default ProgressTracking;


