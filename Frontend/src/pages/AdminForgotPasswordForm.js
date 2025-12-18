import React, { useState } from "react";
import axios from "axios";

const AdminForgotPasswordForm = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:5000/api/admin/forgot-password", { email });
            setMessage(response.data.message); // Success message
        } catch (error) {
            setMessage(error.response?.data?.message || "Error sending reset email");
        }
    };

    return (
        <div className="forgot-password-form">
            <h2>Forgot Password</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Send Reset Link</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default AdminForgotPasswordForm;
