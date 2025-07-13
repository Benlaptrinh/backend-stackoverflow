const Answer = require('../models/Answer');
const commentService = require('./commentService');

exports.createAnswer = async ({ content, question, author }) => {
    return await Answer.create({ content, question, author });
};

exports.getAnswersByQuestion = async (questionId) => {
    return await Answer.find({ question: questionId })
        .populate('author', 'username avatar')
        .sort({ createdAt: -1 });
};

exports.deleteAnswerById = async (answerId) => {
    const answer = await Answer.findById(answerId);
    if (!answer) return null;

    await commentService.deleteCommentsByAnswer(answerId);
    await Answer.findByIdAndDelete(answerId);

    return answer;
};