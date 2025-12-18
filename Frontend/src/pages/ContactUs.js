import React, { useState } from "react";
import "../styles/ContactUs.css";
// import LandingNavbar from "../components/LandingPagenavbar"; // Import Navbar

const ContactUs = () => {
    const [formData, setFormData] = useState({ name: "", email: "", message: "" });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await fetch("http://localhost:5000/api/contact/submit", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });
            alert("Message Sent! We'll get back to you soon.");
            setFormData({ name: "", email: "", message: "" });
        } catch (error) {
            alert("Failed to send message.");
            console.error(error);
        }
    };



    return (
        <>
            {/* <LandingNavbar /> */}
            <div className="contact-container">
                <h2>Get in Touch</h2>

                <div className="contact-wrapper">
                    {/* Contact Form */}
                    <form onSubmit={handleSubmit} className="contact-form">
                        <input type="text" name="name" placeholder="Your Name" value={formData.name} onChange={handleChange} required />
                        <input type="email" name="email" placeholder="Your Email" value={formData.email} onChange={handleChange} required />
                        <textarea name="message" placeholder="Your Message" value={formData.message} onChange={handleChange} required></textarea>
                        <button type="submit">Send Message</button>
                    </form>

                    {/* Contact Info */}
                    <div className="contact-info">
                        <h3>Contact Information</h3>
                        <p>📍 Address: 12, Pune, India</p>
                        <p>📧 Email: contact@interviewPrep.com</p>
                        <p>📞 Phone: +91 12345 67890</p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ContactUs;
