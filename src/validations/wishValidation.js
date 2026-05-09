const Joi = require('joi');

// 1. Định nghĩa Schema (Phải đặt tên là createWishSchema cho khớp với file Route)
const createWishSchema = Joi.object({
    title: Joi.string().min(3).max(100).required().messages({
        'string.empty': 'Tên mong muốn không được để trống',
        'string.min': 'mong muốn phải có ít nhất 3 ký tự',
        'any.required': 'Tên mong muốn là bắt buộc'
    }),
    category: Joi.string().required().messages({
        'string.empty': 'Vui lòng chọn danh mục'
    }),
    icon: Joi.string().allow('')
});


// 2. Export đúng cái tên mà file Route đang require
module.exports = { createWishSchema };