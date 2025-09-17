// src/pages/ForgotPassword.js
import React, { useState } from 'react';
import axios from 'axios';
import '../styles/AuthStyles.css'; // Optional CSS

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [msg, setMsg] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMsg('');
        setError('');
        try {
            const res = await axios.post('http://localhost:5000/api/auth/forgot-password', { email });
            setMsg(res.data.message);
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong!');
        }
    };

    return (
        <div className="auth-container">
            <h2>Forgot Password</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Enter your registered email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <button type="submit">Send Reset Link</button>
            </form>
            {msg && <p className="success-msg">{msg}</p>}
            {error && <p className="error-msg">{error}</p>}
        </div>
    );
};

export default ForgotPassword;
