const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    fullName: { type: String, required: true }
});

// Sửa đoạn này: Dùng async function và KHÔNG truyền 'next' vào
userSchema.pre('save', async function() {
    // Nếu mật khẩu không bị thay đổi thì không làm gì cả
    if (!this.isModified('password')) return;

    try {
        // Băm mật khẩu bằng bcrypt
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        // Với async function trong Mongoose pre-save, Tín KHÔNG cần gọi next()
        // Mongoose sẽ tự biết khi nào hàm async này kết thúc.
    } catch (err) {
        throw err; // Ném lỗi để userService tóm được
    }
});

module.exports = mongoose.model('User', userSchema);