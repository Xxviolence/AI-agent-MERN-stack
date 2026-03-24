const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const errorHandler = require('./middleware/errorHandler');

// 路由
const authRoutes = require('./routes/auth');
const bookRoutes = require('./routes/books');
const commentRoutes = require('./routes/comments');
const favoriteRoutes = require('./routes/favorites');

const app = express();

// --- 中间件 ---
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// 静态文件服务（封面图片）
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- API 路由 ---
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/favorites', favoriteRoutes);

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'CampusBookShare API is running 🚀' });
});

// 错误处理中间件（放在最后）
app.use(errorHandler);

module.exports = app;
