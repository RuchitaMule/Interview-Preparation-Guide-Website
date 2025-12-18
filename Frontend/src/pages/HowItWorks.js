//npm install fa

import React from "react";
import { useNavigate } from "react-router-dom";
import { FaUserPlus, FaMap, FaCode, FaClipboardCheck, FaChartLine } from "react-icons/fa";
import LandingNavbar from "../components/LandingPagenavbar"; // ✅ Added Navbar
import "../styles/HowItWorks.css"; // External CSS

const steps = [
    { icon: <FaUserPlus />, title: "Sign Up & Set Your Goal", description: "Create an account and personalize your learning journey." },
    { icon: <FaMap />, title: "Explore Personalized Roadmaps", description: "Follow structured paths to master interview topics." },
    { icon: <FaCode />, title: "Practice Topic-wise Questions", description: "Solve problems categorized by difficulty and topic." },
    { icon: <FaClipboardCheck />, title: "Take Mock Interviews & Quizzes", description: "Assess your knowledge with real-time coding interviews." },
    { icon: <FaChartLine />, title: "Track Your Progress", description: "Monitor improvements with analytics and insights." }
];

const HowItWorks = () => {
    const navigate = useNavigate();
    return (
        <>
            <LandingNavbar /> {/* ✅ Navbar added */}
            <div className="how-it-works-container">
                <h2 className="title">How It Works?</h2>
                <div className="steps">
                    {steps.map((step, index) => (
                        <div key={index} className="step">
                            <div className="icon">{step.icon}</div>
                            <h3 className="step-title">{step.title}</h3>
                            <p className="step-description">{step.description}</p>
                        </div>
                    ))}
                </div>
                {/* <button className="cta-button">Get Started</button> */}
                <button className="cta-button" onClick={() => navigate("/login")}>Get Started</button>
            </div>
        </>
    );
};

export default HowItWorks;
