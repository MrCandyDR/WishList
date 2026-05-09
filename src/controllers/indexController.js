const wishService = require('../services/wishService');

/**
 * 1. Hiển thị trang chủ (Tích hợp Tìm kiếm, Lọc & PHÂN TRANG)
 */
const getHomePage = async (req, res) => {
    try {
        // Đảm bảo lấy đúng ID (thử cả _id và id)
        const userId = req.session.user._id || req.session.user.id;
        
        // Lấy keyword, category và page từ Query String
        const { search, category, page } = req.query;
        const pageNum = parseInt(page) || 1;
        const limit = 6; // Số lượng hiển thị tối đa 6 cái mỗi trang

        // Gọi service lấy dữ liệu có phân trang
        const result = await wishService.getAllWishes(userId, { search, category }, pageNum, limit);

        // Phân loại status từ danh sách wishes của trang hiện tại
        const pendingWishes = result.wishes.filter(w => w.status !== 'done');
        const completedWishes = result.wishes.filter(w => w.status === 'done');

        res.render('index', { 
            title: 'Trang chủ - Wishlist App',
            username: req.session.user.fullName || req.session.user.username || 'Người dùng',
            user: req.session.user, 
            pendingWishes, 
            completedWishes,
            totalPages: result.totalPages,
            currentPage: result.currentPage,
            search: search || '',
            category: category || ''
        });
    } catch (error) {
        console.error("LỖI RENDER TRANG CHỦ:", error);
        res.status(500).send(`
            <div style="text-align: center; padding: 50px; font-family: sans-serif; line-height: 1.6;">
                <h2 style="color: #e11d48;">Hệ thống có lỗi xảy ra</h2>
                <p style="color: #4b5563;">Chi tiết: ${error.message}</p>
                <a href="/" style="display: inline-block; margin-top: 20px; padding: 10px 20px; background: #2563eb; color: white; text-decoration: none; rounded: 8px;">Thử tải lại trang</a>
            </div>
        `);
    }
};

/**
 * 2. Xử lý Thêm mới
 */
const createWish = async (req, res) => {
    try {
        const userId = req.session.user._id || req.session.user.id;
        await wishService.createWish(req.body, userId);
        res.redirect('/?success=' + encodeURIComponent('Đã thêm mong muốn mới!'));
    } catch (error) {
        res.redirect('/?error=' + encodeURIComponent(error.message));
    }
};

/**
 * 3. Xóa Wish
 */
const deleteWish = async (req, res) => {
    try {
        const userId = req.session.user._id || req.session.user.id;
        await wishService.deleteWish(req.params.id, userId);
        res.redirect('/?success=' + encodeURIComponent('Đã xóa thành công'));
    } catch (error) {
        res.redirect('/?error=' + encodeURIComponent("Lỗi khi xóa dữ liệu"));
    }
};

/**
 * 4. Đổi trạng thái Hoàn thành (Toggle)
 */
const toggleStatus = async (req, res) => {
    try {
        const userId = req.session.user._id || req.session.user.id;
        await wishService.toggleStatus(req.params.id, userId);
        res.redirect('/');
    } catch (error) {
        res.redirect('/?error=' + encodeURIComponent("Lỗi khi cập nhật trạng thái"));
    }
};

/**
 * 5. Cập nhật nội dung mong muốn
 */
const updateWish = async (req, res) => {
    try {
        const userId = req.session.user._id || req.session.user.id;
        const { id } = req.params;
        await wishService.updateWish(id, userId, req.body);
        res.redirect('/?success=' + encodeURIComponent('Đã cập nhật mong muốn!'));
    } catch (error) {
        res.redirect('/?error=' + encodeURIComponent("Lỗi khi cập nhật dữ liệu"));
    }
};

/**
 * 6. Đổi trạng thái Công khai/Riêng tư
 */
const togglePrivacy = async (req, res) => {
    try {
        const userId = req.session.user._id || req.session.user.id;
        const { id } = req.params;
        await wishService.togglePrivacy(id, userId);
        res.redirect('/?success=' + encodeURIComponent('Đã cập nhật quyền riêng tư'));
    } catch (error) {
        res.redirect('/?error=' + encodeURIComponent("Lỗi khi thay đổi quyền riêng tư"));
    }
};

module.exports = {
    getHomePage,
    createWish,
    deleteWish,
    toggleStatus,
    updateWish,
    togglePrivacy
};