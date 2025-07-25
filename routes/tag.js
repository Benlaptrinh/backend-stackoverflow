// routes/tag.js
const express = require('express');
const router = express.Router();
const tagController = require('../controllers/tagController');
const auth = require('../middlewares/authMiddleware'); // nếu muốn bảo vệ tạo/xoá/sửa

// Public
router.get('/', tagController.getAllTags);
router.get('/:id/questions', tagController.getQuestionsByTag);

// Có thể yêu cầu đăng nhập (tuỳ bạn dùng authMiddleware hay không)
router.post('/', auth, tagController.createTag);
router.put('/:id', auth, tagController.updateTag);
router.delete('/:id', auth, tagController.deleteTag);
router.get('/popular', tagController.getPopularTags);

module.exports = router;
