const express = require('express');
const router = express.Router();
const {
  getBooks,
  getBook,
  createBook,
  updateBook,
  deleteBook,
  downloadBook,
} = require('../controllers/bookController');
const auth = require('../middleware/auth');
const { uploadFields } = require('../middleware/upload');

router.get('/', getBooks);
router.get('/:id', getBook);
router.post('/', auth, uploadFields, createBook);
router.put('/:id', auth, updateBook);
router.delete('/:id', auth, deleteBook);
router.get('/:id/download', auth, downloadBook);

module.exports = router;
