import React from "react";
import "../styles/Testimonials.css";
// import LandingNavbar from "../components/LandingPagenavbar"; // Navbar import

const testimonials = [
    {
        name: "Amit Sharma",
        feedback: "This platform helped me land my dream job! The mock interviews and structured roadmaps were a game changer.",
        image: "/images/testinomail.jpeg",
        rating: 5
    },
    {
        name: "Priya Mehta",
        feedback: "I loved the quizzes and coding challenges! They kept me engaged and improved my confidence.",
        image: "/images/testinomial_ladies.jpeg",
        rating: 4
    },
    {
        name: "Rohan Deshmukh",
        feedback: "The progress tracking and roadmap customization made my preparation much more effective. Highly recommended!",
        image: "/images/testinomail.jpeg",
        rating: 4
    },
    {
        name: "Disha Prakash",
        feedback: "The progress tracking and roadmap customization made my preparation much more effective. Highly recommended!",
        image: "/images/testinomial_ladies.jpeg",
        rating: 5
    }
];

// Function to render star ratings
const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    return (
        <div className="stars">
            {Array(fullStars).fill("⭐").map((star, index) => (
                <span key={index}>{star}</span>
            ))}
            {hasHalfStar && <span>⭐️✨</span>} {/* Half star */}
        </div>
    );
};

const Testimonials = () => {
    return (
        <>
            {/* <LandingNavbar /> */}
            <div className="testimonials-container">
                <h1>What Our Users Say</h1>
                <div className="testimonials-grid">
                    {testimonials.map((testimonial, index) => (
                        <div key={index} className="testimonial-card">
                            <img src={testimonial.image} alt={testimonial.name} className="user-image" />
                            <h3>{testimonial.name}</h3>
                            {renderStars(testimonial.rating)}
                            <p>{testimonial.feedback}</p>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default Testimonials;
