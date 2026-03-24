const Favorite = require('../models/Favorite');

// @desc    获取当前用户的收藏列表
// @route   GET /api/favorites
exports.getFavorites = async (req, res, next) => {
  try {
    const favorites = await Favorite.find({ user: req.user._id })
      .populate({
        path: 'book',
        populate: { path: 'uploader', select: 'username avatar' },
      })
      .sort({ createdAt: -1 });

    res.json({ success: true, data: favorites });
  } catch (error) {
    next(error);
  }
};

// @desc    添加收藏
// @route   POST /api/favorites
exports.addFavorite = async (req, res, next) => {
  try {
    const { book } = req.body;

    const existing = await Favorite.findOne({ user: req.user._id, book });
    if (existing) {
      return res.status(400).json({ success: false, message: '已经收藏过了' });
    }

    const favorite = await Favorite.create({ user: req.user._id, book });

    res.status(201).json({ success: true, data: favorite });
  } catch (error) {
    next(error);
  }
};

// @desc    取消收藏
// @route   DELETE /api/favorites/:bookId
exports.removeFavorite = async (req, res, next) => {
  try {
    const favorite = await Favorite.findOneAndDelete({
      user: req.user._id,
      book: req.params.bookId,
    });

    if (!favorite) {
      return res.status(404).json({ success: false, message: '未找到收藏记录' });
    }

    res.json({ success: true, message: '已取消收藏' });
  } catch (error) {
    next(error);
  }
};

// @desc    检查是否已收藏
// @route   GET /api/favorites/check/:bookId
exports.checkFavorite = async (req, res, next) => {
  try {
    const favorite = await Favorite.findOne({
      user: req.user._id,
      book: req.params.bookId,
    });

    res.json({ success: true, data: { isFavorited: !!favorite } });
  } catch (error) {
    next(error);
  }
};
