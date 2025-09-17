

import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/AdminUsers.css";
import { FaTrash, FaBan, FaCheckCircle } from "react-icons/fa";

const AdminUsers = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/admin/users", {
                withCredentials: true
            });
            if (!res.data || res.data.length === 0) return;
            setUsers(res.data);
        } catch (err) {
            console.error("Error fetching users", err);
        }
    };

    const toggleBlockUser = async (userId, isBlocked) => {
        try {
            await axios.patch(`http://localhost:5000/api/admin/user/${userId}/block`, {}, {
                withCredentials: true
            });
            setUsers(users.map(user =>
                user._id === userId ? { ...user, isBlocked: !isBlocked } : user
            ));
        } catch (err) {
            console.error("Error blocking/unblocking user", err);
        }
    };

    const deleteUser = async (userId) => {
        if (!window.confirm("Are you sure you want to delete this user?")) return;
        try {
            await axios.delete(`http://localhost:5000/api/admin/user/${userId}`, {
                withCredentials: true
            });
            setUsers(users.filter(user => user._id !== userId));
        } catch (err) {
            console.error("Error deleting user", err);
        }
    };

    return (
        <div className="admin-users-container">
            <h2 className="admin-users-heading">All Registered Users</h2>
            {users.length > 0 ? (
                <table className="admin-users-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user._id}>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td className={user.isBlocked ? "blocked" : "active"}>
                                    {user.isBlocked ? "Blocked" : "Active"}
                                </td>
                                <td className="actions">
                                    <button
                                        className={user.isBlocked ? "btn unblock" : "btn block"}
                                        onClick={() => toggleBlockUser(user._id, user.isBlocked)}
                                    >
                                        {user.isBlocked ? (
                                            <>
                                                <FaCheckCircle /> Unblock
                                            </>
                                        ) : (
                                            <>
                                                <FaBan /> Block
                                            </>
                                        )}
                                    </button>
                                    <button className="btn delete" onClick={() => deleteUser(user._id)}>
                                        <FaTrash /> Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p className="no-users-text">No users found</p>
            )}
        </div>
    );
};

export default AdminUsers;
