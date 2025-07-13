const express = require('express');
const router = express.Router();
const questionController = require('../controllers/questionController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/', questionController.getAllQuestions);
router.post('/', authMiddleware, questionController.createQuestion);

module.exports = router;
