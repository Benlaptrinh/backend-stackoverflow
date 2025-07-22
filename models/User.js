
const mongoose = require('mongoose');

// User model chuẩn hóa cho cả local & social login
const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    reputation: { type: Number, default: 0 },
    avatar: { type: String },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    googleId: { type: String, default: null },
    githubId: { type: String, default: null },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);
