const Question = require('../models/Question');

exports.createQuestion = async ({ title, content, tags, author }) => {
    return await Question.create({
        title,
        content,
        tags,
        author,
    });
};

exports.getAllQuestions = async () => {
    return await Question.find()
        .populate('author', 'username avatar')
        .sort({ createdAt: -1 });
};

exports.getQuestionById = async (id) => {
    return await Question.findById(id)
        .populate('author', 'username avatar')
        .populate('tags');
};

exports.incrementAnswersCount = async (questionId) => {
    return await Question.findByIdAndUpdate(
        questionId,
        { $inc: { answersCount: 1 } },
        { new: true }
    );
};

exports.incrementViews = async (questionId) => {
    return await Question.findByIdAndUpdate(
        questionId,
        { $inc: { views: 1 } },
        { new: true }
    );
};
