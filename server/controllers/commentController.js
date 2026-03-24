const Comment = require('../models/Comment');

// @desc    获取某本书的评论列表
// @route   GET /api/comments?book=:bookId
exports.getComments = async (req, res, next) => {
  try {
    const { book } = req.query;

    if (!book) {
      return res
        .status(400)
        .json({ success: false, message: '请指定书籍 ID' });
    }

    const comments = await Comment.find({ book })
      .populate('user', 'username avatar')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: comments });
  } catch (error) {
    next(error);
  }
};

// @desc    添加评论
// @route   POST /api/comments
exports.createComment = async (req, res, next) => {
  try {
    const { book, content, rating } = req.body;

    // 检查是否已评论
    const existing = await Comment.findOne({ book, user: req.user._id });
    if (existing) {
      return res
        .status(400)
        .json({ success: false, message: '你已经评论过这本书了' });
    }

    const comment = await Comment.create({
      book,
      content,
      rating,
      user: req.user._id,
    });

    await comment.populate('user', 'username avatar');

    res.status(201).json({ success: true, data: comment });
  } catch (error) {
    next(error);
  }
};

// @desc    删除评论
// @route   DELETE /api/comments/:id
exports.deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ success: false, message: '评论不存在' });
    }

    if (
      comment.user.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res
        .status(403)
        .json({ success: false, message: '无权删除此评论' });
    }

    await Comment.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: '评论已删除' });
  } catch (error) {
    next(error);
  }
};
