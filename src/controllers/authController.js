const userService = require('../services/userService');

const getLoginPage = (req, res) => {
    if (req.session.user) return res.redirect('/');
    res.render('login', { title: 'Đăng nhập' });
};

const getRegisterPage = (req, res) => {
    if (req.session.user) return res.redirect('/');
    res.render('register', { title: 'Đăng ký' });
};

const register = async (req, res) => {
    try {
        await userService.register(req.body);
        res.redirect('/auth/login?success=' + encodeURIComponent('Đăng ký thành công! Hãy đăng nhập.'));
    } catch (error) {
        res.redirect(`/auth/register?error=${encodeURIComponent(error.message)}`);
    }
};

const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await userService.login(username, password);
        
        // 1. GÁN DỮ LIỆU VÀO SESSION
        req.session.user = {
            id: user._id,
            username: user.username,
            fullName: user.fullName
        };
        
        // 2. SỬA LỖI TẠI ĐÂY: Ép Session phải lưu thành công rồi mới Redirect
        // Hàm .save() đảm bảo dữ liệu đã nằm chắc chắn trong Store trước khi trang web load lại
        req.session.save((err) => {
            if (err) {
                console.error('Lỗi lưu session:', err);
                return res.redirect('/auth/login?error=' + encodeURIComponent('Lỗi hệ thống khi đăng nhập'));
            }
            // Chỉ redirect sau khi đã save thành công
            res.redirect('/?success=' + encodeURIComponent('Chào mừng quay trở lại!'));
        });

    } catch (error) {
        res.redirect(`/auth/login?error=${encodeURIComponent(error.message)}`);
    }
};

const logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.log('Lỗi khi hủy session:', err);
        }
        res.clearCookie('connect.sid'); 
        res.redirect('/auth/login?success=' + encodeURIComponent('Đã đăng xuất thành công!'));
    });
};

module.exports = { getLoginPage, getRegisterPage, register, login, logout };