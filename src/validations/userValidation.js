const Joi = require('joi');

const registerSchema = Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required().messages({
        'string.min': 'Tên đăng nhập phải từ 3 ký tự trở lên',
        'any.required': 'Tên đăng nhập là bắt buộc'
    }),
    password: Joi.string().min(6).required().messages({
        'string.min': 'Mật khẩu phải từ 6 ký tự trở lên'
    }),
    fullName: Joi.string().required().messages({
        'any.required': 'Họ tên là bắt buộc'
    })
});

const loginSchema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required()
});

module.exports = { registerSchema, loginSchema };