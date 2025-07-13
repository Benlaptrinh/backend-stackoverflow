const authService = require('../services/authService');

exports.register = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        await authService.register({ username, email, password });
        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        next(err);
    }
};

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const { accessToken, refreshToken } = await authService.login({ email, password });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.json({ accessToken });
    } catch (err) {
        next(err);
    }
};

exports.refreshAccessToken = async (req, res, next) => {
    const token = req.cookies.refreshToken;
    if (!token) return res.status(401).json({ message: 'No refresh token provided' });

    try {
        const newAccessToken = await authService.refreshToken(token);
        res.json({ accessToken: newAccessToken });
    } catch (err) {
        next(err);
    }
};
