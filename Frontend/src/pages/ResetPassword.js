// src/pages/ResetPassword.js
import React, { useState } from 'react';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';
import '../styles/AuthStyles.css';
const ResetPassword = () => {
    const [params] = useSearchParams();
    const token = params.get("token");

    const [newPassword, setNewPassword] = useState('');
    const [msg, setMsg] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMsg('');
        setError('');
        try {
            const res = await axios.post('http://localhost:5000/api/auth/reset-password', {
                token,
                newPassword,
            });
            setMsg(res.data.message);
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong!');
        }
    };

    return (
        <div className="auth-container">
            <h2>Reset Password</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="password"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                />
                <button type="submit">Reset Password</button>
            </form>
            {msg && <p className="success-msg">{msg}</p>}
            {error && <p className="error-msg">{error}</p>}
        </div>
    );
};

export default ResetPassword;
