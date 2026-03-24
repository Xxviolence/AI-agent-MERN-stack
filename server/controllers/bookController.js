const path = require('path');
const fs = require('fs');
const Book = require('../models/Book');

// @desc    获取书籍列表（分页 + 搜索 + 分类筛选）
// @route   GET /api/books
exports.getBooks = async (req, res, next) => {
  try {
    const { page = 1, limit = 12, category, search } = req.query;
    const query = {};

    if (category && category !== '全部') {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const total = await Book.countDocuments(query);
    const books = await Book.find(query)
      .populate('uploader', 'username avatar')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: books,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    获取单本书籍详情
// @route   GET /api/books/:id
exports.getBook = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id).populate(
      'uploader',
      'username avatar'
    );

    if (!book) {
      return res.status(404).json({ success: false, message: '书籍不存在' });
    }

    res.json({ success: true, data: book });
  } catch (error) {
    next(error);
  }
};

// @desc    上传电子书
// @route   POST /api/books
exports.createBook = async (req, res, next) => {
  try {
    const { title, author, description, category } = req.body;

    if (!req.files || !req.files.bookFile || req.files.bookFile.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: '请上传电子书文件' });
    }

    const bookFile = req.files.bookFile[0];
    const bookData = {
      title,
      author,
      description,
      category,
      filePath: bookFile.path,
      fileName: bookFile.originalname,
      fileSize: bookFile.size,
      uploader: req.user._id,
    };

    if (req.files.coverFile && req.files.coverFile.length > 0) {
      bookData.cover = `/uploads/covers/${req.files.coverFile[0].filename}`;
    }

    const book = await Book.create(bookData);
    await book.populate('uploader', 'username avatar');

    res.status(201).json({ success: true, data: book });
  } catch (error) {
    next(error);
  }
};

// @desc    更新书籍信息
// @route   PUT /api/books/:id
exports.updateBook = async (req, res, next) => {
  try {
    let book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ success: false, message: '书籍不存在' });
    }

    // 仅上传者或管理员可修改
    if (
      book.uploader.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ success: false, message: '无权修改此书籍' });
    }

    const { title, author, description, category } = req.body;
    book = await Book.findByIdAndUpdate(
      req.params.id,
      { title, author, description, category },
      { new: true, runValidators: true }
    ).populate('uploader', 'username avatar');

    res.json({ success: true, data: book });
  } catch (error) {
    next(error);
  }
};

// @desc    删除书籍
// @route   DELETE /api/books/:id
exports.deleteBook = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ success: false, message: '书籍不存在' });
    }

    if (
      book.uploader.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ success: false, message: '无权删除此书籍' });
    }

    // 删除文件
    if (book.filePath && fs.existsSync(book.filePath)) {
      fs.unlinkSync(book.filePath);
    }
    if (book.cover) {
      const coverPath = path.join(__dirname, '..', book.cover);
      if (fs.existsSync(coverPath)) {
        fs.unlinkSync(coverPath);
      }
    }

    await Book.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: '书籍已删除' });
  } catch (error) {
    next(error);
  }
};

// @desc    下载电子书
// @route   GET /api/books/:id/download
exports.downloadBook = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ success: false, message: '书籍不存在' });
    }

    if (!fs.existsSync(book.filePath)) {
      return res
        .status(404)
        .json({ success: false, message: '文件不存在，可能已被删除' });
    }

    // 增加下载计数
    book.downloadCount += 1;
    await book.save();

    // 发送文件
    res.download(book.filePath, book.fileName || 'book');
  } catch (error) {
    next(error);
  }
};
