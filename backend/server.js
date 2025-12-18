const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const quizRoutes = require("./routes/quiz");
const authRoutes = require('./routes/auth');
const aptiRoutes = require('./routes/aptitudeRoutes');
const adminRoutes = require('./routes/adminRoutes');
// const userRoutes = require('./routes/userRoutes');
const interviewRoutes = require('./routes/interviewRoutes');
const roadmapRoutes = require('./routes/roadmapRoutes')
const contactRoutes = require('./routes/contactRoutes');

const adminQuestionRoutes = require('./routes/adminQuestionRoutes')
const app = express();


// Middleware
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true // Allow cookies to be sent from the frontend
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser()); //to parse cookies;

app.use((req, res, next) => {
    console.log("Cookies received:", JSON.stringify(req.cookies, null, 2));
    next();
});


// Connect to database
connectDB();

//use auth  routes of user 
app.use('/api/auth', authRoutes);

//use all other routes of user 
// app.use('/api/user', userRoutes);
// Test Route
app.get('/', (req, res) => {
    res.send('Backend is working!');
});



app.use('/api/roadmap', roadmapRoutes); // Add this line to handle /api/roadmap route

app.use('/api/contact', contactRoutes);
app.use("/api/quiz", quizRoutes);

//use aptitude module routes
app.use("/api/aptitude", aptiRoutes);

// const interviewRoutes = require('./routes/interviewRoutes');
app.use('/api/interview', interviewRoutes);

//use admin routes
app.use('/api/admin', adminRoutes);


app.use('/api/admin', adminQuestionRoutes);

const adminRoadmapRoutes = require('./routes/adminRoadmapRoutes');

app.use('/api/admin', adminRoadmapRoutes);



// Listen on port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
