// routes/contactRoutes.js
const express = require('express');
const router = express.Router();
const ContactMessage = require('../models/ContactMessage');

router.post("/submit", async (req, res) => {
    try {
        const { name, email, message } = req.body;
        const newMessage = new ContactMessage({ name, email, message });
        await newMessage.save();
        res.status(200).json({ message: "Message received!" });
    } catch (error) {
        res.status(500).json({ message: "Error saving message", error });
    }
});

module.exports = router;
