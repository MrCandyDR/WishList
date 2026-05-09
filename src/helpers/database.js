const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // Lấy URI từ file .env
        const uri = process.env.MONGODB_URI;
        
        await mongoose.connect(uri);
        
        console.log('=== MongoDB Connected Successfully ===');
    } catch (error) {
        console.error('MongoDB Connection Failed:', error.message);
        // Thoát ứng dụng nếu không kết nối được DB
        process.exit(1); 
    }
};

module.exports = connectDB;