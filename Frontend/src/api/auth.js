import axios from 'axios';


const API_URL = "http://localhost:5000/api/auth"; // Ensure '/api/auth' is included
const ADMIN_API_URL = "http://localhost:5000/api/admin";// admin url for routes 
// Signup Function
export const signup = async (userData) => {
    try {
        const response = await axios.post(`${API_URL}/signup`, userData);
        return response.data;
    } catch (error) {
        console.error("Signup Error:", error.response?.data || error.message);
        throw error.response?.data || { message: "Something went wrong" };
    }
};

// Login Function
export const login = async (credentials) => {
    try {
        const response = await axios.post(`${API_URL}/login`, credentials);
        return response.data;
    } catch (error) {
        console.error("Login Error:", error.response?.data || error.message);
        throw error.response?.data || { message: "Something went wrong" };
        //throw new Error(error.response?.data?.message || "Something went wrong during login.");
    }
};





export const adminLogin = async (credentials) => {
    try {
        const response = await axios.post(`${ADMIN_API_URL}/login`, credentials, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.error("Admin Login Error:", error.response?.data || error.message);
        throw error.response?.data || { message: "Something went wrong" };
    }
};

export const getAdminDashboard = async () => {
    try {
        const response = await axios.get(`${ADMIN_API_URL}/dashboard`, { withCredentials: true });
        console.log("Admin Dashboard Response:", response.data);
        return response.data;
    } catch (error) {
        console.error("Admin Dashboard Error:", error.response?.data || error.message);
        document.cookie.split(";").forEach(c => console.log("Browser Cookie:", c));
        throw error.response?.data || { message: "Unauthorized Access" };
    }
};


