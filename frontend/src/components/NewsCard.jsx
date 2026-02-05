import { Link } from 'react-router-dom';
import { FiHeart, FiEye, FiClock } from 'react-icons/fi';
import { format } from 'date-fns';

const NewsCard = ({ news, variant = 'default' }) => {
  const formatDate = (date) => {
    return format(new Date(date), 'MMM dd, yyyy');
  };

  if (variant === 'featured') {
    return (
      <Link to={`/news/${news.slug}`} className="group">
        <div className="relative h-96 rounded-xl overflow-hidden">
          <img
            src={news.image || 'https://via.placeholder.com/800x400'}
            alt={news.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
          <div className="absolute bottom-0 p-6 text-white">
            <span className="px-3 py-1 bg-primary-600 rounded-full text-sm capitalize">
              {news.category}
            </span>
            <h2 className="text-2xl font-bold mt-3 group-hover:text-primary-300 transition-colors">
              {news.title}
            </h2>
            <p className="mt-2 text-gray-300 line-clamp-2">{news.summary}</p>
            <div className="flex items-center mt-4 space-x-4 text-sm text-gray-300">
              <span className="flex items-center">
                <FiClock className="mr-1" />
                {formatDate(news.publishedAt)}
              </span>
              <span className="flex items-center">
                <FiEye className="mr-1" />
                {news.views}
              </span>
              <span className="flex items-center">
                <FiHeart className="mr-1" />
                {news.likesCount}
              </span>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  if (variant === 'horizontal') {
    return (
      <Link to={`/news/${news.slug}`} className="group flex gap-4">
        <div className="w-32 h-24 flex-shrink-0 rounded-lg overflow-hidden">
          <img
            src={news.image || 'https://via.placeholder.com/200x150'}
            alt={news.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="flex-1">
          <span className="text-xs text-primary-600 capitalize">{news.category}</span>
          <h3 className="font-semibold text-gray-800 group-hover:text-primary-600 line-clamp-2 transition-colors">
            {news.title}
          </h3>
          <span className="text-xs text-gray-500 flex items-center mt-1">
            <FiClock className="mr-1" />
            {formatDate(news.publishedAt)}
          </span>
        </div>
      </Link>
    );
  }

  // Default card variant
  return (
    <Link to={`/news/${news.slug}`} className="group">
      <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
        <div className="h-48 overflow-hidden">
          <img
            src={news.image || 'https://via.placeholder.com/400x250'}
            alt={news.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="p-4">
          <span className="text-xs text-primary-600 capitalize font-medium">
            {news.category}
          </span>
          <h3 className="font-bold text-lg text-gray-800 mt-1 group-hover:text-primary-600 line-clamp-2 transition-colors">
            {news.title}
          </h3>
          <p className="text-gray-600 text-sm mt-2 line-clamp-2">
            {news.summary}
          </p>
          <div className="flex items-center justify-between mt-4 text-sm text-gray-500">
            <span className="flex items-center">
              <FiClock className="mr-1" />
              {formatDate(news.publishedAt)}
            </span>
            <div className="flex items-center space-x-3">
              <span className="flex items-center">
                <FiEye className="mr-1" />
                {news.views}
              </span>
              <span className="flex items-center">
                <FiHeart className="mr-1" />
                {news.likesCount}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default NewsCard;
