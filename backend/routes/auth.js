require('dotenv').config();
const crypto = require("crypto");
const transporter = require('../config/nodemailer');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { authenticateUser } = require('../middleware/authMiddleware');
const JWT_SECRET = process.env.JWT_SECRET;

// Signup Route (User Registration)
router.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = new User({
            name,
            email,
            password: hashedPassword
        });

        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
});

// Login Route (User Login)
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        // Compare the entered password with the hashed password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        if (user.isBlocked) {
            return res.status(403).json({ message: "Your account has been blocked. Please contact admin." });
        }
        // Generate JWT Token

        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1d' });
        // Send token as HttpOnly Cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: false,
            sameSite: 'Lax'
        });


        return res.status(200).json({
            message: 'Login successful', token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        return res.status(500).json({ message: 'Server Error', error });
    }
});

// Logout Route
router.post('/logout', (req, res) => {
    //res.clearCookie('token');  // Clear the token 
    res.clearCookie('token', {
        httpOnly: true,
        secure: false,
        sameSite: 'None'
    });
    return res.status(200).json({ message: 'Logout successful' });
});


//forgot password route
router.post("/forgot-password", async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });
    //token generation 
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    const tokenExpiry = Date.now() + 15 * 60 * 1000;
    //save token to DB
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = tokenExpiry;
    await user.save();

    // Reset link email
    const resetURL = `http://localhost:3000/user/reset-password?token=${resetToken}`;
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: "User Password Reset",
        text: `Click this link to reset your password: ${resetURL}`,

    };
    await transporter.sendMail(mailOptions);

    res.json({ message: "Reset link sent to email!" });
});

//reset password route
router.post("/reset-password", async (req, res) => {
    console.log("Incoming body:", req.body); //  debug
    const { token, newPassword } = req.body;
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({ resetPasswordToken: hashedToken, resetPasswordExpires: { $gt: Date.now() } });
    if (!user) return res.status(400).json({ message: "Invalid or expired token!" });

    // hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    // remove token
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.json({ message: "Password reset successfully!" });
});



// Protected Route Example
router.get('/protected-route', authenticateUser, (req, res) => {
    res.send('You are authenticated and can access this route!');
});

module.exports = router;
