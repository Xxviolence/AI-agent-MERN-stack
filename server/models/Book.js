const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, '请输入书名'],
      trim: true,
      index: true,
    },
    author: {
      type: String,
      required: [true, '请输入作者'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
      maxlength: [2000, '描述最多2000个字符'],
    },
    category: {
      type: String,
      enum: ['文学', '理工', '经管', '外语', '考试', '其他'],
      default: '其他',
    },
    cover: {
      type: String,
      default: '',
    },
    filePath: {
      type: String,
      required: [true, '请上传电子书文件'],
    },
    fileName: {
      type: String,
      default: '',
    },
    fileSize: {
      type: Number,
      default: 0,
    },
    downloadCount: {
      type: Number,
      default: 0,
    },
    uploader: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

// 全文搜索索引
bookSchema.index({ title: 'text', author: 'text', description: 'text' });

module.exports = mongoose.model('Book', bookSchema);
