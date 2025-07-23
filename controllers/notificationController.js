const notificationService = require('../services/notificationService');
const { getUser } = require('../sockets');

// exports.create = async (req, res, next) => {
//     try {
//         const newNotification = await notificationService.createNotification({
//             senderId: req.body.senderId,
//             senderName: req.body.senderName, // 👈 dùng từ body
//             receiverId: req.body.receiverId,
//             type: req.body.type,
//             postId: req.body.postId,
//             commentId: req.body.commentId,
//             link: req.body.link,
//             description: req.body.description,
//         });
//         res.status(201).json(newNotification);
//     } catch (err) {
//         next(err);
//     }
// };
exports.create = async (req, res, next) => {
    try {
        const newNotification = await notificationService.createNotification({
            senderId: req.body.senderId,
            senderName: req.body.senderName,
            receiverId: req.body.receiverId,
            type: req.body.type,
            postId: req.body.postId,
            commentId: req.body.commentId,
            link: req.body.link,
            description: req.body.description,
        });

        // ---- Thêm đoạn này ngay sau khi tạo notification ----
        const io = req.app.get('io');
        const { getUser } = require('../sockets'); // chỉnh đúng path

        if (io && getUser) {
            const receiver = getUser(req.body.receiverId);
            if (receiver) {
                io.to(receiver.socketId).emit('getNotification', newNotification);
            }
        }
        // -----------------------------------------------------

        res.status(201).json(newNotification);
    } catch (err) {
        next(err);
    }
};



exports.getByUser = async (req, res, next) => {
    try {
        const notis = await notificationService.getNotificationsForUser(req.params.userId);
        res.json(notis);
    } catch (err) {
        next(err);
    }
};

exports.getAll = async (req, res, next) => {
    try {
        const notifications = await notificationService.getAllNotifications();
        res.json(notifications);
    } catch (err) {
        next(err);
    }
};

exports.markAsRead = async (req, res, next) => {
    try {
        const updated = await notificationService.markAsRead(req.params.notificationId);
        res.json(updated);
    } catch (err) {
        next(err);
    }
};

exports.delete = async (req, res, next) => {
    try {
        await notificationService.deleteNotification(req.params.notificationId);
        res.json({ message: "Notification deleted." });
    } catch (err) {
        next(err);
    }
};