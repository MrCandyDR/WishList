const wishService = require('../services/wishService');

const getExplorePage = async (req, res) => {
    try {
        // 1. Lấy số trang và giới hạn hiển thị
        const page = parseInt(req.query.page) || 1;
        const limit = 9;

        /**
         * 2. Xử lý ID người dùng:
         * Phải lấy đúng ID từ session để truyền vào service.
         * Thử cả ._id (chuẩn MongoDB) và .id để tránh bị rỗng.
         */
        const userId = req.session.user._id || req.session.user.id;

        /**
         * 3. Gọi service lấy danh sách công khai:
         * Đảm bảo service này lọc các wish có { isPublic: true }
         */
        const result = await wishService.getPublicWishes(userId, page, limit);

        // 4. Render dữ liệu ra file explore.ejs
        res.render('explore', { 
            title: 'Khám phá mong muốn - Wishlist App',
            // Ưu tiên hiển thị fullName, nếu không có thì dùng username
            username: req.session.user.fullName || req.session.user.username || 'Người dùng',
            user: req.session.user,           
            wishes: result.wishes || [],      // Danh sách mong muốn từ service
            currentPage: result.currentPage || 1,
            totalPages: result.totalPages || 1
        });
    } catch (error) {
        console.error("Lỗi tại Explore Controller:", error);
        // Tránh bị lỗi URI khi redirect
        res.redirect('/?error=' + encodeURIComponent("Không thể tải trang khám phá"));
    }
};

module.exports = { getExplorePage };