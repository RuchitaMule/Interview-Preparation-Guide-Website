const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    try {
        // Creating connection URI with credentials
        const uri = `mongodb+srv://${encodeURIComponent(process.env.DB_USERNAME)}:${encodeURIComponent(process.env.DB_PASSWORD)}@${process.env.DB_CLUSTER}/${process.env.DB_NAME}?retryWrites=true&w=majority`;

        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log('Connected to MongoDB Atlas successfully using Mongoose!');
    } catch (error) {
        console.error('Database connection failed:', error.message);
        process.exit(1);
    }
};

module.exports = connectDB;
