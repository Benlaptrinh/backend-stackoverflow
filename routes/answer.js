const express = require('express');
const router = express.Router();
const answerController = require('../controllers/answerController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/', authMiddleware, answerController.createAnswer);
router.get('/:questionId', answerController.getAnswersByQuestion);
router.delete('/:id', authMiddleware, answerController.deleteAnswer);
router.post('/:id/like', authMiddleware, answerController.toggleLike);
router.get('/:id/likes', answerController.getLikeHistory);

module.exports = router;
