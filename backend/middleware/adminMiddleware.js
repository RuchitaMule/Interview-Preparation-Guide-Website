const jwt = require('jsonwebtoken');
require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET;

const authenticateAdmin = (req, res, next) => {
    console.log("Cookies received:", req.cookies); // Debugging step
    const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];
    console.log("Received Token in Middleware:", token);

    if (!token) {
        console.error("No token found in request!");
        return res.status(401).json({ message: 'Unauthorized: Please log in' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        console.log("Decoded Token:", decoded); // Debugging step ✅

        // Check role directly from token (No DB call needed)
        if (decoded.role !== 'admin') {
            return res.status(403).json({ message: 'Access Denied: Not an Admin' });
        }

        req.adminId = decoded.id; // Store admin ID for further use
        next();
    } catch (error) {
        return res.status(403).json({ message: 'Invalid or expired token' });
    }
};

module.exports = { authenticateAdmin };
