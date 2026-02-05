const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

const {
  updateComment,
  deleteComment,
  toggleCommentLike
} = require('../controllers/commentController');

// All routes require authentication
router.use(protect);

router.route('/:id')
  .put(updateComment)
  .delete(deleteComment);

router.post('/:id/like', toggleCommentLike);

module.exports = router;
