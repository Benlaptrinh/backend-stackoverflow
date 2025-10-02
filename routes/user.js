/**
 * @swagger
 * tags:
 *   name: User
 *   description: User management routes
 */

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const upload = require('../middlewares/upload'); // 👈 Đặt ở đây mới đúng
const { validateBody } = require('../middlewares/validationMiddleware');
const { userLimiter } = require('../middlewares/rateLimiters');

router.get('/hello', userController.getHello);

router.get('/', userLimiter, userController.getAllUsers);

router.get('/profile', authMiddleware, userController.getProfile);

router.post('/', validateBody(['username', 'email', 'password']), upload.single('avatar'), userController.createUser);

router.put('/:id', upload.single('avatar'), userController.updateUser);

router.delete('/', validateBody(['userId']), userController.deleteUser);

router.get('/:id', authMiddleware, userController.getUserById);

router.post('/:id/follow', authMiddleware, userController.toggleFollow);

router.get('/:id/profile', userController.getPublicProfile);

router.post('/logout', authMiddleware, userController.logout);

module.exports = router;
