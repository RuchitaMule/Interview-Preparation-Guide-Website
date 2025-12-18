


import React from "react";
import "../styles/LandingPage.css";


const LandingPage = () => {
    return (
        <div className="landing-page">
            <section className="hero">
                <div className="hero-text">
                    <h1>Prepare Smarter, Succeed Faster!</h1>
                    <p>Get a structured approach to ace your interviews with expert-curated content and real-time practice.</p>
                    <button className="cta-button">Get Started</button>
                </div>
                <div className="hero-image">
                    <img src="/images/landing_interview.jpg" alt="Interview Preparation" />
                </div>
            </section>
        </div>
    );
};

export default LandingPage;
