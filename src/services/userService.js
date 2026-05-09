const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Logic Đăng ký: Băm mật khẩu trước khi lưu
const register = async (userData) => {
    const { username, password, fullName } = userData;
    
    // Kiểm tra xem username đã tồn tại chưa
    const existingUser = await User.findOne({ username });
    if (existingUser) {
        throw new Error('Tên đăng nhập đã tồn tại!');
    }

    // Tạo user mới (Mật khẩu sẽ được băm tự động nhờ Middleware trong Model User.js)
    const user = new User({ username, password, fullName });
    return await user.save();
};

// Logic Đăng nhập: So sánh mật khẩu đã băm
const login = async (username, password) => {
    const user = await User.findOne({ username });
    if (!user) {
        throw new Error('Tài khoản không tồn tại!');
    }

    // So sánh mật khẩu nhập vào với mật khẩu đã băm trong DB
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error('Mật khẩu không chính xác!');
    }

    return user;
};

module.exports = { register, login };