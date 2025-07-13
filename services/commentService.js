const Comment = require('../models/Comment');

exports.createComment = async ({ content, answer, author, parentComment }) => {
    return await Comment.create({ content, answer, author, parentComment });
};

exports.getCommentsByAnswer = async (answerId) => {
    return await Comment.find({ answer: answerId })
        .populate('author', 'username avatar')
        .sort({ createdAt: 1 });
};

exports.deleteComment = async (id) => {
    return await Comment.findByIdAndDelete(id);
};
exports.deleteCommentRecursively = async (commentId) => {
    const childComments = await Comment.find({ parentComment: commentId });

    for (const child of childComments) {
        await exports.deleteCommentRecursively(child._id);
    }

    await Comment.findByIdAndDelete(commentId);
};
exports.deleteCommentsByAnswer = async (answerId) => {
    const comments = await Comment.find({ answer: answerId });

    for (const comment of comments) {
        await exports.deleteCommentRecursively(comment._id);
    }
};

exports.decreaseAnswerCommentCountIfRoot = async (comment) => {
    if (!comment.parentComment) {
        const Answer = require('../models/Answer');
        await Answer.findByIdAndUpdate(comment.answer, { $inc: { commentsCount: -1 } });
    }
};
