const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');


router.get('/hello', userController.getHello);
router.get('/', userController.getAllUsers);


router.get('/profile', authMiddleware, userController.getProfile);


router.post('/', userController.createUser);
router.put('/:id', userController.updateUser);
router.delete('/', userController.deleteUser);

router.get('/:id', userController.getUserById);

module.exports = router;
