import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock } from "lucide-react";
import "../styles/AdminLogin.css";
import axios from "axios";

const AdminLogin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();


    const handleLogin = async (e) => {
        e.preventDefault();
        console.log("Admin Login Attempt:", { email, password });

        try {
            const res = await axios.post("http://localhost:5000/api/admin/login", {
                email,
                password
            }, {
                withCredentials: true  // very important for cookies
            });

            console.log("Login successful", res.data);
            navigate("/admin/dashboard"); // react dashboard page
        } catch (error) {
            console.error("Login failed", error.response?.data || error.message);
            alert("Invalid credentials");
        }
    };



    return (
        <div className="admin-login-container">
            <div className="admin-login-card">
                {/* Left Side - Image */}
                <div className="admin-login-image">
                    <img src="/images/admin_login_1.png" alt="Admin Login" />

                </div>

                {/* Right Side - Login Form */}
                <div className="admin-login-form">
                    <h2>Login as an Admin</h2>
                    <form onSubmit={handleLogin}>
                        <div className="input-group">
                            <Mail className="input-icon" size={18} />
                            <input
                                type="email"
                                placeholder="Enter email "
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="input-group">
                            <Lock className="input-icon" size={18} />
                            <input
                                type="password"
                                placeholder="********"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <button type="submit" className="admin-login-btn">Login</button>
                    </form>

                    <p className="forgot-password">
                        <a href="/admin/forgot-password">Forgot your password?</a>
                        {/* <Link to="/admin/forgot-password">Forgot Password?</Link> */}
                    </p>
                    <p className="help-link">
                        Get help <a href="#">Signed in</a>.
                    </p>

                    <p className="terms">
                        <a href="#">Terms of use</a> • <a href="#">Privacy policy</a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
