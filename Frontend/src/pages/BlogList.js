import React from "react";
import { Link } from "react-router-dom";
import "../styles/Blog.css";
// import LandingNavbar from "../components/LandingPagenavbar"; // Import Navbar


const blogData = [
    {
        id: 1,
        title: "Top 10 Tips to Crack Technical Interviews",
        description: "Learn essential strategies to prepare for technical interviews and ace them confidently.",
        image: "/images/technical_confident_blog_1.jpg",
    },
    {
        id: 2,
        title: "Best Coding Platforms to Practice DSA",
        description: "Explore the top online platforms to sharpen your coding and problem-solving skills.",
        image: "/images/DSA.jpeg",
    },
    {
        id: 3,
        title: "Behavioral Interview Questions and How to Answer",
        description: "Master common behavioral interview questions with expert tips and sample answers.",
        image: "/images/Behaavioural_image.jpeg",
    },
];

const BlogList = () => {
    return (
        <>
            {/* <LandingNavbar /> */}
            <div className="blog-container">
                <h2>Latest Blog Posts</h2>
                <div className="blog-list">
                    {blogData.map((blog) => (
                        <div key={blog.id} className="blog-card">
                            <img src={blog.image} alt={blog.title} />
                            <div className="blog-content">
                                <h3>{blog.title}</h3>

                                <p>{blog.description}</p>
                                <Link to={`/blog/${blog.id}`} className="read-more">Read More</Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default BlogList;
