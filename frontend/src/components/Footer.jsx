import React from 'react';
import { Film, Heart, Shield, Sparkles, Github, Twitter, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-950 border-t border-gray-800/80 pt-12 pb-8 text-gray-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-rose-600 to-amber-500 flex items-center justify-center">
                <Film className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-black tracking-tight text-white font-heading">
                I<span className="text-rose-500">MOVIES</span>
              </span>
            </Link>
            <p className="text-xs text-gray-400 leading-relaxed">
              Movie ticket booking made simple, seamless, and lightning fast. Experience cinema like never before with live seat selection, instant QR tickets, and premium formats.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-200 mb-3">
              Explore
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/movies" className="hover:text-rose-400 transition-colors">
                  Now Showing Movies
                </Link>
              </li>
              <li>
                <Link to="/movies" className="hover:text-rose-400 transition-colors">
                  Upcoming Blockbusters
                </Link>
              </li>
              <li>
                <Link to="/my-bookings" className="hover:text-rose-400 transition-colors">
                  Digital Tickets & History
                </Link>
              </li>
            </ul>
          </div>

          {/* Cinema Formats */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-200 mb-3">
              Premium Formats
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {['IMAX 2D', 'Laser IMAX', '4DX', 'Dolby Atmos', 'ScreenX', 'INSIGNIA'].map((fmt) => (
                <span
                  key={fmt}
                  className="px-2 py-0.5 rounded bg-gray-900 border border-gray-800 text-[11px] text-gray-300 font-mono"
                >
                  {fmt}
                </span>
              ))}
            </div>
          </div>

          {/* Technology & Status */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-200 mb-3">
              MERN Stack Architecture
            </h4>
            <p className="text-xs text-gray-400 mb-2">
              Real-time seat locking via Socket.io, JWT Authentication, and verified QR code ticketing.
            </p>
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              All Systems Operational
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} IMovies Platform. Crafted with React & Node.js.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-gray-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-gray-400 cursor-pointer">Terms of Service</span>
            <span className="hover:text-gray-400 cursor-pointer">Security</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
