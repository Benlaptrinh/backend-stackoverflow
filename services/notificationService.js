const Notification = require('../models/Notification');

exports.createNotification = async (data) => {
    return await Notification.create(data);
};

exports.getNotificationsForUser = async (userId) => {
    return await Notification.find({ receiverId: userId }).sort({ createdAt: -1 });
};

exports.getAllNotifications = async () => {
    return await Notification.find().sort({ createdAt: -1 });
};

exports.markAsRead = async (notificationId) => {
    return await Notification.findByIdAndUpdate(notificationId, { isRead: true }, { new: true });
};

exports.deleteNotification = async (notificationId) => {
    return await Notification.findByIdAndDelete(notificationId);
};

// exports.sendQuestionNotiToFollowers = async (senderUser, question, io, getUserFn) => {
//     const User = require('../models/User');
//     const senderId = senderUser._id;
//     const senderName = senderUser.username;

//     const user = await User.findById(senderId).select('followers');
//     const followers = user.followers || [];

//     for (const followerId of followers) {
//         const payload = {
//             senderId,
//             senderName,
//             receiverId: followerId,
//             type: 'question',
//             postId: question._id,
//             commentId: null,
//             link: `/questions/${question._id}`,
//             description: 'vừa đăng 1 câu hỏi mới'
//         };

//         const receiver = getUserFn(followerId.toString());
//         if (receiver) {
//             io.to(receiver.socketId).emit('getNotification', payload);
//         }

//         await Notification.create(payload);
//     }
// };