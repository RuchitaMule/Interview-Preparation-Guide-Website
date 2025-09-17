

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/AdminRoadmaps.css"; // Create this for custom styles

const AdminRoadmaps = () => {
    const [roadmaps, setRoadmaps] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchRoadmaps();
    }, []);

    const fetchRoadmaps = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/admin/roadmaps");
            setRoadmaps(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this roadmap?")) {
            try {
                await axios.delete(`http://localhost:5000/api/admin/roadmap/${id}`);
                fetchRoadmaps();
            } catch (err) {
                console.error(err);
            }
        }
    };

    return (
        <div className="admin-roadmaps-container">
            <div className="admin-roadmaps-header">
                <h2>Manage Roadmaps</h2>
                <button className="add-button" onClick={() => navigate("/admin/add-roadmap")}>
                    + Add New Roadmap
                </button>
            </div>

            <table className="roadmap-table">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Role</th>
                        <th>Description</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {roadmaps.map((roadmap) => (
                        <tr key={roadmap._id}>
                            <td>{roadmap.title}</td>
                            <td>{roadmap.role}</td>
                            <td>{roadmap.description}</td>
                            <td>
                                <button
                                    className="edit-button"
                                    onClick={() => navigate(`/admin/roadmaps/edit/${roadmap._id}`)}
                                >
                                    Edit
                                </button>
                                <button
                                    className="delete-button"
                                    onClick={() => handleDelete(roadmap._id)}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminRoadmaps;
