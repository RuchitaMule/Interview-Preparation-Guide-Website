


import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/AddQuestion.css"; // ✅ Create this CSS file

const AddQuestion = () => {
    const [questionText, setQuestionText] = useState("");
    const [options, setOptions] = useState(["", "", "", ""]);
    const [correctAnswer, setCorrectAnswer] = useState("");
    const [topic, setTopic] = useState("");
    const [difficulty, setDifficulty] = useState("easy");
    const [explanation, setExplanation] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const newQuestion = {
                questionText,
                options,
                correctAnswer,
                topic,
                difficulty,
                explanation,
            };

            await axios.post("http://localhost:5000/api/admin/questions", newQuestion, {
                withCredentials: true
            });

            alert("Question added successfully!");
            navigate("/admin/questions");
        } catch (error) {
            console.error("Error adding question:", error);
            alert("Failed to add question!");
        }
    };

    const handleOptionChange = (value, index) => {
        const newOptions = [...options];
        newOptions[index] = value;
        setOptions(newOptions);
    };

    return (
        <div className="add-question-container">
            <h2>Add New Question</h2>
            <form onSubmit={handleSubmit} className="add-question-form">
                <div className="form-group">
                    <label>Question Text</label>
                    <input
                        type="text"
                        value={questionText}
                        onChange={(e) => setQuestionText(e.target.value)}
                        required
                        className="question-text"
                    />
                </div>

                <div className="form-group">

                    <label>Options</label>
                    {options.map((option, index) => (
                        <input
                            key={index}
                            type="text"
                            value={option}
                            placeholder={`Option ${index + 1}`}
                            onChange={(e) => handleOptionChange(e.target.value, index)}
                            required
                            className={`option-${index}`}
                        />

                    ))}
                </div>



                <div className="form-group">
                    <label>Correct Answer</label>
                    <input type="text"
                        value={correctAnswer}

                        onChange={(e) => setCorrectAnswer(e.target.value)}
                        required
                        className="correct-answer"
                    />
                </div>
                <div className="form-group">

                    <label>Topic</label>
                    <input type="text" value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        required
                        className="topic"
                    />
                </div>

                <div className="form-group">

                    <label>Difficulty</label>
                    <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} required
                        className="difficulty"
                    >
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                    </select>
                </div>
                <div className="form-group">

                    <label>Explanation</label>
                    <textarea value={explanation} onChange={(e) => setExplanation(e.target.value)} rows="3"
                        className="explanation"

                    />
                </div>

                <button type="submit" className="submit-btn">Add Question</button>
            </form>
        </div>
    );
};

export default AddQuestion;
