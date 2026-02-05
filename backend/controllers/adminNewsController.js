const News = require('../models/News');

// ==================== ADMIN CONTROLLERS ====================

// @desc    Create news article
// @route   POST /api/admin/news
// @access  Private/Admin
exports.createNews = async (req, res) => {
  try {
    const { title, content, summary, category, tags, image, status, isFeatured } = req.body;

    const news = await News.create({
      title,
      content,
      summary,
      category,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      image,
      author: req.user._id,
      status: status || 'draft',
      isFeatured: isFeatured || false,
      publishedAt: status === 'published' ? Date.now() : null
    });

    await news.populate('author', 'name email');

    res.status(201).json({
      success: true,
      data: news
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all news (admin view - includes drafts)
// @route   GET /api/admin/news
// @access  Private/Admin
exports.getAllNewsAdmin = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    // Build query
    let query = {};
    
    if (req.query.status) {
      query.status = req.query.status;
    }
    if (req.query.category) {
      query.category = req.query.category;
    }
    if (req.query.search) {
      query.$text = { $search: req.query.search };
    }

    const total = await News.countDocuments(query);
    const news = await News.find(query)
      .populate('author', 'name email')
      .sort({ createdAt: -1 })
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

// @desc    Get single news by ID (admin)
// @route   GET /api/admin/news/:id
// @access  Private/Admin
exports.getNewsById = async (req, res) => {
  try {
    const news = await News.findById(req.params.id)
      .populate('author', 'name email');

    if (!news) {
      return res.status(404).json({
        success: false,
        message: 'News article not found'
      });
    }

    res.status(200).json({
      success: true,
      data: news
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update news article
// @route   PUT /api/admin/news/:id
// @access  Private/Admin
exports.updateNews = async (req, res) => {
  try {
    let news = await News.findById(req.params.id);

    if (!news) {
      return res.status(404).json({
        success: false,
        message: 'News article not found'
      });
    }

    const { title, content, summary, category, tags, image, status, isFeatured } = req.body;

    const updateData = {
      title,
      content,
      summary,
      category,
      image,
      status,
      isFeatured,
      updatedAt: Date.now()
    };

    if (tags) {
      updateData.tags = tags.split(',').map(tag => tag.trim());
    }

    // Set publishedAt if being published for the first time
    if (status === 'published' && news.status !== 'published') {
      updateData.publishedAt = Date.now();
    }

    news = await News.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('author', 'name email');

    res.status(200).json({
      success: true,
      data: news
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete news article
// @route   DELETE /api/admin/news/:id
// @access  Private/Admin
exports.deleteNews = async (req, res) => {
  try {
    const news = await News.findById(req.params.id);

    if (!news) {
      return res.status(404).json({
        success: false,
        message: 'News article not found'
      });
    }

    await news.deleteOne();

    res.status(200).json({
      success: true,
      message: 'News article deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Toggle featured status
// @route   PATCH /api/admin/news/:id/featured
// @access  Private/Admin
exports.toggleFeatured = async (req, res) => {
  try {
    const news = await News.findById(req.params.id);

    if (!news) {
      return res.status(404).json({
        success: false,
        message: 'News article not found'
      });
    }

    news.isFeatured = !news.isFeatured;
    await news.save();

    res.status(200).json({
      success: true,
      data: news
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get admin dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
exports.getDashboardStats = async (req, res) => {
  try {
    const totalNews = await News.countDocuments();
    const publishedNews = await News.countDocuments({ status: 'published' });
    const draftNews = await News.countDocuments({ status: 'draft' });
    const featuredNews = await News.countDocuments({ isFeatured: true });
    
    // Get news by category
    const newsByCategory = await News.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Get total views and likes
    const engagement = await News.aggregate([
      {
        $group: {
          _id: null,
          totalViews: { $sum: '$views' },
          totalLikes: { $sum: '$likesCount' }
        }
      }
    ]);

    // Recent news
    const recentNews = await News.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('title status createdAt views likesCount');

    res.status(200).json({
      success: true,
      data: {
        totalNews,
        publishedNews,
        draftNews,
        featuredNews,
        newsByCategory,
        engagement: engagement[0] || { totalViews: 0, totalLikes: 0 },
        recentNews
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
