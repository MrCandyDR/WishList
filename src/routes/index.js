const express = require('express');
const router = express.Router();

// Import Controllers
const indexController = require('../controllers/indexController');
const exploreController = require('../controllers/exploreController');

// Import Middlewares
const { isAuth } = require('../middlewares/authMiddleware');
const validate = require('../middlewares/validateMiddleware');

// Import Schemas
const { createWishSchema } = require('../validations/wishValidation');

/**
 * QUẢN LÝ ROUTE CHO WISHLIST
 */

// 1. TRANG CHỦ & TRANG KHÁM PHÁ
// [GET] Trang chủ - Danh sách cá nhân
router.get('/', isAuth, indexController.getHomePage);

// [GET] Trang khám phá - Danh sách cộng đồng
router.get('/explore', isAuth, exploreController.getExplorePage);


// 2. CÁC THAO TÁC (CRUD)
// [POST] Thêm mong muốn - Cần đăng nhập + Validate dữ liệu Joi
router.post('/add-wish', 
    isAuth, 
    validate(createWishSchema), 
    indexController.createWish
);

// [POST] Cập nhật nội dung (Dùng cho nút Sửa)
router.post('/update-wish/:id', 
    isAuth, 
    indexController.updateWish
);

// [POST] Đổi trạng thái (Hoàn thành / Làm lại)
router.post('/toggle-status/:id', 
    isAuth, 
    indexController.toggleStatus
);

// [GET] Đổi quyền riêng tư (Công khai / Riêng tư)
// Đã sửa thành .get để khớp với thẻ <a> trong index.ejs, tránh lỗi 404
router.get('/toggle-privacy/:id', 
    isAuth, 
    indexController.togglePrivacy
);

// [POST] Xóa mong muốn
router.post('/delete-wish/:id', 
    isAuth, 
    indexController.deleteWish
);

module.exports = router;