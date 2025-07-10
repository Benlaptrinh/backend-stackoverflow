const e = require('express');
const User = require('../models/User');

exports.getUserById = async (id) => {
    return await User.findById(id).select('-password');
};

exports.getAllUsers = async () => {
    return await User.find().select('-password');
};

exports.createUser = async (userData) => {
    const user = new User(userData);
    return await user.save();
};

exports.updateUser = async (id, userData) => {
    return await User.findByIdAndUpdate(id, userData, { new: true }).select('-password');
};

exports.deleteUser = async (id) => {
    return await User.findByIdAndDelete(id);
};



exports.getProfile = async (id) => {
    return await User.findById(id).select('-password');
};
