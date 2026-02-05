import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiFileText, FiEye, FiHeart, FiTrendingUp, FiPlus } from 'react-icons/fi';
import { adminAPI } from '../../services/api';
import Loading from '../../components/Loading';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await adminAPI.getStats();
        setStats(res.data.data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <Loading />;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Link
          to="/admin/news/create"
          className="px-4 py-2 bg-primary-600 text-white rounded-lg flex items-center gap-2 hover:bg-primary-700"
        >
          <FiPlus /> Create News
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <FiFileText className="text-blue-600 text-2xl" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Total News</p>
              <p className="text-2xl font-bold">{stats?.totalNews || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <FiTrendingUp className="text-green-600 text-2xl" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Published</p>
              <p className="text-2xl font-bold">{stats?.publishedNews || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <FiEye className="text-purple-600 text-2xl" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Total Views</p>
              <p className="text-2xl font-bold">{stats?.engagement?.totalViews || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-100 rounded-lg">
              <FiHeart className="text-red-600 text-2xl" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Total Likes</p>
              <p className="text-2xl font-bold">{stats?.engagement?.totalLikes || 0}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* News by Category */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-lg font-semibold mb-4">News by Category</h2>
          <div className="space-y-3">
            {stats?.newsByCategory?.map((cat) => (
              <div key={cat._id} className="flex items-center justify-between">
                <span className="capitalize text-gray-600">{cat._id}</span>
                <span className="font-semibold">{cat.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent News */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-lg font-semibold mb-4">Recent News</h2>
          <div className="space-y-3">
            {stats?.recentNews?.map((news) => (
              <Link
                key={news._id}
                to={`/admin/news/${news._id}`}
                className="block p-3 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <p className="font-medium text-gray-800 truncate">{news.title}</p>
                <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                  <span className={`px-2 py-0.5 rounded text-xs ${
                    news.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {news.status}
                  </span>
                  <span className="flex items-center gap-1">
                    <FiEye size={12} /> {news.views}
                  </span>
                  <span className="flex items-center gap-1">
                    <FiHeart size={12} /> {news.likesCount}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
