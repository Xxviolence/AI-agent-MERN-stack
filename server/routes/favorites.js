const express = require('express');
const router = express.Router();
const {
  getFavorites,
  addFavorite,
  removeFavorite,
  checkFavorite,
} = require('../controllers/favoriteController');
const auth = require('../middleware/auth');

router.get('/', auth, getFavorites);
router.post('/', auth, addFavorite);
router.delete('/:bookId', auth, removeFavorite);
router.get('/check/:bookId', auth, checkFavorite);

module.exports = router;
