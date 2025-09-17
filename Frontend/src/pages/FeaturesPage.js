import React from "react";
import "../styles/FeaturesPage.css";
// import LandingNavbar from "../components/LandingPagenavbar"; // Import Navbar

const FeaturesPage = () => {
    const features = [
        {
            title: "Personalized Roadmaps",
            description: "Get customized learning paths based on your goals and skills.",
            icon: "📌",
        },
        {
            title: "Topic-wise Practice Problems",
            description: "Practice coding problems categorized by difficulty and topic.",
            icon: "💡",
        },
        {
            title: "Mock Interviews",
            description: "Experience real-time coding interviews to test your skills.",
            icon: "🎤",
        },
        {
            title: "Progress Tracking",
            description: "Monitor your preparation journey with detailed analytics.",
            icon: "📊",
        },
        {
            title: "Quizzes & Assessments",
            description: "Take quizzes to test your understanding and improve weak areas.",
            icon: "✅",
        },
    ];

    return (
        <>
            {/* <LandingNavbar /> */}
            <div className="features-container">
                <h1>Key Features</h1>
                <div className="features-grid">
                    {features.map((feature, index) => (
                        <div key={index} className="feature-card">
                            <span className="feature-icon">{feature.icon}</span>
                            <h2>{feature.title}</h2>
                            <p>{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default FeaturesPage;
