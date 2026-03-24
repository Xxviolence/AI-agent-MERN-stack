const errorHandler = (err, req, res, next) => {
  console.error('Error:', err.message);

  // Multer 文件大小限制错误
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      success: false,
      message: '文件大小超出限制',
    });
  }

  // Multer 其他错误
  if (err.name === 'MulterError') {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  // Mongoose 验证错误
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({
      success: false,
      message: messages.join(', '),
    });
  }

  // MongoDB 重复键错误
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({
      success: false,
      message: `${field} 已存在`,
    });
  }

  // JWT 错误
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: '无效的 Token',
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token 已过期，请重新登录',
    });
  }

  // 默认服务器错误
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || '服务器内部错误',
  });
};

module.exports = errorHandler;
