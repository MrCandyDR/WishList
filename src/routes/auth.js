const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const validate = require('../middlewares/validateMiddleware');

// Import middleware để kiểm tra trạng thái khách
const { isGuest } = require('../middlewares/authMiddleware');

// Import Schemas
const { registerSchema, loginSchema } = require('../validations/userValidation');

/**
 * QUẢN LÝ ĐIỀU HƯỚNG ĐĂNG NHẬP / ĐĂNG KÝ
 */

// Trang đăng nhập (Render giao diện) - Chặn nếu đã login rồi
router.get('/login', isGuest, authController.getLoginPage);

// Trang đăng ký (Render giao diện) - Chặn nếu đã login rồi
router.get('/register', isGuest, authController.getRegisterPage);


/**
 * XỬ LÝ LOGIC (API)
 */

// Xử lý Đăng ký
router.post('/register', 
    validate(registerSchema), 
    authController.register
);

// Xử lý Đăng nhập
router.post('/login', 
    validate(loginSchema), 
    authController.login
);

// Đăng xuất
router.get('/logout', authController.logout);

module.exports = router;