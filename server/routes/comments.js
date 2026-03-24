const express = require('express');
const router = express.Router();
const {
  getComments,
  createComment,
  deleteComment,
} = require('../controllers/commentController');
const auth = require('../middleware/auth');

router.get('/', getComments);
router.post('/', auth, createComment);
router.delete('/:id', auth, deleteComment);

module.exports = router;
