const express = require('express');
const router = express.Router();
const folderController = require('../controllers/folderController');
const auth = require('../middlewares/authMiddleware');

// Tạo folder
router.post('/', auth, folderController.createFolder);

// Lấy tất cả folder của user
router.get('/', auth, folderController.getFolders);

// Tìm folder theo tên
router.get('/find/:name', auth, folderController.findFolderByName);

// Thêm câu hỏi vào folder
router.post('/:folderId/add/:questionId', auth, folderController.addQuestion);

// Gỡ câu hỏi khỏi folder
router.delete('/:folderId/remove/:questionId', auth, folderController.removeQuestion);

// Xoá folder
router.delete('/:folderId', auth, folderController.deleteFolder);

module.exports = router;
