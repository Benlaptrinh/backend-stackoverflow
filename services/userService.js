

const User = require('../models/User');
const bcrypt = require('bcrypt');
const cloudinary = require('../utils/cloudinary');
const fs = require('fs');

exports.getUserById = async (id) => {
    return User.findById(id).select('-password');
};

exports.getAllUsers = async () => {
    return User.find().select('-password');
};

exports.createUser = async ({ username, email, password, role, avatar }) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
        username,
        email,
        password: hashedPassword,
        role: role || 'user',
        avatar: avatar || null
    });
    return await user.save();
};

exports.updateUser = async (id, userData) => {
    return User.findByIdAndUpdate(id, userData, { new: true }).select('-password');
};

exports.deleteUser = async (id) => {
    return User.findByIdAndDelete(id);
};
