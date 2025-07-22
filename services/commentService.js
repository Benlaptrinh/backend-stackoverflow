
const Comment = require('../models/Comment');
const User = require('../models/User');

/**
 * Create a new comment
 */

exports.toggleLike = async (commentId, userId) => {
    const comment = await Comment.findById(commentId);
    if (!comment) throw new Error('Comment not found');
    if (comment.author.toString() === userId.toString()) throw new Error('Không thể like bình luận của mình');

    const likeIndex = comment.likes.findIndex(like => like.user.toString() === userId.toString());
    let liked;
    if (likeIndex === -1) {
        comment.likes.push({ user: userId });
        liked = true;
        await User.findByIdAndUpdate(comment.author, { $inc: { reputation: 2 } });
    } else {
        comment.likes.splice(likeIndex, 1);
        liked = false;
        await User.findByIdAndUpdate(comment.author, { $inc: { reputation: -2 } });
    }
    await comment.save();
    return { liked, likeCount: comment.likes.length };
};

exports.getLikeHistory = async (commentId) => {
    const comment = await Comment.findById(commentId).populate('likes.user', 'username avatar');
    if (!comment) throw new Error('Comment not found');
    return comment.likes;
};
exports.createComment = async ({ content, answer, author, parentComment }) => {
    const comment = await Comment.create({ content, answer, author, parentComment });
    await User.findByIdAndUpdate(author, { $inc: { reputation: 2 } }); // hoặc số điểm bạn muốn
    return comment;
};
/**
 * Get all comments for a specific answer
 */
exports.getCommentsByAnswer = async (answerId) => {
    return Comment.find({ answer: answerId })
        .populate('author', 'username avatar reputation')
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
