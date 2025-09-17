import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom"; // for getting the token from the URL

const AdminResetPasswordForm = () => {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [token, setToken] = useState(null);

    // Extract the token from the URL query string
    const { search } = useLocation();
    const queryParams = new URLSearchParams(search);
    const tokenFromUrl = queryParams.get("token");

    useEffect(() => {
        setToken(tokenFromUrl);
    }, [tokenFromUrl]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            setMessage("Passwords do not match!");
            return;
        }

        try {
            const response = await axios.post(
                "http://localhost:5000/api/admin/reset-password",
                { token, newPassword }
            );
            setMessage(response.data.message); // Success message
        } catch (error) {
            setMessage(error.response?.data?.message || "Error resetting password");
        }
    };

    return (
        <div className="reset-password-form">
            <h2>Reset Password</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>New Password</label>
                    <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Confirm Password</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Reset Password</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default AdminResetPasswordForm;
