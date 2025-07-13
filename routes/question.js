const express = require('express');
const router = express.Router();
const questionController = require('../controllers/questionController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/', questionController.getAllQuestions);
router.post('/', authMiddleware, questionController.createQuestion);
router.post('/:questionId/upvote', authMiddleware, questionController.toggleUpvote);
router.put('/:id', authMiddleware, questionController.updateQuestion);
router.delete('/:id', authMiddleware, questionController.deleteQuestion);
router.get('/search', questionController.searchQuestions);


module.exports = router;
