let onlineUsers = [];

const addNewUser = (userId, socketId) => {
    if (!onlineUsers.some((user) => user.userId === userId)) {
        onlineUsers.push({ userId, socketId });
    }
};

const removeUser = (socketId) => {
    onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
    return onlineUsers.find((user) => user.userId === userId);
};

module.exports = (io) => {
    io.on("connection", (socket) => {
        console.log("✅ Socket connected:", socket.id);

        socket.on("newUser", (userId) => {
            addNewUser(userId, socket.id);
            io.emit("getOnlineUsers", onlineUsers);
        });

        socket.on("sendNotification", ({
            senderId, sender_first_name, sender_last_name, sender_picture,
            receiverId, type, postId, commentId, link, description,
            id, createdAt, groupId
        }) => {
            const receiver = getUser(receiverId);
            if (receiver) {
                io.to(receiver.socketId).emit("getNotification", {
                    senderId, sender_first_name, sender_last_name, sender_picture,
                    type, postId, commentId, link, description,
                    id, createdAt, groupId
                });
            }
        });

        socket.on("sendMessage", ({ senderId, receiverId, roomId }) => {
            const receiver = getUser(receiverId);
            if (receiver) {
                io.to(receiver.socketId).emit("getMessage", {
                    senderId,
                    receiverId,
                    roomId,
                });
            }
        });

        socket.on("disconnect", () => {
            removeUser(socket.id);
            io.emit("getOnlineUsers", onlineUsers);
            console.log("❌ Socket disconnected:", socket.id);
        });
    });
};
module.exports.getUser = getUser; 
