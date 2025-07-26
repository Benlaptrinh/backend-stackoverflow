const leaderboardService = require('../services/leaderboardService');

exports.getLeaderboard = async (req, res, next) => {
    try {
        const result = {
            topQuestionsByUpvotes: await leaderboardService.getTopQuestionsByUpvotes(),
            topQuestionsByAnswers: await leaderboardService.getTopQuestionsByAnswers(),
            topUsersByQuestions: await leaderboardService.getTopUsersByQuestions(),
            topUsersByFollowers: await leaderboardService.getTopUsersByFollowers(),
            topAnswersByLikes: await leaderboardService.getTopAnswersByLikes()
        };
        res.json(result);
    } catch (err) {
        next(err);
    }
};