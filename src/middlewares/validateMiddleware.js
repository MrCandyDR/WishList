const validate = (schema) => {
    // Phải đảm bảo trả về một hàm có ĐÚNG 3 tham số (req, res, next)
    return (req, res, next) => {
        const { error } = schema.validate(req.body);
        
        if (error) {
            const errorMessage = error.details[0].message;
            // Nếu có lỗi, redirect và dừng lại luôn
            return res.redirect(`${req.originalUrl}?error=${encodeURIComponent(errorMessage)}`);
        }
        
        // Nếu không lỗi, gọi next() để sang Controller
        next(); 
    };
};

module.exports = validate;