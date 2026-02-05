const express = require('express');
const router = express.Router();
const { protect, optionalAuth } = require('../middleware/auth');

const {
  getPublishedNews,
  getNewsBySlug,
  getFeaturedNews,
  getNewsByCategory,
  toggleLike,
  toggleFavorite,
  getFavorites,
  getTrendingNews,
  getRelatedNews,
  getCategories
} = require('../controllers/userNewsController');

const {
  getComments,
  addComment
} = require('../controllers/commentController');

// Public routes
router.get('/categories', getCategories);
router.get('/featured', getFeaturedNews);
router.get('/trending', getTrendingNews);
router.get('/category/:category', getNewsByCategory);
router.get('/:id/related', getRelatedNews);
router.get('/:newsId/comments', getComments);

// Routes with optional auth (to check like/favorite status)
router.get('/', optionalAuth, getPublishedNews);
router.get('/:slug', optionalAuth, getNewsBySlug);

// Protected routes
router.get('/user/favorites', protect, getFavorites);
router.post('/:id/like', protect, toggleLike);
router.post('/:id/favorite', protect, toggleFavorite);
router.post('/:newsId/comments', protect, addComment);

module.exports = router;
