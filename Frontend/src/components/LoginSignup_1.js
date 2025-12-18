

// import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import "../styles/LoginSignup.css";
import { signup, login } from '../api/auth'; // using this `login`

export default function LoginSignup() {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });

    const [message, setMessage] = useState('');
    const [showPopup, setShowPopup] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // ✅ Reusing login() API method
    const handleLogin = async () => {
        try {
            const data = await login(formData); // using imported login()

            if (data.token) {
                const userName = data.user.name;
                localStorage.setItem("token", data.token);
                localStorage.setItem("userId", data.user._id);
                localStorage.setItem("userName", userName); // ✅ store name
                setMessage(`Login Successful! Welcome back, ${userName}!`);
                navigate("/dashboard");
            } else {
                console.error("Token not received!");
                setMessage("Login failed. Please try again.");
            }
        } catch (error) {
            console.error("Login Error:", error.response?.data?.message || error.message);
            setMessage("Login failed. Please check your credentials.");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isLogin) {
                await handleLogin(); // ✅ simplified
            } else {
                const response = await signup(formData);
                setMessage("Signup Successful! You can now log in.");
                console.log("Signup Response:", response);
            }

            setShowPopup(true);
            setTimeout(() => setShowPopup(false), 3000);
        } catch (error) {
            console.error("Error:", error.message);
            setMessage("Something went wrong. Please try again.");
            setShowPopup(true);
            setTimeout(() => setShowPopup(false), 3000);
        }
    };

    return (
        <div className='container'>
            <div className='form-container'>
                <div className='form-toggle'>
                    <button className={isLogin ? 'active' : ''} onClick={() => setIsLogin(true)}>Login</button>
                    <button className={!isLogin ? 'active' : ''} onClick={() => setIsLogin(false)}>Sign Up</button>
                </div>

                <form className='form' onSubmit={handleSubmit}>
                    <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>

                    {!isLogin && (
                        <input type='text' name='name' placeholder='Full Name' value={formData.name} onChange={handleChange} required />
                    )}

                    <input type='email' name='email' placeholder='Email' value={formData.email} onChange={handleChange} required />
                    <input type='password' name='password' placeholder='Password' value={formData.password} onChange={handleChange} required />

                    <button type='submit'>{isLogin ? 'Login' : 'Sign Up'}</button>

                    {isLogin ? (
                        <p>Don't have an account? <button type="button" onClick={() => setIsLogin(false)}>Sign Up</button></p>
                    ) : (
                        <p>Already have an account? <button type="button" onClick={() => setIsLogin(true)}>Login</button></p>
                    )}
                    <p className="forgot-password">
                        <a href="/user/forgot-password">Forgot Password?</a>
                    </p>

                </form>
            </div>

            {showPopup && (
                <div className="popup">
                    <p>{message}</p>
                </div>
            )}
        </div>
    );
}



