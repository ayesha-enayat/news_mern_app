import { useState, useEffect } from 'react';
import { newsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import NewsCard from '../components/NewsCard';
import Loading from '../components/Loading';
import { Link } from 'react-router-dom';

const Favorites = () => {
  const { isAuthenticated } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const res = await newsAPI.getFavorites();
        setFavorites(res.data.data);
      } catch (error) {
        console.error('Error fetching favorites:', error);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchFavorites();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Please login to view your favorites</h1>
        <Link to="/login" className="text-primary-600 hover:underline">
          Login here
        </Link>
      </div>
    );
  }

  if (loading) return <Loading />;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Favorites</h1>

      {favorites.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">You haven't saved any articles yet.</p>
          <Link to="/" className="text-primary-600 hover:underline">
            Browse news to find articles to save
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((news) => (
            <NewsCard key={news._id} news={news} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;
