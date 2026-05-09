const express = require('express');
const morgan = require('morgan');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
require('dotenv').config();

const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');

const app = express();

// 1. Kết nối MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('✅ Đã kết nối MongoDB thành công!'))
    .catch(err => console.error('❌ Lỗi kết nối MongoDB:', err));

// 2. Cấu hình View Engine (Dựa trên cấu trúc file app.js nằm trong src)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); 
app.use(express.static(path.join(__dirname, 'public')));

// 3. Middlewares cơ bản
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 4. Cấu hình Session (BẢN ĐƠN GIẢN - GIỐNG SLIDE)
app.use(session({
    secret: process.env.SESSION_SECRET || 'tin_secret_key_2026', 
    resave: false,
    saveUninitialized: true, // Để true để session được tạo tự động
    cookie: { 
        maxAge: 3600000, // 1 giờ
        secure: false    // Dùng cho localhost
    }
}));

// 5. Middleware truyền biến vào View
app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    res.locals.success = req.query.success || null;
    res.locals.error = req.query.error || null;
    next();
});

// 6. Routes
app.use('/', indexRouter);
app.use('/auth', authRouter);

// 7. Xử lý lỗi 404
app.use((req, res) => {
    res.status(404).render('404', { 
        title: '404 - Không tìm thấy trang'
    });
});

module.exports = app;