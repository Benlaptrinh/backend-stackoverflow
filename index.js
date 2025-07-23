
// const express = require('express');
// const http = require('http');
// const { Server } = require('socket.io');
// const cors = require('cors');
// const cookieParser = require('cookie-parser');
// const dotenv = require('dotenv');
// const connectDB = require('./config/db');
// const errorHandler = require('./middlewares/errorHandler');
// const passport = require('./config/passport');

// dotenv.config();

// // ==== Khởi tạo app và server ====
// const app = express();
// const server = http.createServer(app);

// // ==== Cấu hình Socket.IO ====
// const io = new Server(server, {
//     cors: {
//         origin: '*',
//         methods: ['GET', 'POST'],
//     },
// });

// // Gán io vào app để các controller có thể dùng req.app.get('io')
// app.set('io', io);

// // ==== Middleware ====
// app.use(cors());
// app.use(express.json());
// app.use(cookieParser());
// app.use(passport.initialize());
// app.use(express.urlencoded({ extended: true }));

// // ==== Kết nối database ====
// connectDB();

// // ==== Định nghĩa các API routes ====
// app.use('/api/auth', require('./routes/auth'));
// app.use('/api/users', require('./routes/user'));
// app.use('/api/questions', require('./routes/question'));
// app.use('/api/answers', require('./routes/answer'));
// app.use('/api/comment', require('./routes/comment'));
// app.use('/api/folders', require('./routes/folder'));
// app.use('/api/reports', require('./routes/report'));

// // ==== Health check ====
// app.get('/', (req, res) => {
//     res.send('API is running...');
// });

// // ==== Xử lý lỗi tập trung ====
// app.use(errorHandler);

// // ==== Socket.IO handler ====
// require('./sockets')(io); // 👈 bạn có thể để logic ở đây hoặc tách file như thế này

// // ==== Khởi động server ====
// const PORT = process.env.PORT || 5000;
// server.listen(PORT, () => {
//     console.log(`🚀 Server + Socket.IO running on http://localhost:${PORT}`);
// });
// ==== Import thư viện ====
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const errorHandler = require('./middlewares/errorHandler');
const passport = require('./config/passport');

dotenv.config();

// ==== Khởi tạo Express & Socket.IO ====
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
});

// Cho phép truy cập io trong controller
app.set('io', io);

// ==== Middleware ====
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());
app.use(express.urlencoded({ extended: true }));

// ==== Kết nối DB ====
connectDB();

// ==== Routes API ====
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/user'));
app.use('/api/questions', require('./routes/question'));
app.use('/api/answers', require('./routes/answer'));
app.use('/api/comment', require('./routes/comment'));
app.use('/api/folders', require('./routes/folder'));
app.use('/api/reports', require('./routes/report'));
app.use('/api/notifications', require('./routes/notification'));

// ==== Health check ====
app.get('/', (req, res) => {
    res.send('API is running...');
});

// ==== Xử lý lỗi ====
app.use(errorHandler);

// ==== Gọi socket handler đã tách file ====
require('./sockets')(io);

// ==== Khởi động server ====
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`🚀 Server + Socket.IO running on http://localhost:${PORT}`);
});
