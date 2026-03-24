const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: [true, '请输入评论内容'],
      maxlength: [500, '评论最多500个字符'],
    },
    rating: {
      type: Number,
      required: [true, '请选择评分'],
      min: [1, '评分最低1分'],
      max: [5, '评分最高5分'],
    },
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book',
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

// 一个用户对一本书只能评论一次
commentSchema.index({ book: 1, user: 1 }, { unique: true });
commentSchema.index({ book: 1, createdAt: -1 });

module.exports = mongoose.model('Comment', commentSchema);
