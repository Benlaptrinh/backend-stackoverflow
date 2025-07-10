const upload = require('../middlewares/upload');
const User = require('../models/User');


// Lấy user theo id, ẩn password
exports.getUserById = async (id) => {
    return User.findById(id).select('-password');
};


// Lấy tất cả user, ẩn password
exports.getAllUsers = async () => {
    return User.find().select('-password');
};


// Tạo user mới
exports.createUser = async (userData) => {
    const user = new User(userData);
    return user.save();
};


// Cập nhật user
exports.updateUser = async (id, userData) => {
    return User.findByIdAndUpdate(id, userData, { new: true }).select('-password');
};


// Xóa user
exports.deleteUser = async (id) => {
    return User.findByIdAndDelete(id);
};



// Lấy profile user (ẩn password)
exports.getProfile = async (id) => {
    return User.findById(id).select('-password');
};

exports.upload_Image = async (req, res) => {
    try {
        // Lưu đường dẫn ảnh vào user.avatar
        req.user.avatar = req.file.path;
        await req.user.save();

        res.json({ avatar: req.file.path });
    } catch (err) {
        res.status(500).json({ message: 'Upload failed', error: err.message });
    }
};