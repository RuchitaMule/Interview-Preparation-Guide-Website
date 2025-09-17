import React from "react";
import { useParams, Link } from "react-router-dom";
import "../styles/Blog.css";
// import LandingNavbar from "../components/LandingPagenavbar"; // Import Navbar


const blogData = [
    {
        id: 1,
        title: "Top 10 Tips to Crack Technical Interviews",
        content: "1. Understand Data Structures and Algorithms.\n2. Solve coding challenges daily...\n\n(Read full content here...)",
        image: "https://source.unsplash.com/600x400/?coding,technology",
    },
    {
        id: 2,
        title: "Best Coding Platforms to Practice DSA",
        content: "Platforms like LeetCode, CodeChef, and HackerRank provide excellent practice sets for DSA...",
        image: "https://source.unsplash.com/600x400/?computer,programming",
    },
    {
        id: 3,
        title: "Behavioral Interview Questions and How to Answer",
        content: "1. Tell me about yourself...\n2. Describe a challenging situation...\n\n(Read full content here...)",
        image: "https://source.unsplash.com/600x400/?interview,discussion",
    },
];

const BlogDetail = () => {
    const { id } = useParams();
    const blog = blogData.find((post) => post.id === parseInt(id));

    if (!blog) return <h2>Blog Not Found</h2>;

    return (
        <>
            {/* <LandingNavbar /> */}
            <div className="blog-detail">
                <img src={blog.image} alt={blog.title} />
                <h2>{blog.title}</h2>
                <p>{blog.content}</p>
                <Link to="/blog" className="back-btn">Back to Blogs</Link>
            </div>
        </>
    );
};

export default BlogDetail;
