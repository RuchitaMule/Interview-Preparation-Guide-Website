//dependency to install -: npm install react-icons


import React from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/LandingNavbar.css"; // Import CSS
import "../styles/AuthModal.css";


const LandingNavbar = ({ setShowModal }) => {
    const location = useLocation(); // Get current page URL

    return (
        <nav className="navbar">
            <h2 className="logo">Interview Prep</h2>
            <div className="nav-links">

                <Link to="/features" className={location.pathname === "/features" ? "active" : ""}>Features</Link>
                <Link to="/how-it-works" className="nav-item">How It Works?</Link>
                <Link to="/AboutUs" className="nav-link">About Us</Link>
                {/* <Link to="/testimonials" className="nav-link">Testimonials</Link> */}
                <Link to="/blog" className="nav-link">Blog</Link>
                <Link to="/ContactUs" className="nav-link">ContactUs</Link>
                <Link to="/FAQs" className="nav-link">FAQs</Link>
                {/* <Link to="/HRInterview" className="nav-link">HR</Link> */}
                {/* <Link to="/login" className="login-btn">Login</Link> */}
                <button className="login-btn" onClick={() => setShowModal(true)}>Login</button>


            </div>
        </nav>
    );
};

export default LandingNavbar;
