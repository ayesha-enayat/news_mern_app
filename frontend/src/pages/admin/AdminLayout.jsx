import { NavLink, Outlet, Navigate } from 'react-router-dom';
import { FiHome, FiFileText, FiPlusCircle, FiSettings, FiArrowLeft } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

const AdminLayout = () => {
  const { isAdmin, user } = useAuth();

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  const navItems = [
    { to: '/admin', icon: FiHome, label: 'Dashboard', end: true },
    { to: '/admin/news', icon: FiFileText, label: 'All News' },
    { to: '/admin/news/create', icon: FiPlusCircle, label: 'Create News' }
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-900 min-h-screen fixed">
          <div className="p-6">
            <h2 className="text-white text-xl font-bold">NewsHub Admin</h2>
            <p className="text-gray-400 text-sm mt-1">Welcome, {user?.name}</p>
          </div>

          <nav className="mt-6">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-6 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors ${
                    isActive ? 'bg-gray-800 text-white border-l-4 border-primary-500' : ''
                  }`
                }
              >
                <item.icon size={20} />
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="absolute bottom-0 left-0 right-0 p-6">
            <NavLink
              to="/"
              className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors"
            >
              <FiArrowLeft size={20} />
              Back to Website
            </NavLink>
          </div>
        </aside>

        {/* Main Content */}
        <main className="ml-64 flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
