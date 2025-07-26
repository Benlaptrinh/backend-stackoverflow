const answerService = require('../services/answerService');
const questionService = require('../services/questionService');
const commentService = require('../services/commentService');
const Answer = require('../models/Answer');

exports.createAnswer = async (req, res, next) => {
    try {
        const { content, question } = req.body;
        const answer = await answerService.createAnswer({
            content,
            question,
            author: req.user._id // hoặc tạm user ID nếu test nhanh
        });

        // Tăng answersCount
        await questionService.incrementAnswersCount(question);

        res.status(201).json(answer);
    } catch (err) {
        next(err);
    }
};

exports.getAnswersByQuestion = async (req, res, next) => {
    try {
        const answers = await answerService.getAnswersByQuestion(req.params.questionId);
        res.json(answers);
    } catch (err) {
        next(err);
    }
};

exports.deleteAnswer = async (req, res, next) => {
    try {
        const answer = await answerService.deleteAnswerById(req.params.id);
        if (!answer) return res.status(404).json({ message: 'Answer not found' });

        res.json({ message: 'Answer and related comments deleted' });
    } catch (err) {
        next(err);
    }
};

exports.toggleLike = async (req, res, next) => {
    try {
        const result = await answerService.toggleLike(req.params.id, req.user._id);
        res.json(result);
    } catch (err) {
        next(err);
    }
};

exports.getLikeHistory = async (req, res, next) => {
    try {
        const likes = await answerService.getLikeHistory(req.params.id);
        res.json(likes);
    } catch (err) {
        next(err);
    }
};
