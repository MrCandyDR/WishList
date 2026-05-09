
// 1. Chỉ cho phép người dùng ĐÃ ĐĂNG NHẬP đi qua
const isAuth = (req, res, next) => {
    if (req.session && req.session.user) {
        // Gán thông tin user vào res.locals để tất cả file EJS đều có thể truy cập mà không cần truyền biến
        res.locals.user = req.session.user;
        return next();
    } else {
        if (req.xhr || (req.headers.accept && req.headers.accept.indexOf('json') > -1)) {
            return res.status(401).json({ message: 'Phiên đăng nhập đã hết hạn' });
        }
        
        // Nếu là yêu cầu trang web thông thường
        const errorMsg = encodeURIComponent('Vui lòng đăng nhập để tiếp tục!');
        return res.redirect(`/auth/login?error=${errorMsg}`);
    }
};

// 2. Chỉ cho phép người chưa đăng nhập (Khách) đi qua
// Dùng cho trang Login, Register để tránh bị vòng lặp Redirect
const isGuest = (req, res, next) => {
    if (!req.session || !req.session.user) {
        return next();
    }
    // Nếu đã đăng nhập mà cố vào trang login thì đá về trang chủ
    return res.redirect('/');
};

module.exports = { 
    isAuth, 
    isGuest 
};