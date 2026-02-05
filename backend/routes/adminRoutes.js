const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { protect, admin } = require('../middleware/auth');
const upload = require('../middleware/upload');

const {
  createNews,
  getAllNewsAdmin,
  getNewsById,
  updateNews,
  deleteNews,
  toggleFeatured,
  getDashboardStats
} = require('../controllers/adminNewsController');

// Validation rules
const newsValidation = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('content').trim().notEmpty().withMessage('Content is required'),
  body('category').isIn(['politics', 'business', 'technology', 'sports', 'entertainment', 'health', 'science', 'world', 'local'])
    .withMessage('Invalid category')
];

// All routes require authentication and admin role
router.use(protect, admin);

// Dashboard stats
router.get('/stats', getDashboardStats);

// CRUD routes
router.route('/news')
  .get(getAllNewsAdmin)
  .post(newsValidation, validate, createNews);

router.route('/news/:id')
  .get(getNewsById)
  .put(updateNews)
  .delete(deleteNews);

router.patch('/news/:id/featured', toggleFeatured);

// Upload image
router.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'Please upload an image'
    });
  }
  res.status(200).json({
    success: true,
    data: {
      filename: req.file.filename,
      path: `/uploads/${req.file.filename}`
    }
  });
});

module.exports = router;
