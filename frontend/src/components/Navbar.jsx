import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Film,
  MapPin,
  Search,
  User,
  Shield,
  Ticket,
  LogOut,
  ChevronDown,
  Menu,
  X,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCity } from '../context/CityContext';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout, login } = useAuth();
  const { selectedCity, changeCity, cities } = useCity();
  const [searchTerm, setSearchTerm] = useState('');
  const [isCityOpen, setIsCityOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/movies?search=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm('');
      setMobileMenuOpen(false);
    }
  };

  const handleQuickDemoLogin = async (role) => {
    try {
      if (role === 'admin') {
        await login('admin@imovies.com', 'admin123');
      } else {
        await login('user@imovies.com', 'user123');
      }
      setIsProfileOpen(false);
    } catch (err) {
      console.error('Quick login failed:', err);
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-[#0b0f19]/90 backdrop-blur-md border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 to-amber-500 flex items-center justify-center shadow-lg shadow-rose-500/20 group-hover:scale-105 transition-transform">
                <Film className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black tracking-tight text-white font-heading">
                  I<span className="text-rose-500">MOVIES</span>
                </span>
                <span className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold -mt-1">
                  Ticket Booking
                </span>
              </div>
            </Link>

            {/* Location Selector */}
            <div className="relative">
              <button
                onClick={() => setIsCityOpen(!isCityOpen)}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-800/80 hover:bg-gray-800 text-gray-300 text-sm font-medium border border-gray-700/60 transition-colors"
              >
                <MapPin className="w-3.5 h-3.5 text-rose-500" />
                <span>{selectedCity}</span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
              </button>

              {isCityOpen && (
                <div className="absolute left-0 mt-2 w-48 rounded-xl bg-gray-900 border border-gray-800 shadow-2xl py-2 z-50">
                  <div className="px-3 py-1 text-xs font-semibold uppercase tracking-wider text-gray-400 border-b border-gray-800 mb-1">
                    Select Your City
                  </div>
                  {cities.map((city) => (
                    <button
                      key={city}
                      onClick={() => {
                        changeCity(city);
                        setIsCityOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm flex items-center justify-between hover:bg-gray-800 transition-colors ${
                        selectedCity === city
                          ? 'text-rose-400 font-semibold bg-rose-500/10'
                          : 'text-gray-300'
                      }`}
                    >
                      {city}
                      {selectedCity === city && (
                        <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-6">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <input
                type="text"
                placeholder="Search movies, genres, or directors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-900/90 text-sm text-gray-200 placeholder-gray-500 rounded-full pl-10 pr-4 py-2 border border-gray-800 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all"
              />
              <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-gray-400" />
            </form>
          </div>

          {/* Navigation Links & User Menu */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              to="/movies"
              className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
            >
              Movies
            </Link>

            {isAdmin && (
              <Link
                to="/admin"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-semibold hover:bg-amber-500/20 transition-colors"
              >
                <Shield className="w-3.5 h-3.5" />
                Admin Panel
              </Link>
            )}

            {/* Auth section */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2.5 p-1 rounded-full hover:ring-2 hover:ring-rose-500/50 transition-all"
                >
                  <img
                    src={user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80'}
                    alt={user?.name}
                    className="w-8 h-8 rounded-full object-cover border border-gray-700"
                  />
                  <span className="text-sm font-medium text-gray-200 max-w-[100px] truncate">
                    {user?.name?.split(' ')[0]}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-xl bg-gray-900 border border-gray-800 shadow-2xl py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-800">
                      <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
                      <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-rose-500/20 text-rose-400">
                        {user?.role}
                      </span>
                    </div>

                    <Link
                      to="/my-bookings"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-800 hover:text-white"
                    >
                      <Ticket className="w-4 h-4 text-rose-500" />
                      My Bookings
                    </Link>

                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-amber-400 hover:bg-gray-800"
                      >
                        <Shield className="w-4 h-4" />
                        Admin Dashboard
                      </Link>
                    )}

                    <button
                      onClick={() => {
                        logout();
                        setIsProfileOpen(false);
                      }}
                      className="w-full text-left flex items-center gap-2.5 px-4 py-2.5 text-sm text-rose-400 hover:bg-gray-800 border-t border-gray-800 mt-1"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-sm font-semibold shadow-lg shadow-rose-600/30 transition-all hover:scale-105"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-800 bg-gray-950 px-4 pt-3 pb-6 space-y-3">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Search movies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-900 text-sm text-gray-200 placeholder-gray-500 rounded-lg pl-10 pr-4 py-2 border border-gray-800"
            />
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          </form>

          <div className="flex items-center justify-between py-2 border-b border-gray-800">
            <span className="text-sm text-gray-400">Current City:</span>
            <select
              value={selectedCity}
              onChange={(e) => changeCity(e.target.value)}
              className="bg-gray-900 text-sm text-rose-400 font-semibold rounded px-2 py-1 border border-gray-700"
            >
              {cities.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1 pt-1">
            <Link
              to="/movies"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-800 hover:text-white"
            >
              All Movies
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to="/my-bookings"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-800"
                >
                  My Bookings
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-md text-base font-medium text-amber-400 hover:bg-gray-800"
                  >
                    Admin Dashboard
                  </Link>
                )}
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-rose-500 hover:bg-gray-800"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <div className="pt-2 flex flex-col gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-lg bg-gray-800 text-white font-medium text-sm"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-lg bg-rose-600 text-white font-semibold text-sm shadow-md"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
