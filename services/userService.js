const User = require('../models/User');
const bcrypt = require('bcrypt');

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

exports.toggleFollow = async (currentUserId, targetUserId) => {
    if (currentUserId.toString() === targetUserId.toString()) {
        throw new Error('CANNOT_FOLLOW_SELF');
    }

    const currentUser = await User.findById(currentUserId);
    const targetUser = await User.findById(targetUserId);
    if (!targetUser) throw new Error('USER_NOT_FOUND');

    const isFollowing = currentUser.following.includes(targetUserId);

    if (isFollowing) {
        // Bỏ follow
        currentUser.following.pull(targetUserId);
        targetUser.followers.pull(currentUserId);
    } else {
        // Follow
        currentUser.following.push(targetUserId);
        targetUser.followers.push(currentUserId);
    }

    await currentUser.save();
    await targetUser.save();

    return { followed: !isFollowing };
};

exports.getPublicProfile = async (userId) => {
    const user = await User.findById(userId)
        .select('username avatar reputation followers following createdAt');

    if (!user) throw new Error('USER_NOT_FOUND');

    return {
        _id: user._id,
        username: user.username,
        avatar: user.avatar,
        reputation: user.reputation,
        followersCount: user.followers.length,
        followingCount: user.following.length,
        createdAt: user.createdAt
    };
};