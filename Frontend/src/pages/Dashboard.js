
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Dashboard.css';

const Dashboard = () => {
    const [followedRoadmaps, setFollowedRoadmaps] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchFollowedRoadmaps();
    }, []);

    const fetchFollowedRoadmaps = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/roadmap/followed', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            setFollowedRoadmaps(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching followed roadmaps:', error);
            setLoading(false);
        }
    };

    const handleStepToggle = async (roadmapId, subStepText, checked) => {
        try {
            await axios.patch('http://localhost:5000/api/roadmap/progress/update', {
                roadmapId,
                subStepText,
                checked
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            fetchFollowedRoadmaps();
        } catch (error) {
            console.error('Error updating step status:', error);
        }
    };

    const handleUnfollowRoadmap = async (roadmapId) => {
        try {
            const response = await axios.delete(`http://localhost:5000/api/roadmap/unfollow/${roadmapId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            if (response.status === 200) {
                alert('Roadmap unfollowed successfully');
                setFollowedRoadmaps(followedRoadmaps.filter(r => r.roadmapId !== roadmapId));
                window.dispatchEvent(new Event("roadmapUpdated"));
            }
        } catch (error) {
            console.error('Error unfollowing roadmap:', error);
            alert('Failed to unfollow the roadmap');
        }
    };

    const getTotalSteps = () => {
        return followedRoadmaps.reduce((total, roadmap) => {
            roadmap.steps.forEach(step => total += step.subSteps.length);
            return total;
        }, 0);
    };

    const getTotalCompletedSteps = () => {
        return followedRoadmaps.reduce((total, roadmap) => {
            roadmap.steps.forEach(step => {
                step.subSteps.forEach(sub => {
                    if (sub.completed) total++;
                });
            });
            return total;
        }, 0);
    };

    if (loading) return <div className="dashboard-container">Loading your followed roadmaps...</div>;

    return (
        <div className="dashboard-container">
            <h1 className="dashboard-heading">🚀 Welcome back!</h1>
            <p className="dashboard-subtext">"Keep learning. Keep growing." 💪</p>

            <div className="dashboard-stats-with-image">
                <div className="dashboard-stats">
                    <div className="stat-card">
                        <h2>{followedRoadmaps.length}</h2>
                        <p>Roadmaps Followed</p>
                    </div>
                    <div className="stat-card">
                        <h2>{getTotalCompletedSteps()} / {getTotalSteps()}</h2>
                        <p>Steps Completed</p>
                    </div>
                </div>
                <div className="dashboard-illustration">
                    <img src="/images/rd.jpeg" alt="Learning Illustration" />
                </div>
                {/* <div className="dashboard-illustration">
                    <img src="/images/rd1.jpeg" alt="Learning Illustration" />
                </div> */}
            </div>

            <div className="section">
                <h2 className="section-heading">📌 Continue Learning</h2>
                {followedRoadmaps.map((roadmap) => {
                    const incomplete = roadmap.steps.some(step =>
                        step.subSteps.some(sub => !sub.completed)
                    );
                    if (incomplete) {
                        return (
                            <div key={roadmap.roadmapId} className="continue-card">
                                <h3>{roadmap.title}</h3>
                                <p>You're making great progress! Keep going 💯</p>
                            </div>
                        );
                    }
                    return null;
                }).slice(0, 1)}
            </div>

            <div className="section">
                <h2 className="section-heading">🗂️ Your Followed Roadmaps</h2>
                {followedRoadmaps.length === 0 ? (
                    <p>You haven't followed any roadmaps yet.</p>
                ) : (
                    followedRoadmaps.map((roadmapData) => (
                        <div key={roadmapData.roadmapId} className="roadmap-card">
                            <h3>{roadmapData.title}</h3>
                            {roadmapData.steps.map((step, index) => (
                                <div key={index} className="roadmap-step">
                                    <h4>{step.step}</h4>
                                    <ul className="substep-list">
                                        {step.subSteps.map((subStep, subIndex) => (
                                            <li key={subIndex} className="substep">
                                                <input
                                                    type="checkbox"
                                                    checked={subStep.completed}
                                                    onChange={(e) =>
                                                        handleStepToggle(
                                                            roadmapData.roadmapId,
                                                            subStep.text,
                                                            e.target.checked
                                                        )
                                                    }
                                                />
                                                <label
                                                    style={{
                                                        textDecoration: subStep.completed ? "line-through" : "none"
                                                    }}
                                                >
                                                    {subStep.text}
                                                </label>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                            <button className="unfollow-btn" onClick={() => handleUnfollowRoadmap(roadmapData.roadmapId)}>
                                Unfollow
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Dashboard;
