const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const upload = require('../middlewares/upload'); // 👈 Đặt ở đây mới đúng



// Public routes
router.get('/hello', userController.getHello);
router.get('/', userController.getAllUsers);

// Protected routes
router.get('/profile', authMiddleware, userController.getProfile);

// CRUD user (admin or self)
router.post('/', upload.single('avatar'), userController.createUser);

router.put('/:id', upload.single('avatar'), userController.updateUser);

router.delete('/', userController.deleteUser);

router.get('/:id', authMiddleware, userController.getUserById);

module.exports = router;
