import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white mt-12">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="text-2xl font-bold text-primary-400">NewsHub</Link>
            <p className="mt-4 text-gray-400">
              Your trusted source for the latest news and updates from around the world.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-lg mb-4">Categories</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/category/politics" className="hover:text-white">Politics</Link></li>
              <li><Link to="/category/business" className="hover:text-white">Business</Link></li>
              <li><Link to="/category/technology" className="hover:text-white">Technology</Link></li>
              <li><Link to="/category/sports" className="hover:text-white">Sports</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-lg mb-4">More</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/category/entertainment" className="hover:text-white">Entertainment</Link></li>
              <li><Link to="/category/health" className="hover:text-white">Health</Link></li>
              <li><Link to="/category/science" className="hover:text-white">Science</Link></li>
              <li><Link to="/category/world" className="hover:text-white">World</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-lg mb-4">Connect</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/about" className="hover:text-white">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
              <li><Link to="/privacy" className="hover:text-white">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-white">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} NewsHub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
