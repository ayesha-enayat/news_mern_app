const News = require('../models/News');
const User = require('../models/User');

// ==================== USER CONTROLLERS ====================

// @desc    Get all published news
// @route   GET /api/news
// @access  Public
exports.getPublishedNews = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    let query = { status: 'published' };

    // Filter by category
    if (req.query.category) {
      query.category = req.query.category;
    }

    // Search
    if (req.query.search) {
      query.$text = { $search: req.query.search };
    }

    // Filter by tag
    if (req.query.tag) {
      query.tags = { $in: [req.query.tag] };
    }

    const total = await News.countDocuments(query);
    const news = await News.find(query)
      .populate('author', 'name avatar')
      .select('-content')
      .sort({ publishedAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      count: news.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      data: news
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single news by slug
// @route   GET /api/news/:slug
// @access  Public
exports.getNewsBySlug = async (req, res) => {
  try {
    const news = await News.findOne({ 
      slug: req.params.slug, 
      status: 'published' 
    }).populate('author', 'name avatar');

    if (!news) {
      return res.status(404).json({
        success: false,
        message: 'News article not found'
      });
    }

    // Increment view count
    news.views += 1;
    await news.save();

    // Check if user has liked this article
    let isLiked = false;
    let isFavorited = false;
    
    if (req.user) {
      isLiked = news.likes.includes(req.user._id);
      const user = await User.findById(req.user._id);
      isFavorited = user.favorites.includes(news._id);
    }

    res.status(200).json({
      success: true,
      data: {
        ...news.toObject(),
        isLiked,
        isFavorited
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get featured news
// @route   GET /api/news/featured
// @access  Public
exports.getFeaturedNews = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 5;

    const news = await News.find({ 
      status: 'published', 
      isFeatured: true 
    })
      .populate('author', 'name avatar')
      .select('-content')
      .sort({ publishedAt: -1 })
      .limit(limit);

    res.status(200).json({
      success: true,
      count: news.length,
      data: news
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get news by category
// @route   GET /api/news/category/:category
// @access  Public
exports.getNewsByCategory = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const query = { 
      status: 'published', 
      category: req.params.category 
    };

    const total = await News.countDocuments(query);
    const news = await News.find(query)
      .populate('author', 'name avatar')
      .select('-content')
      .sort({ publishedAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      count: news.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      data: news
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Like/Unlike a news article
// @route   POST /api/news/:id/like
// @access  Private
exports.toggleLike = async (req, res) => {
  try {
    const news = await News.findById(req.params.id);

    if (!news) {
      return res.status(404).json({
        success: false,
        message: 'News article not found'
      });
    }

    const likeIndex = news.likes.indexOf(req.user._id);

    if (likeIndex > -1) {
      // Unlike
      news.likes.splice(likeIndex, 1);
      news.likesCount = news.likes.length;
      await news.save();

      res.status(200).json({
        success: true,
        message: 'News unliked',
        isLiked: false,
        likesCount: news.likesCount
      });
    } else {
      // Like
      news.likes.push(req.user._id);
      news.likesCount = news.likes.length;
      await news.save();

      res.status(200).json({
        success: true,
        message: 'News liked',
        isLiked: true,
        likesCount: news.likesCount
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Add/Remove from favorites
// @route   POST /api/news/:id/favorite
// @access  Private
exports.toggleFavorite = async (req, res) => {
  try {
    const news = await News.findById(req.params.id);

    if (!news) {
      return res.status(404).json({
        success: false,
        message: 'News article not found'
      });
    }

    const user = await User.findById(req.user._id);
    const favoriteIndex = user.favorites.indexOf(news._id);

    if (favoriteIndex > -1) {
      // Remove from favorites
      user.favorites.splice(favoriteIndex, 1);
      await user.save();

      res.status(200).json({
        success: true,
        message: 'Removed from favorites',
        isFavorited: false
      });
    } else {
      // Add to favorites
      user.favorites.push(news._id);
      await user.save();

      res.status(200).json({
        success: true,
        message: 'Added to favorites',
        isFavorited: true
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get user's favorite news
// @route   GET /api/news/favorites
// @access  Private
exports.getFavorites = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const user = await User.findById(req.user._id);
    const total = user.favorites.length;

    const news = await News.find({
      _id: { $in: user.favorites },
      status: 'published'
    })
      .populate('author', 'name avatar')
      .select('-content')
      .sort({ publishedAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      count: news.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      data: news
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get trending news (most viewed)
// @route   GET /api/news/trending
// @access  Public
exports.getTrendingNews = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 10;

    const news = await News.find({ status: 'published' })
      .populate('author', 'name avatar')
      .select('-content')
      .sort({ views: -1, likesCount: -1 })
      .limit(limit);

    res.status(200).json({
      success: true,
      count: news.length,
      data: news
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get related news
// @route   GET /api/news/:id/related
// @access  Public
exports.getRelatedNews = async (req, res) => {
  try {
    const news = await News.findById(req.params.id);

    if (!news) {
      return res.status(404).json({
        success: false,
        message: 'News article not found'
      });
    }

    const relatedNews = await News.find({
      _id: { $ne: news._id },
      status: 'published',
      $or: [
        { category: news.category },
        { tags: { $in: news.tags } }
      ]
    })
      .populate('author', 'name avatar')
      .select('-content')
      .sort({ publishedAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      count: relatedNews.length,
      data: relatedNews
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all categories with count
// @route   GET /api/news/categories
// @access  Public
exports.getCategories = async (req, res) => {
  try {
    const categories = await News.aggregate([
      { $match: { status: 'published' } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.status(200).json({
      success: true,
      data: categories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
