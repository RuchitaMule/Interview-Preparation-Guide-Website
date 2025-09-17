import React from "react";
import "../styles/AboutUs.css";
import { useNavigate } from "react-router-dom";
// import LandingNavbar from "../components/LandingPagenavbar";

const AboutUs = () => {
    const navigate = useNavigate();
    return (
        <>
            {/* <LandingNavbar /> */}
            <div className="about-us-container">
                {/* Hero Section */}
                <section className="hero-section">
                    <h1>About Us</h1>
                    <p>Empowering aspiring developers to ace technical interviews with confidence.</p>
                </section>

                {/* Mission & Vision Section */}
                <section className="mission-vision">
                    <div className="card">
                        <h2>Our Mission</h2>
                        <p>To provide a structured and interactive learning experience for interview preparation.</p>
                    </div>
                    <div className="card">
                        <h2>Our Vision</h2>
                        <p>Helping students and professionals land their dream jobs by mastering coding interviews.</p>
                    </div>
                </section>

                {/* Why Choose Us - Grid-based Cards */}
                <section className="why-choose-us-container">
                    <h2>Why Choose Us?</h2>
                    <div className="features-grid">
                        <div className="feature-card">
                            <span>🚀</span>
                            <p>Personalized Learning Roadmaps</p>
                        </div>
                        <div className="feature-card">
                            <span>💡</span>
                            <p>Hands-on Practice with Real Interview Questions</p>
                        </div>
                        <div className="feature-card">
                            <span>📊</span>
                            <p>Detailed Progress Tracking & Insights</p>
                        </div>
                    </div>
                    <div className="features-grid second-row">
                        <div className="feature-card">
                            <span>🎤</span>
                            <p>Mock Interviews for Real-World Experience</p>
                        </div>
                    </div>
                </section>

                {/* Call-to-Action Section */}
                <section className="cta-section">
                    <h2>Ready to Ace Your Interview?</h2>
                    <button className="cta-button" onClick={() => navigate("/login")}>Get Started</button>
                </section>
            </div>
        </>
    );
};

export default AboutUs;
