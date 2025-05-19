const mongoose = require("mongoose")

const connectDB = async () => {
    try {
        await mongoose.connect("mongodb://srv1:27017/2025_327738811_node")//process.env.DATABASE_URI
    } catch (err) {
        console.error("MongoDB connection error: ", err)
    }
}

module.exports = connectDB