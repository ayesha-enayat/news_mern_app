import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { newsAPI } from '../services/api';
import NewsCard from '../components/NewsCard';
import Loading from '../components/Loading';

const Home = () => {
  const [searchParams] = useSearchParams();
  const [featuredNews, setFeaturedNews] = useState([]);
  const [latestNews, setLatestNews] = useState([]);
  const [trendingNews, setTrendingNews] = useState([]);
  const [loading, setLoading] = useState(true);

  const searchQuery = searchParams.get('search');

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        
        if (searchQuery) {
          // Search mode
          const res = await newsAPI.getAll({ search: searchQuery, limit: 20 });
          setLatestNews(res.data.data);
          setFeaturedNews([]);
          setTrendingNews([]);
        } else {
          // Normal mode
          const [featuredRes, latestRes, trendingRes] = await Promise.all([
            newsAPI.getFeatured(3),
            newsAPI.getAll({ limit: 9 }),
            newsAPI.getTrending(5)
          ]);

          setFeaturedNews(featuredRes.data.data);
          setLatestNews(latestRes.data.data);
          setTrendingNews(trendingRes.data.data);
        }
      } catch (error) {
        console.error('Error fetching news:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [searchQuery]);

  if (loading) return <Loading />;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {searchQuery ? (
        <>
          <h1 className="text-2xl font-bold mb-6">
            Search Results for "{searchQuery}"
          </h1>
          {latestNews.length === 0 ? (
            <p className="text-gray-600">No news found matching your search.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {latestNews.map((news) => (
                <NewsCard key={news._id} news={news} />
              ))}
            </div>
          )}
        </>
      ) : (
        <>
          {/* Featured Section */}
          {featuredNews.length > 0 && (
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-6">Featured Stories</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {featuredNews[0] && (
                  <NewsCard news={featuredNews[0]} variant="featured" />
                )}
                <div className="space-y-4">
                  {featuredNews.slice(1).map((news) => (
                    <NewsCard key={news._id} news={news} variant="horizontal" />
                  ))}
                </div>
              </div>
            </section>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Latest News */}
            <section className="lg:col-span-2">
              <h2 className="text-2xl font-bold mb-6">Latest News</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {latestNews.map((news) => (
                  <NewsCard key={news._id} news={news} />
                ))}
              </div>
            </section>

            {/* Trending Sidebar */}
            <aside>
              <h2 className="text-2xl font-bold mb-6">Trending</h2>
              <div className="space-y-4">
                {trendingNews.map((news, index) => (
                  <div key={news._id} className="flex gap-4">
                    <span className="text-3xl font-bold text-gray-300">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <NewsCard news={news} variant="horizontal" />
                  </div>
                ))}
              </div>
            </aside>
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
