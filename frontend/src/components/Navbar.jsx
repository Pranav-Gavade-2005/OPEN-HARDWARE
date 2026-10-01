import { useContext, useEffect, useState, useRef } from "react";
import { Menu, X, Search } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { getCurrentUser, logout } from '../services/api';


function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);


  useEffect( () => {
    const checkAuth = async () => {
      try {
        const userData = await getCurrentUser();
        if (userData) {
          setIsAuthenticated(true);
          setUser(userData);
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
      }
    };
    checkAuth();
  }, [navigate]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-gray-900">
              OpenHardware
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            {isAuthenticated ? (
              <>
                
                {/* Search Bar */}
                <form onSubmit={handleSearch} className="flex-1 max-w-lg">
                  <div className="relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search projects..."
                      className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    />
                    <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  </div>
                </form>


                <div className="relative " ref={dropdownRef}>
                  <button onClick={() => setIsOpen(!isOpen)} className="cursor-pointer flex items-center space-x-2">
                    <img
                      src={user?.profilePicture}
                      alt="Profile"
                      className="w-8 h-8 rounded-full object-cover border-2 border-gray-200"
                    />
                    <span className="text-gray-600">{user?.name}</span>
                  </button>

                  {isOpen && (
                    <div className="cursor-pointer absolute left-0 z-10 mt-2 w-40 origin-top-left scale-95 transform transition duration-150 ease-out bg-white border rounded shadow-lg">
                      <Link to='/profile' className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Dashboard
                      </Link>
                      <Link to={'/edit-profile'} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Settings</Link>
                      <div className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={handleLogout}>
                        Logout
                      </div>
                    </div>
                  )}
                </div>

              </>
            ) : (
              <>
                <a href="#features" className="text-gray-600 hover:text-gray-900">Features</a>
                <a href="#about" className="text-gray-600 hover:text-gray-900">About</a>
                <a href="#projects" className="text-gray-600 hover:text-gray-900">Projects</a>
                <a href="#community" className="text-gray-600 hover:text-gray-900">Community</a>
                <a href="#contact" className="text-gray-600 hover:text-gray-900">Contact</a>
                {/* Search Bar */}
                <form onSubmit={handleSearch} className="flex-1 max-w-lg">
                  <div className="relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search projects..."
                      className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    />
                    <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  </div>
                </form>

                <Link
                  to="/login"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gray-900 hover:bg-gray-800"
                >
                  Login
                </Link>
              </>
            )}
          </div>
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-600">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {isAuthenticated ? (
              <Link
                to="/profile"
                className="flex items-center space-x-2 block px-3 py-2 text-gray-600 hover:text-gray-900"
              >
                <img
                  src={user?.profilePicture}
                  alt="Profile"
                  className="w-8 h-8 rounded-full object-cover border-2 border-gray-200"
                />
                <span>{user?.name}</span>
              </Link>
            ) : (
              <>
                <a href="#features" className="block px-3 py-2 text-gray-600 hover:text-gray-900">Features</a>
                <a href="#about" className="block px-3 py-2 text-gray-600 hover:text-gray-900">About</a>
                <a href="#projects" className="block px-3 py-2 text-gray-600 hover:text-gray-900">Projects</a>
                <a href="#community" className="block px-3 py-2 text-gray-600 hover:text-gray-900">Community</a>
                <a href="#contact" className="block px-3 py-2 text-gray-600 hover:text-gray-900">Contact</a>

                {/* Search Bar */}
                <form onSubmit={handleSearch} className="flex-1 max-w-lg">
                  <div className="relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search projects..."
                      className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    />
                    <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  </div>
                </form>

                <Link
                  to="/login"
                  className="block px-3 py-2 text-gray-600 hover:text-gray-900"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;