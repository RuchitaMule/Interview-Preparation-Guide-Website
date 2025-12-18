import React, { useState } from "react";
import "../styles/FAQs.css";
// import LandingNavbar from "../components/LandingPagenavbar"; // Navbar import
const faqsData = [
    { question: "What is Interview Prep?", answer: "Interview Prep is a platform that helps students prepare for technical interviews with structured roadmaps, mock interviews, and coding practice." },
    { question: "Is this platform free?", answer: "Yes! We offer free resources." },
    { question: "How can I track my progress?", answer: "You can track your progress in the dashboard, which shows completed topics, quizzes, and mock interview scores." },
    { question: "Can I practice mock interviews?", answer: "Yes, we provide mock interviews with real-world questions to simulate a real interview environment." },
];

const FAQs = () => {
    const [activeIndex, setActiveIndex] = useState(null);

    const toggleFAQ = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <>
            {/* <LandingNavbar /> */}
            <div className="faqs-container">
                <h2>Frequently Asked Questions</h2>
                <div className="faqs-list">
                    {faqsData.map((faq, index) => (
                        <div key={index} className="faq-item">
                            <div className="faq-question" onClick={() => toggleFAQ(index)}>
                                {faq.question}
                                <span>{activeIndex === index ? "▲" : "▼"}</span>
                            </div>
                            {activeIndex === index && <div className="faq-answer">{faq.answer}</div>}
                        </div>
                    ))}
                </div>
            </div>
        </>

    );
};

export default FAQs;
