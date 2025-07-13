const questionService = require('../services/questionService');

exports.createQuestion = async (req, res, next) => {
    try {
        const { title, content, tags } = req.body;
        const question = await questionService.createQuestion({
            title,
            content,
            tags,
            author: req.user._id,
        });

        res.status(201).json(question);
    } catch (err) {
        next(err);
    }
};

exports.getAllQuestions = async (req, res, next) => {
    try {
        const questions = await questionService.getAllQuestions();
        res.json(questions);
    } catch (err) {
        next(err);
    }
};
