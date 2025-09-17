

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../styles/AdminQuestions.css"

const AdminQuestions = () => {
    const [questions, setQuestions] = useState([]);
    const [editQuestion, setEditQuestion] = useState(null);

    useEffect(() => {
        fetchQuestions();
    }, []);

    const fetchQuestions = async () => {
        const res = await axios.get("http://localhost:5000/api/admin/questions", { withCredentials: true });
        setQuestions(res.data);
    };

    const handleDelete = async (id) => {
        await axios.delete(`http://localhost:5000/api/admin/question/${id}`, { withCredentials: true });
        fetchQuestions();
    };

    const handleEditSave = async () => {
        await axios.put(`http://localhost:5000/api/admin/question/${editQuestion._id}`, editQuestion, { withCredentials: true });
        setEditQuestion(null);
        fetchQuestions();
    };

    const handleChange = (e) => {
        setEditQuestion({ ...editQuestion, [e.target.name]: e.target.value });
    };

    return (
        <div className="admin-questions-container">
            <div className="questions-header">
                <h2>All Questions</h2>
                <Link to="/admin/questions/add">
                    <button className="add-question-btn">+ Add Question</button>
                </Link>
            </div>

            <table className="questions-table">
                <thead>
                    <tr>
                        <th>Question</th>
                        <th>Topic</th>
                        <th>Difficulty</th>
                        <th>Correct Answer</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {questions.map(q => (
                        <tr key={q._id}>
                            <td>{q.questionText}</td>
                            <td>{q.topic}</td>
                            <td>{q.difficulty}</td>
                            <td>{q.correctAnswer}</td>
                            <td>
                                <button className="edit-btn" onClick={() => setEditQuestion(q)}>Edit</button>
                                <button className="delete-btn" onClick={() => handleDelete(q._id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {editQuestion && (
                <div className="edit-question-modal">
                    <h3>Edit Question</h3>
                    <label>Question Text:</label>
                    <input type="text" name="questionText" value={editQuestion.questionText} onChange={handleChange} />

                    <label>Topic:</label>
                    <input type="text" name="topic" value={editQuestion.topic} onChange={handleChange} />

                    <label>Difficulty:</label>
                    <select name="difficulty" value={editQuestion.difficulty} onChange={handleChange}>
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                    </select>

                    <label>Correct Answer:</label>
                    <input type="text" name="correctAnswer" value={editQuestion.correctAnswer} onChange={handleChange} />

                    <label>Options (comma separated):</label>
                    <input type="text" name="options" value={editQuestion.options.join(",")} onChange={(e) => setEditQuestion({ ...editQuestion, options: e.target.value.split(",") })} />

                    <label>Explanation:</label>
                    <input type="text" name="explanation" value={editQuestion.explanation} onChange={handleChange} />

                    <div className="edit-actions">
                        <button className="save-btn" onClick={handleEditSave}>Save</button>
                        <button className="cancel-btn" onClick={() => setEditQuestion(null)}>Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminQuestions;
