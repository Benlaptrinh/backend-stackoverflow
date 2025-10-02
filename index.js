require('dotenv').config();

const express = require('express');
const http = require('http');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const redis = require('./utils/redis');
const passport = require('./config/passport');
const errorHandler = require('./middlewares/errorHandler');
const { generalLimiter } = require('./middlewares/rateLimiters');

const userRoutes = require('./routes/user');
const authRoutes = require('./routes/auth');
const questionRoutes = require('./routes/question');
const answerRoutes = require('./routes/answer');
const commentRoutes = require('./routes/comment');
const tagRoutes = require('./routes/tag');
const folderRoutes = require('./routes/folder');
const notificationRoutes = require('./routes/notification');
const reportRoutes = require('./routes/report');
const leaderboardRoutes = require('./routes/leaderboard');

const app = express();
const server = http.createServer(app);

// ====== Middlewares ======
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(passport.initialize());

app.use(
    cors({
        origin: process.env.FRONTEND_URL || '*',
        credentials: true,
    })
);

// Rate limit tổng (nếu bạn export limiter khác, đổi tên ở đây)
if (typeof generalLimiter === 'function') {
    app.use(generalLimiter);
}

// ====== Health endpoints ======
app.get('/health', (req, res) => res.status(200).json({ ok: true }));

app.get('/ready', async (req, res) => {
    const mongoOK = mongoose.connection.readyState === 1; // 1 = connected
    let redisOK = false;
    try {
        redisOK = (await redis.ping()) === 'PONG';
    } catch (err) {
        console.error('Redis readiness ping failed:', err);
        redisOK = false;
    }
    const ok = mongoOK && redisOK;
    res.status(ok ? 200 : 503).json({ mongo: mongoOK, redis: redisOK });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/answers', answerRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/tags', tagRoutes);
app.use('/api/folders', folderRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/leaderboard', leaderboardRoutes);

// ====== Socket.IO ======
const { Server } = require('socket.io');
const io = new Server(server, {
    cors: { origin: process.env.FRONTEND_URL || '*', credentials: true },
});
app.set('io', io);

try {
    const initSockets = require('./sockets');
    if (typeof initSockets === 'function') initSockets(io);
} catch (err) {
    console.error('Socket initialization failed:', err);
}

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

(async () => {
    await connectDB();
    server.listen(PORT, () => console.log(`API listening on :${PORT}`));
})();


process.on('SIGTERM', async () => {
    try {
        await mongoose.connection.close();
    } catch (err) {
        console.error('Error closing MongoDB connection on shutdown:', err);
    }
    try {
        if (typeof redis.quit === 'function') {
            await redis.quit();
        }
    } catch (err) {
        console.error('Error closing Redis connection on shutdown:', err);
    }
    server.close(() => process.exit(0));
});
