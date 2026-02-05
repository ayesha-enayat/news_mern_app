import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiHeart, FiBookmark, FiEye, FiClock, FiShare2, FiArrowLeft } from 'react-icons/fi';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import { newsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Loading from '../components/Loading';
import NewsCard from '../components/NewsCard';
import Comments from '../components/Comments';

const NewsDetail = () => {
  const { slug } = useParams();
  const { isAuthenticated } = useAuth();
  const [news, setNews] = useState(null);
  const [relatedNews, setRelatedNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const res = await newsAPI.getBySlug(slug);
        const newsData = res.data.data;
        setNews(newsData);
        setIsLiked(newsData.isLiked);
        setIsFavorited(newsData.isFavorited);
        setLikesCount(newsData.likesCount);

        // Fetch related news
        const relatedRes = await newsAPI.getRelated(newsData._id);
        setRelatedNews(relatedRes.data.data);
      } catch (error) {
        console.error('Error fetching news:', error);
        toast.error('Failed to load news article');
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [slug]);

  const handleLike = async () => {
    if (!isAuthenticated) {
      toast.info('Please login to like articles');
      return;
    }

    try {
      const res = await newsAPI.toggleLike(news._id);
      setIsLiked(res.data.isLiked);
      setLikesCount(res.data.likesCount);
      toast.success(res.data.message);
    } catch (error) {
      toast.error('Failed to like article');
    }
  };

  const handleFavorite = async () => {
    if (!isAuthenticated) {
      toast.info('Please login to save articles');
      return;
    }

    try {
      const res = await newsAPI.toggleFavorite(news._id);
      setIsFavorited(res.data.isFavorited);
      toast.success(res.data.message);
    } catch (error) {
      toast.error('Failed to save article');
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: news.title,
          text: news.summary,
          url: window.location.href
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  if (loading) return <Loading />;

  if (!news) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold text-gray-800">Article not found</h1>
        <Link to="/" className="text-primary-600 mt-4 inline-block">
          Go back to home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Link to="/" className="inline-flex items-center text-gray-600 hover:text-primary-600 mb-6">
        <FiArrowLeft className="mr-2" /> Back to Home
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <article className="lg:col-span-2">
          {/* Category */}
          <Link
            to={`/category/${news.category}`}
            className="inline-block px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm capitalize"
          >
            {news.category}
          </Link>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mt-4">
            {news.title}
          </h1>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 mt-4 text-gray-600">
            <span className="flex items-center">
              <img
                src={news.author?.avatar || 'https://via.placeholder.com/40'}
                alt={news.author?.name}
                className="w-8 h-8 rounded-full mr-2"
              />
              {news.author?.name}
            </span>
            <span className="flex items-center">
              <FiClock className="mr-1" />
              {format(new Date(news.publishedAt), 'MMMM dd, yyyy')}
            </span>
            <span className="flex items-center">
              <FiEye className="mr-1" />
              {news.views} views
            </span>
          </div>

          {/* Image */}
          {news.image && (
            <img
              src={news.image}
              alt={news.title}
              className="w-full h-auto rounded-xl mt-6"
            />
          )}

          {/* Actions */}
          <div className="flex items-center gap-4 mt-6 py-4 border-y">
            <button
              onClick={handleLike}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                isLiked
                  ? 'bg-red-100 text-red-600'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <FiHeart className={isLiked ? 'fill-current' : ''} />
              {likesCount}
            </button>
            <button
              onClick={handleFavorite}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                isFavorited
                  ? 'bg-yellow-100 text-yellow-600'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <FiBookmark className={isFavorited ? 'fill-current' : ''} />
              {isFavorited ? 'Saved' : 'Save'}
            </button>
            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <FiShare2 />
              Share
            </button>
          </div>

          {/* Content */}
          <div
            className="prose prose-lg max-w-none mt-6"
            dangerouslySetInnerHTML={{ __html: news.content }}
          />

          {/* Tags */}
          {news.tags && news.tags.length > 0 && (
            <div className="mt-8">
              <h3 className="font-semibold text-gray-700 mb-2">Tags:</h3>
              <div className="flex flex-wrap gap-2">
                {news.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Comments Section */}
          <Comments newsId={news._id} />
        </article>

        {/* Sidebar */}
        <aside>
          <h3 className="text-xl font-bold mb-4">Related News</h3>
          <div className="space-y-4">
            {relatedNews.map((item) => (
              <NewsCard key={item._id} news={item} variant="horizontal" />
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
};

export default NewsDetail;
