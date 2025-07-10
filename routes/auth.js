// routes/auth.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');


router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/refresh-token', authController.refreshAccessToken);

// Google OAuth
const passport = require('../config/passport');
const jwt = require('jsonwebtoken');

function generateJWT(user) {
    return jwt.sign(
        { id: user._id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );
}

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/redirect',
    passport.authenticate('google', { session: false }),
    (req, res) => {
        const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        // Redirect về frontend + token trong URL
        res.redirect(`${process.env.FRONTEND_URL}/oauth-success?token=${token}`);
    }
);

router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

router.get('/github/callback',
    passport.authenticate('github', { session: false }),
    (req, res) => {
        const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        // Redirect to React FE
        res.redirect(`${process.env.FRONTEND_URL}/oauth-success?token=${token}`);
    });

module.exports = router;
