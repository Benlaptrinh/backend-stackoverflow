
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const errorHandler = require('./middlewares/errorHandler');

dotenv.config();
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Connect Database
connectDB();

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/user'));

// Default route
app.get('/', (req, res) => {
    res.send('API is running...');
});


const PORT = process.env.PORT || 3000;

// Đặt errorHandler cuối cùng, sau tất cả các route
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
