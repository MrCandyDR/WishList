const Wish = require('../models/Wish');

// 1. Logic lấy dữ liệu cá nhân: Tích hợp Tìm kiếm, Lọc & PHÂN TRANG
const getAllWishes = async (userId, filters = {}, page = 1, limit = 6) => {
    const { search, category } = filters;
    const skip = (page - 1) * limit;
    let query = { userId: userId };

    if (search) {
        query.title = { $regex: search, $options: 'i' };
    }

    if (category && category !== '') {
        query.category = category;
    }

    // Lấy dữ liệu theo trang
    const wishes = await Wish.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    // Đếm tổng số bản ghi để tính số trang
    const totalWishes = await Wish.countDocuments(query);

    return {
        wishes,
        totalPages: Math.ceil(totalWishes / limit),
        currentPage: page
    };
};

// 2. Logic LẤY DỮ LIỆU CỘNG ĐỒNG: Tích hợp PHÂN TRANG
const getPublicWishes = async (currentUserId, page = 1, limit = 9) => {
    const skip = (page - 1) * limit;
    const query = { 
        userId: { $ne: currentUserId }, 
        isPublic: true 
    };

    const wishes = await Wish.find(query)
        .populate('userId', 'fullName')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    const totalWishes = await Wish.countDocuments(query);

    return {
        wishes,
        totalPages: Math.ceil(totalWishes / limit),
        currentPage: page
    };
};

// 3. Logic tạo mới
const createWish = async (data, userId) => {
    const newWish = new Wish({
        title: data.title,
        category: data.category,
        icon: data.icon || '🎁',
        status: 'pending',
        isPublic: true, 
        userId: userId 
    });
    return await newWish.save();
};

// 4. Logic xóa
const deleteWish = async (id, userId) => {
    return await Wish.findOneAndDelete({ _id: id, userId: userId });
};

// 5. Logic đổi trạng thái
const toggleStatus = async (id, userId) => {
    const wish = await Wish.findOne({ _id: id, userId: userId });
    if (wish) {
        wish.status = (wish.status === 'done') ? 'pending' : 'done';
        return await wish.save();
    }
    throw new Error("Không tìm thấy mục cần cập nhật hoặc bạn không có quyền");
};

// 6. Logic cập nhật nội dung
const updateWish = async (id, userId, data) => {
    return await Wish.findOneAndUpdate(
        { _id: id, userId: userId }, 
        { 
            title: data.title, 
            category: data.category 
        },
        { new: true }
    );
};

// 7. Logic đổi chế độ công khai
const togglePrivacy = async (id, userId) => {
    const wish = await Wish.findOne({ _id: id, userId: userId });
    if (wish) {
        wish.isPublic = !wish.isPublic;
        return await wish.save();
    }
    throw new Error("Không tìm thấy mục cần cập nhật");
};

module.exports = {
    getAllWishes,
    getPublicWishes,
    createWish,
    deleteWish,
    toggleStatus,
    updateWish,
    togglePrivacy
};