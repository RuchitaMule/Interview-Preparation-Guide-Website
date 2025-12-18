const jwt = require('jsonwebtoken');
require('dotenv').config();
const User = require('../models/User');
const JWT_SECRET = process.env.JWT_SECRET;

const authenticateUser = async (req, res, next) => {

    let token = req.cookies.token;

    console.log("Cookies:", req.cookies);  //Debug: Check if cookies are present
    console.log("Authorization Header:", req.headers.authorization);  // Debug: Check if Authorization header is sent

    // If no token in cookies, check Authorization header
    if (!token && req.headers.authorization) {
        const authHeader = req.headers.authorization.split(" ");
        if (authHeader[0] === "Bearer") {
            token = authHeader[1]; // Assign token from Authorization header
        }
    }

    console.log("Extracted Token:", token);  //  Debug: Check the final token value


    if (!token) {
        console.log("No token found, sending 401 Unauthorized");
        return res.status(401).json({ message: 'Unauthorized: Please log in' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        console.log(" Token Verified Successfully:decoded token", decoded); //  Debug: Check decoded token
        // req.user = decoded;  // Attach user info to request object

        // ✅ Fetch full user from DB
        const user = await User.findById(decoded.userId).select("-password");

        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        req.user = user; // ✅ Attach full user object to request
        next();
    } catch (error) {
        console.log("Invalid or Expired Token:", error.message); // Debug: Check token error
        return res.status(403).json({ message: 'Invalid or expired token' });
    }
};

module.exports = { authenticateUser };
