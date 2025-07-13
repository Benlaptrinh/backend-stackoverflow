
const Comment = require('../models/Comment');

/**
 * Create a new comment
 */
exports.createComment = async ({ content, answer, author, parentComment }) => {
    return Comment.create({ content, answer, author, parentComment });
};

/**
 * Get all comments for a specific answer
 */
exports.getCommentsByAnswer = async (answerId) => {
    return Comment.find({ answer: answerId })
        .populate('author', 'username avatar')
        .sort({ createdAt: 1 });
};

/**
 * Delete a comment by its ID
 */
exports.deleteComment = async (id) => {
    return Comment.findByIdAndDelete(id);
};

/**
 * Recursively delete a comment and its child comments
 */
exports.deleteCommentRecursively = async (commentId) => {
    const childComments = await Comment.find({ parentComment: commentId });
    for (const child of childComments) {
        await exports.deleteCommentRecursively(child._id);
    }
    await Comment.findByIdAndDelete(commentId);
};

/**
 * Delete all comments for a specific answer
 */
exports.deleteCommentsByAnswer = async (answerId) => {
    const comments = await Comment.find({ answer: answerId });
    for (const comment of comments) {
        await exports.deleteCommentRecursively(comment._id);
    }
};

/**
 * Decrease the comment count for an answer if the comment is a root comment
 */
exports.decreaseAnswerCommentCountIfRoot = async (comment) => {
    if (!comment.parentComment) {
        const Answer = require('../models/Answer');
        await Answer.findByIdAndUpdate(comment.answer, { $inc: { commentsCount: -1 } });
    }
};
