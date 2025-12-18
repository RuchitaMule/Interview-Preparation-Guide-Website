




import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/AdminDashboard.css";
import {
    FaUsers, FaTachometerAlt, FaQuestionCircle, FaRoute,
    FaEnvelope, FaSignOutAlt, FaChalkboardTeacher
} from 'react-icons/fa';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState("dashboard");
    const [showQuestionAction, setShowQuestionAction] = useState(false);
    const [contactMessages, setContactMessages] = useState([]);
    const [selectedReply, setSelectedReply] = useState({});
    const [stats, setStats] = useState({});
    const [activity, setActivity] = useState({
        latestUsers: [],
        latestQuizzes: [],
        latestContactMessages: [],
        latestRoadmaps: []
    });
    const navigate = useNavigate();

    useEffect(() => {
        axios.get("http://localhost:5000/api/admin/dashboard", { withCredentials: true })
            .catch(err => {
                if (err.response?.status === 401) {
                    navigate("/admin/login");
                }
            });

        axios.get("http://localhost:5000/api/admin/stats", { withCredentials: true })
            .then(res => setStats(res.data))
            .catch(err => alert("Failed to fetch admin stats."));

        axios.get("http://localhost:5000/api/admin/contact-messages", { withCredentials: true })
            .then(res => setContactMessages(res.data))
            .catch(err => console.error("Failed to fetch contact messages", err));

        axios.get("http://localhost:5000/api/admin/latest-activity", { withCredentials: true })
            .then(res => setActivity(res.data))
            .catch(err => console.error("Failed to fetch activity", err));
    }, [navigate]);

    const handleQuestionAction = (action) => {
        if (action === "add") {
            navigate("/admin/questions/add");
        } else if (action === "edit" || action === "delete") {
            navigate("/admin/questions");
        }
        setShowQuestionAction(false);
    };

    const handleReplySubmit = async (id) => {
        try {
            await axios.post(
                `http://localhost:5000/api/admin/contact-messages/${id}/reply`,
                { reply: selectedReply[id] },
                { withCredentials: true }
            );
            alert("Reply sent!");
            setSelectedReply((prev) => ({ ...prev, [id]: "" }));
            const res = await axios.get("http://localhost:5000/api/admin/contact-messages", { withCredentials: true });
            setContactMessages(res.data);
        } catch (err) {
            console.error("Reply failed", err);
        }
    };

    return (
        <div className="dashboard-container">
            <aside className="sidebar">
                <h2>InterviewPrep</h2>
                <ul>
                    <li onClick={() => setActiveTab('dashboard')}>
                        <FaTachometerAlt style={{ marginRight: "8px" }} /> Dashboard
                    </li>
                    <li onClick={() => navigate("/admin/users")}>
                        <FaUsers style={{ marginRight: "8px" }} /> Users
                    </li>

                    <li onClick={() => setShowQuestionAction(true)}>
                        <FaQuestionCircle style={{ marginRight: "8px" }} /> Questions
                    </li>
                    <li onClick={() => navigate('/admin/roadmaps')}>
                        <FaRoute style={{ marginRight: "8px" }} /> Roadmaps
                    </li>
                    <li onClick={() => navigate('/admin/messages')}>
                        <FaEnvelope style={{ marginRight: "8px" }} /> Contact Messages
                    </li>
                    <li className="logout" onClick={() => {
                        axios.post("http://localhost:5000/api/admin/logout", {}, { withCredentials: true })
                            .then(() => navigate("/admin/login"))
                            .catch(err => console.error("Logout failed", err));
                    }}>
                        <FaSignOutAlt style={{ marginRight: "8px" }} /> Logout
                    </li>
                </ul>
            </aside>

            <main className="main-content">
                <header className="dashboard-header">
                    <span>Hello, Admin</span>
                </header>

                <section className="stats-container">
                    <div className="stat-card blue">
                        <h4>Total Users</h4>
                        <span>{stats.totalUsers ?? '--'}</span>
                    </div>
                    <div className="stat-card yellow">
                        <h4>Quizzes Attempted</h4>
                        <span>{stats.totalQuizzes ?? '--'}</span>
                    </div>
                    <div className="stat-card navy">
                        <h4>Roadmaps Created</h4>
                        <span>{stats.totalRoadmaps ?? '--'}</span>
                    </div>
                    <div className="stat-card navy">
                        <h4>Mock Interviews</h4>
                        <span>{stats.totalMockInterviews ?? '--'}</span>
                    </div>
                </section>

                <section className="activity-section">
                    <h3>📅 Today's Activity</h3>
                    <div className="activity-tables">

                        {/* Users Table */}
                        <div className="activity-table">
                            <h4>New Users</h4>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Email</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {activity.latestUsers.length === 0 ? (
                                        <tr>
                                            <td colSpan="2">No users signed up today</td>
                                        </tr>
                                    ) : (
                                        activity.latestUsers.map(user => (
                                            <tr key={user._id}>
                                                <td>{user.name}</td>
                                                <td>{user.email}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Quizzes Table
                        <div className="activity-table">
                            <h4>New Quizzes</h4>
                            <table>
                                <thead>
                                    <tr>
                                        <th>User</th>
                                        <th>Score</th>
                                        <th>Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {activity.latestQuizzes.length === 0 ? (
                                        <tr><td colSpan="3">No quizzes attempted today</td></tr>
                                    ) : (
                                        activity.latestQuizzes.map((quiz, index) => (
                                            <tr key={index}>
                                                <td>{quiz.user?.name || quiz.user?.email || 'Unknown'}</td>
                                                <td>{quiz.score}</td>
                                                <td>{new Date(quiz.createdAt).toLocaleDateString()}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>


                            </table>

                        </div> */}

                        {/* Messages Table */}
                        <div className="activity-table">
                            <h4>New Messages</h4>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Message</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {activity.latestContactMessages.map(msg => (
                                        <tr key={msg._id}>
                                            <td>{msg.name}</td>
                                            <td>{msg.message.slice(0, 50)}...</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Roadmaps Table */}
                        <div className="activity-table">
                            <h4>New Roadmaps</h4>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Title</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {activity.latestRoadmaps.length === 0 ? (
                                        <tr>
                                            <td>No Roadmaps Added today</td>
                                        </tr>
                                    ) : (
                                        activity.latestRoadmaps.map(r => (
                                            <tr key={r._id}>
                                                <td>{r.title}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                    </div>
                </section>



                {showQuestionAction && (
                    <div className="question-action-prompt">
                        <h4>What do you want to do with Questions?</h4>
                        <button onClick={() => handleQuestionAction("add")}>Add Question</button>
                        <button onClick={() => handleQuestionAction("edit")}>Edit Question</button>
                        <button onClick={() => handleQuestionAction("delete")}>Delete Question</button>
                        <button onClick={() => setShowQuestionAction(false)}>Cancel</button>
                    </div>
                )}
            </main>
        </div>
    );
};

export default AdminDashboard;
