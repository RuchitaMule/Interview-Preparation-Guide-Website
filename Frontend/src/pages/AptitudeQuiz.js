
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/AptitudeQuiz.css';

const AptitudeQuiz = () => {
    const { difficulty } = useParams();
    const navigate = useNavigate();
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState('');
    const [showExplanation, setShowExplanation] = useState(false);
    const [loading, setLoading] = useState(true);
    const [feedback, setFeedback] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);

    const [correctCount, setCorrectCount] = useState(0);
    const [incorrectCount, setIncorrectCount] = useState(0);

    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const res = await axios.get(`/api/aptitude/questions/${difficulty}`);
                setQuestions(res.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching questions:', error);
                setLoading(false);
            }
        };

        fetchQuestions();
    }, [difficulty]);

    const handleOptionChange = (e) => {
        setSelectedOption(e.target.value);
    };

    const handleSubmit = async () => {
        if (!selectedOption) {
            alert('Please select an option!');
            return;
        }

        if (isSubmitted) return;

        const currentQuestion = questions[currentQuestionIndex];
        const isCorrect = selectedOption === currentQuestion.correctAnswer;

        if (isCorrect) {
            setCorrectCount(prev => prev + 1);
        } else {
            setIncorrectCount(prev => prev + 1);
        }

        setFeedback(isCorrect ? '✅ Correct!' : `❌ Incorrect! Correct answer: ${currentQuestion.correctAnswer}`);
        setShowExplanation(true);
        setIsSubmitted(true);

        try {
            await axios.patch(
                'http://localhost:5000/api/aptitude/attempt',
                { difficulty },
                { headers: { Authorization: `Bearer ${token}` } }
            );
        } catch (error) {
            console.error('Error updating progress:', error);
        }
    };

    const handleNext = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setSelectedOption('');
            setFeedback('');
            setShowExplanation(false);
            setIsSubmitted(false);
        } else {
            alert(`Aptitude quiz completed! ✅\nCorrect: ${correctCount} | Incorrect: ${incorrectCount}`);
            navigate('/aptitude/start');
        }
    };

    if (loading) return <div className="quiz-loading">Loading Questions...</div>;
    if (questions.length === 0) return <div className="quiz-loading">No questions found.</div>;

    const currentQuestion = questions[currentQuestionIndex];

    return (
        <div className="apt-quiz-container">
            <div className="apt-quiz-card">
                <h2 className="apt-quiz-title">
                    {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} Aptitude Questions
                </h2>
                <h3 className="apt-quiz-subtitle">
                    Question {currentQuestionIndex + 1} of {questions.length}
                </h3>

                <p className="apt-quiz-question">{currentQuestion.questionText}</p>

                <div className="apt-quiz-options">
                    {currentQuestion.options.map((option, index) => (
                        <label key={index} className="quiz-option">
                            <input
                                type="radio"
                                value={option}
                                checked={selectedOption === option}
                                onChange={handleOptionChange}
                            />
                            <span>{option}</span>
                        </label>
                    ))}
                </div>

                {feedback && <div className="apt-quiz-feedback">{feedback}</div>}

                {showExplanation && (
                    <div className="apt-quiz-explanation">
                        <h4>Explanation:</h4>
                        <p>{currentQuestion.explanation || 'No explanation provided.'}</p>
                    </div>
                )}

                <div className="apt-quiz-buttons">
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitted}
                        className="btn btn-submit"
                    >
                        Submit
                    </button>
                    <button
                        onClick={handleNext}
                        className="btn btn-next"
                    >
                        Next
                    </button>
                </div>

                <div className="apt-quiz-stats">
                    ✅ Correct: <strong>{correctCount}</strong> | ❌ Incorrect: <strong>{incorrectCount}</strong>
                </div>
            </div>
        </div>
    );
};

export default AptitudeQuiz;





