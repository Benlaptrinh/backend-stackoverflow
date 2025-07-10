
const userService = require('../services/userService');
const bcrypt = require('bcrypt');
const User = require('../models/User');

// Test route
exports.getHello = (req, res) => {
    res.json({ message: 'Hello from user controller!' });
};



// Lấy profile user đã xác thực (token)
exports.getProfile = async (req, res, next) => {
    try {
        if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
        res.json(req.user);
    } catch (err) {
        next(err);
    }
};


exports.getUserById = async (req, res, next) => {
    try {
        const userId = req.params.id;

        if (req.user.role !== 'admin' && req.user._id.toString() !== userId) {
            return res.status(403).json({ message: 'Permission denied' });
        }

        const user = await userService.getUserById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        res.json(user);
    } catch (err) {
        next(err);
    }
};


// Lấy tất cả user
exports.getAllUsers = async (req, res, next) => {
    try {
        const users = await userService.getAllUsers();
        res.json(users);
    } catch (err) {
        next(err);
    }
};



// Tạo user mới
exports.createUser = async (req, res, next) => {
    try {
        const { username, email, password, role } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: 'Missing required fields' });
        }


        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            username,
            email,
            password: hashedPassword,
            role: role || 'user',
            avatar: req.file?.path || null
        });

        await user.save();
        res.status(201).json(user);
    } catch (err) {
        next(err);
    }
};



// Cập nhật user
exports.updateUser = async (req, res, next) => {
    try {
        const updated = await userService.updateUser(req.params.id, req.body);
        if (!updated) return res.status(404).json({ message: 'User not found' });
        res.json(updated);
    } catch (err) {
        next(err);
    }
};


// Xóa user
exports.deleteUser = async (req, res, next) => {
    try {
        const { userId } = req.body;
        if (!userId) return res.status(400).json({ message: 'userId is required' });
        // if (req.user.role !== 'admin' && req.user._id.toString() !== userId) {
        //     return res.status(403).json({ message: 'Permission denied' });
        // }
        const deleted = await userService.deleteUser(userId);
        if (!deleted) return res.status(404).json({ message: 'User not found' });
        res.json({ message: 'User deleted successfully' });
    } catch (err) {
        next(err);
    }
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
