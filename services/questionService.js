const Question = require('../models/Question');
const Answer = require('../models/Answer');
const answerService = require('./answerService');
const User = require('../models/User');

exports.createQuestion = async ({ title, content, tags, author }) => {
    const question = await Question.create({ title, content, tags, author });
    await User.findByIdAndUpdate(author, { $inc: { reputation: 5 } }); // hoặc số điểm bạn muốn
    return question;
};
exports.getAllQuestions = async () => {
    return await Question.find()
        .populate('author', 'username avatar reputation')
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
exports.toggleUpvote = async (questionId, userId) => {
    const question = await Question.findById(questionId);
    if (!question) throw new Error('Question not found');

    const index = question.upvotes.indexOf(userId);

    if (index === -1) {
        question.upvotes.push(userId); // Chưa like → thêm
    } else {
        question.upvotes.splice(index, 1); // Đã like → bỏ
    }

    await question.save();

    return {
        upvoted: index === -1,
        count: question.upvotes.length,
    };
};
exports.updateQuestion = async (id, data, userId) => {
    const question = await Question.findById(id);
    if (!question) throw new Error('NOT_FOUND');

    if (question.author.toString() !== userId.toString()) {
        throw new Error('FORBIDDEN');
    }

    return await Question.findByIdAndUpdate(id, data, { new: true });
};
exports.deleteQuestion = async (id, user) => {
    const question = await Question.findById(id);
    if (!question) throw new Error('NOT_FOUND');

    const isOwner = question.author.toString() === user._id.toString();
    const isAdmin = user.role === 'admin';
    if (!isOwner && !isAdmin) throw new Error('FORBIDDEN');

    // 🧨 Xoá toàn bộ answer trong question đó (và cả comment nhờ service)
    const answers = await Answer.find({ question: id });
    for (const answer of answers) {
        await answerService.deleteAnswerById(answer._id);
    }

    // ✅ Xoá câu hỏi
    await question.deleteOne();
    return { deleted: true };
};
exports.searchQuestions = async ({ q, sortBy }) => {
    const filter = {};

    if (q) {
        filter.title = { $regex: q, $options: 'i' }; // tìm không phân biệt hoa thường
    }

    let sortOption = { createdAt: -1 }; // mặc định: mới nhất
    if (sortBy === 'views') sortOption = { views: -1 };
    if (sortBy === 'votes') sortOption = { upvotesCount: -1 };

    // Trick để sort theo độ dài mảng upvotes
    const questions = await Question.aggregate([
        { $match: filter },
        {
            $addFields: {
                upvotesCount: { $size: '$upvotes' }
            }
        },
        { $sort: sortOption },
        { $limit: 50 } // giới hạn số lượng trả về
    ]);

    return questions;
};
