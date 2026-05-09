const mongoose = require('mongoose');

const wishSchema = new mongoose.Schema({
    title: { type: String, required: true },
    category: { type: String, required: true },
    icon: { type: String },
    status: { type: String, default: 'pending' },
    // Thêm tính năng công khai để hiển thị ở trang Khám phá
    isPublic: { type: Boolean, default: true }, 
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Wish', wishSchema);