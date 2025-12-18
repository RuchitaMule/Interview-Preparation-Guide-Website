const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const transporter = require('../config/nodemailer');
const User = require('../models/User');
const QuizAttempt = require('../models/QuizAttempt');
const Roadmap = require('../models/Roadmap');
const ContactMessage = require('../models/ContactMessage');
// const MockInterviewProgress = require('../models/MockInterviewAnswer');

const { authenticateAdmin } = require('../middleware/adminMiddleware');

//Admin login route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        //checking if admin exists
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(400).json({ message: "admin not found" });
        }

        //check password matches if email exists 
        const isPasswordMatches = await bcrypt.compare(password, admin.password);
        if (!isPasswordMatches) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ id: admin.id, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '7d' });
        //const token = jwt.sign({ id: admin._id, role: 'admin' }, JWT_SECRET, { expiresIn: '1h' });

        // Send token as HttpOnly Cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: false,  // Set `true` in production (HTTPS)
            sameSite: 'Strict', // Adjust this if needed
            maxAge: 24 * 60 * 60 * 1000, // 1 day expiry
        });
        return res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        return res.status(500).json({ message: 'Server Error', error });
    };
});


//logout route
router.post('/logout', (req, res) => {
    res.clearCookie("token", { httpOnly: true, sameSite: "None", secure: false });
    return res.json({ success: true, message: "Logged out successfully" });
});


//forgot password route
router.post("/forgot-password", async (req, res) => {
    const { email } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(404).json({ message: "Admin not found" });
    //token generation 
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    const tokenExpiry = Date.now() + 15 * 60 * 1000;
    //save token to DB
    admin.resetPasswordToken = hashedToken;
    admin.resetPasswordExpires = tokenExpiry;
    await admin.save();

    // Reset link email
    const resetURL = `http://localhost:3000/admin/reset-password?token=${resetToken}`;
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: admin.email,
        subject: "Admin Password Reset",
        text: `Click this link to reset your password: ${resetURL}`,

    };
    await transporter.sendMail(mailOptions);

    res.json({ message: "Reset link sent to email!" });
});

//reset password route
router.post("/reset-password", async (req, res) => {
    const { token, newPassword } = req.body;

    if (!newPassword) {
        return res.status(400).json({ message: "New password is required!" });
    }

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const admin = await Admin.findOne({ resetPasswordToken: hashedToken, resetPasswordExpires: { $gt: Date.now() } });
    if (!admin) return res.status(400).json({ message: "Invalid or expired token!" });

    // hash password
    const salt = await bcrypt.genSalt(10);
    admin.password = await bcrypt.hash(newPassword, salt);
    console.log("Salt:", salt); // Debugging step
    console.log("New Password:", newPassword); // Debugging step
    // remove token
    admin.resetPasswordToken = undefined;
    admin.resetPasswordExpires = undefined;

    await admin.save();

    res.json({ message: "Password reset successfully!" });
});

// Protected Route Example
// router.get('/protected-route', authenticate, (req, res) => {
//     res.send('You are authenticated and can access this route!');
// });


router.get("/dashboard", authenticateAdmin, (req, res) => {
    console.log("Cookies received in /dashboard:", req.cookies);  // 🛠 Debugging
    if (!req.cookies.token) {
        return res.status(401).json({ message: "Unauthorized: Please login" });
    }
    res.json({ message: "Welcome Admin!", adminId: req.adminId });
});

// ✅ GET all users
router.get('/users', authenticateAdmin, async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch users', error });
    }
});

// ✅ BLOCK/UNBLOCK a user
router.patch('/user/:id/block', authenticateAdmin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        user.isBlocked = !user.isBlocked;
        await user.save();

        res.json({ message: `User ${user.isBlocked ? 'blocked' : 'unblocked'} successfully.` });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update user status', error });
    }
});

// ✅ DELETE a user
router.delete('/user/:id', authenticateAdmin, async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) return res.status(404).json({ message: "User not found" });

        res.json({ message: "User deleted successfully." });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete user', error });
    }
});

router.get('/stats', authenticateAdmin, async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalQuizzes = await QuizAttempt.countDocuments();  // use your actual quiz progress model name
        const totalRoadmaps = await Roadmap.countDocuments();
        // const totalMockInterviews = await MockInterviewProgress.countDocuments(); // if you have this

        res.json({
            totalUsers,
            totalQuizzes,
            totalRoadmaps,
            totalMockInterviews: 0
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

router.get('/contact-messages', authenticateAdmin, async (req, res) => {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    res.json(messages);
});




router.post('/contact-messages/:id/reply', authenticateAdmin, async (req, res) => {
    const { reply } = req.body;

    try {
        const message = await ContactMessage.findByIdAndUpdate(
            req.params.id,
            { reply },
            { new: true }
        );

        if (!message) {
            return res.status(404).json({ message: "Message not found" });
        }

        // Send reply to user's email
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: message.email,
            subject: "Reply from InterviewPrep Admin",
            text: `Hello ${message.name},\n\n${reply}\n\nThank you for reaching out!`,
        };

        await transporter.sendMail(mailOptions);

        res.json({ message: "Reply sent and emailed", data: message });

    } catch (error) {
        console.error("Error replying to contact message:", error);
        res.status(500).json({ message: "Server error", error });
    }
});






router.get('/latest-activity', authenticateAdmin, async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const [latestUsers, latestQuizzes, latestContactMessages, latestRoadmaps] = await Promise.all([
            User.find({ createdAt: { $gte: today } }).sort({ createdAt: -1 }).limit(5).select('name email createdAt'),
            QuizAttempt.find({ createdAt: { $gte: today } })
                .sort({ createdAt: -1 })
                .limit(5)
                .populate('userId', 'name email')
                .select('score createdAt'),
            ContactMessage.find({ createdAt: { $gte: today } }).sort({ createdAt: -1 }).limit(5).select('name email message createdAt'),
            Roadmap.find({ createdAt: { $gte: today } }).sort({ createdAt: -1 }).limit(5).select('title createdAt')
        ]);

        res.json({
            latestUsers,
            latestQuizzes,
            latestContactMessages,
            latestRoadmaps
        });

    } catch (error) {
        console.error("🔥 Error in /latest-activity route:", error);
        res.status(500).json({ message: 'Failed to fetch latest activity', error });
    }
});

module.exports = router;


