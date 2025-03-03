const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`Connected to DB: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error connecting to DB: ${error.message}`);
        process.exit(1); // Exit process with failure
    }
};

module.exports = connectDB;
