import { Avatar, Dropdown } from 'flowbite-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AiOutlineSearch } from 'react-icons/ai';
import { FaMoon, FaSun } from 'react-icons/fa';
import { FiBriefcase, FiRadio, FiBarChart2, FiInfo } from 'react-icons/fi';
import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme } from '../redux/theme/themeSlice';
import { signoutSuccess } from '../redux/user/userSlice';
import { useEffect, useState } from 'react';

export default function Header() {
  const path = useLocation().pathname;
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const { theme } = useSelector((state) => state.theme);
  const [searchTerm, setSearchTerm] = useState('');

  // Add dark mode class to root element
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);

  const handleSignout = async () => {
    try {
      const res = await fetch('/api/user/signout', {
        method: 'POST',
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signoutSuccess());
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('searchTerm', searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  return (
    <div className="border-b border-gray-200 dark:border-gray-700 px-4 md:px-6 py-4 bg-white dark:bg-gray-900">
      <div className="flex flex-col md:flex-row md:items-center justify-between max-w-7xl mx-auto gap-4">
        {/* Logo and Search */}
        <div className="flex items-center gap-4 md:gap-8">
          <Link to="/" className="flex items-center">
            <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white text-sm sm:text-xl font-semibold">
              MarketPulse Ai
            </span>
          </Link>
          <form onSubmit={handleSubmit} className="relative flex-1 md:flex-none">
            <AiOutlineSearch className="absolute left-3 top-2.5 text-gray-400 dark:text-gray-500" size={20} />
            <input
              type="text"
              placeholder="Search stocks, MFs & more"
              className="bg-gray-50 dark:bg-gray-800 pl-10 pr-4 py-2 rounded-lg w-full md:w-96 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 border border-gray-300 dark:border-gray-700"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </form>
        </div>

        {/* Navigation and Auth */}
        <div className="flex items-center gap-4 md:gap-6 overflow-x-auto">
          {/* Navigation Buttons */}
          <Link to="/portfolio" className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-white whitespace-nowrap">
            <FiBriefcase size={18} />
            <span className="hidden md:inline">ChatBot</span>
          </Link>
          <Link to="/news" className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-white whitespace-nowrap">
            <FiRadio size={18} />
            <span className="hidden md:inline">News</span>
          </Link>
          {/* <Link to="/screener" className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-white whitespace-nowrap">
            <FiRadio size={18} />
            <span className="hidden md:inline">Screener</span>
          </Link> */}
          <Link to="/analysis" className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-white whitespace-nowrap">
            <FiBarChart2 size={18} />
            <span className="hidden md:inline">Analysis</span>
          </Link>
          <Link to="/about" className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-white whitespace-nowrap">
            <FiInfo size={18} />
            <span className="hidden md:inline">About Us</span>
          </Link>

          {/* Theme Toggle */}
          <button
            onClick={() => dispatch(toggleTheme())}
            className="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
          >
            {theme === 'light' ? <FaSun size={18} /> : <FaMoon size={18} />}
          </button>

          {/* User Dropdown or Sign In */}
          {currentUser ? (
            <Dropdown
              arrowIcon={false}
              inline
              label={
                <Avatar 
                  alt="user" 
                  img={currentUser.profilePicture} 
                  rounded 
                  className="cursor-pointer "
                />
              }
              className="z-50 dark:bg-gray-800 dark:border-gray-700"
            >
              <Dropdown.Header className="bg-gray-100 dark:bg-gray-800 border-b dark:border-gray-700">
                <span className="block text-sm text-gray-900 dark:text-white">@{currentUser.username}</span>
                <span className="block text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                  {currentUser.email}
                </span>
              </Dropdown.Header>
              <Link to="/dashboard?tab=profile">
                <Dropdown.Item className="text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                  Profile
                </Dropdown.Item>
              </Link>
              <Dropdown.Divider className="border-gray-200 dark:border-gray-700" />
              <Dropdown.Item 
                onClick={handleSignout}
                className="text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Sign out
              </Dropdown.Item>
            </Dropdown>
          ) : (
            <Link to="/sign-in" className="whitespace-nowrap">
              <button className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm text-white transition-colors dark:bg-blue-500 dark:hover:bg-blue-600">
                Sign Up / Login
              </button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}