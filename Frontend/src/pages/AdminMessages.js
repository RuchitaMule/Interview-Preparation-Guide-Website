// src/pages/AdminMessages.js

import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/AdminMessages.css";

const AdminMessages = () => {
    const [messages, setMessages] = useState([]);
    const [replyContent, setReplyContent] = useState({});

    useEffect(() => {
        axios.get("http://localhost:5000/api/admin/contact-messages", { withCredentials: true })
            .then(res => setMessages(res.data))
            .catch(err => console.error("Failed to load messages", err));
    }, []);

    const handleReply = async (id) => {
        try {
            await axios.post(`http://localhost:5000/api/admin/contact-messages/${id}/reply`, {
                reply: replyContent[id]
            }, { withCredentials: true });

            alert("Reply sent!");

            const updated = await axios.get("http://localhost:5000/api/admin/contact-messages", { withCredentials: true });
            setMessages(updated.data);
            setReplyContent({ ...replyContent, [id]: "" });
        } catch (err) {
            console.error("Reply failed", err);
        }
    };


    return (
        <div className="admin-messages-container">
            <h2>Contact Messages</h2>
            {messages.length === 0 ? (
                <p className="no-messages">No contact messages yet.</p>
            ) : (
                <div className="messages-grid">
                    {messages.map((msg) => (
                        <div className="admin-message-card" key={msg._id}>
                            <p><strong>Name:</strong> {msg.name}</p>
                            <p><strong>Email:</strong> {msg.email}</p>
                            <p><strong>Message:</strong> {msg.message}</p>
                            <p><strong>Reply:</strong> {msg.reply || "Not replied yet"}</p>

                            <textarea
                                className="reply-textarea"
                                placeholder="Type your reply..."
                                value={replyContent[msg._id] || ""}
                                onChange={(e) =>
                                    setReplyContent({ ...replyContent, [msg._id]: e.target.value })
                                }
                            />
                            <button onClick={() => handleReply(msg._id)}>Send Reply</button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}





export default AdminMessages;
