

import React, { useEffect, useState, useRef } from "react";

const fillerWordsList = ["um", "uh", "like", "you know", "so", "actually", "basically"];

const HRInterview = () => {
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [isRecording, setIsRecording] = useState(false);
    const [transcript, setTranscript] = useState("");
    const [confidenceScore, setConfidenceScore] = useState(0);
    const [feedbackSummary, setFeedbackSummary] = useState([]);
    const recognitionRef = useRef(null);

    useEffect(() => {
        const fetchHRQuestions = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await fetch("http://localhost:5000/api/interview/hr", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await response.json();
                setQuestions(data.questions);
            } catch (error) {
                console.error("Error fetching HR questions:", error);
            }
        };
        fetchHRQuestions();
    }, []);

    useEffect(() => {
        if (!("webkitSpeechRecognition" in window)) {
            alert("Speech Recognition not supported in this browser");
            return;
        }

        const SpeechRecognition = window.webkitSpeechRecognition;
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = "en-US";

        recognitionRef.current.onresult = (event) => {
            let interim = "";
            for (let i = event.resultIndex; i < event.results.length; i++) {
                const part = event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    setTranscript((prev) => {
                        const full = prev + part + " ";
                        setConfidenceScore(calculateConfidenceScore(full));
                        return full;
                    });
                } else {
                    interim += part;
                }
            }
        };

        recognitionRef.current.onend = () => setIsRecording(false);
    }, []);

    const handleStart = () => {
        setTranscript("");
        setIsRecording(true);
        recognitionRef.current.start();
    };

    const handleStop = () => {
        recognitionRef.current.stop();
        setIsRecording(false);
    };

    const handleNextQuestion = async () => {
        const currentQ = questions[currentQuestionIndex];
        const feedback = {
            question: currentQ.questionText,
            answer: transcript,
            confidence: confidenceScore,
            idealAnswer: currentQ.idealAnswer,
        };
        setFeedbackSummary((prev) => [...prev, feedback]);

        const token = localStorage.getItem("token");
        await fetch("http://localhost:5000/api/interview/saveAttempt", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(feedback),
        });

        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setTranscript("");
            setConfidenceScore(0);
        }
    };

    const calculateConfidenceScore = (text) => {
        const words = text.trim().split(/\s+/);
        const total = words.length;
        let fillerCount = 0;

        fillerWordsList.forEach((filler) => {
            const regex = new RegExp(`\\b${filler}\\b`, "gi");
            const matches = text.match(regex);
            if (matches) fillerCount += matches.length;
        });

        const penalty = fillerCount * 3 + (total < 8 ? 10 : 0);
        return Math.max(0, 100 - penalty);
    };

    const highlightFillerWords = (text) => {
        const words = text.split(" ");
        return words.map((word, idx) => {
            const clean = word.toLowerCase().replace(/[^a-zA-Z]/g, "");
            if (fillerWordsList.includes(clean)) {
                return <span key={idx} style={{ color: "red" }}>{word} </span>;
            }
            return <span key={idx}>{word} </span>;
        });
    };

    return (
        <div className="mock-interview-container">
            <div className="left-sidebar">
                <h3>🧠 HR Tips</h3>
                <ul>
                    <li>Be honest & confident</li>
                    <li>Maintain good tone & clarity</li>
                    <li>Use real-life examples</li>
                </ul>
                <div className="progress">
                    <p>Progress: {currentQuestionIndex + 1} / {questions.length}</p>
                    <progress value={currentQuestionIndex + 1} max={questions.length}></progress>
                </div>
            </div>

            <div className="interview-box">
                <h2>HR Interview</h2>
                {questions.length > 0 ? (
                    <div className="question-card">
                        <h3>Question {currentQuestionIndex + 1}</h3>
                        <p>{questions[currentQuestionIndex]?.questionText}</p>
                        <button onClick={isRecording ? handleStop : handleStart}>
                            {isRecording ? "🛑 Stop" : "🎤 Start Speaking"}
                        </button>
                        <div className="transcript-box">
                            <p><strong>Your Answer:</strong></p>
                            <div style={{ border: "1px solid #ccc", padding: "10px", minHeight: "80px" }}>
                                {highlightFillerWords(transcript)}
                            </div>
                        </div>
                        <p>Confidence Score:</p>
                        <progress value={confidenceScore} max="100" style={{ width: "100%" }}></progress>
                        <p>{confidenceScore}%</p>
                        <button onClick={handleNextQuestion}>Next</button>
                    </div>
                ) : <p>Loading HR questions...</p>}

                {feedbackSummary.length > 0 && (
                    <div style={{ marginTop: 30 }}>
                        <h3>📝 Feedback Summary</h3>
                        {feedbackSummary.map((f, i) => (
                            <div key={i} style={{ marginBottom: 15 }}>
                                <p><strong>Q:</strong> {f.question}</p>
                                <p><strong>Your Answer:</strong> {f.answer}</p>
                                <p><strong>Confidence:</strong> {f.confidence}%</p>
                                <p><strong>Ideal Answer:</strong> {f.idealAnswer}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default HRInterview;

