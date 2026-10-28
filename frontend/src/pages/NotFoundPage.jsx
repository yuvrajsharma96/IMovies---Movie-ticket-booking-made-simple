import React from 'react';
import { Link } from 'react-router-dom';
import { Film, Home } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center px-4 text-center bg-[#0b0f19]">
      <div className="w-16 h-16 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center mb-4">
        <Film className="w-8 h-8" />
      </div>
      <h1 className="text-4xl font-black text-white font-heading">404</h1>
      <p className="text-sm text-gray-400 mt-2 max-w-sm">
        The cinematic scene or page you are looking for does not exist or has ended its theatrical run.
      </p>
      <Link
        to="/"
        className="mt-6 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-rose-900/30 transition-all hover:scale-105"
      >
        <Home className="w-4 h-4" />
        Return to Home
      </Link>
    </div>
  );
};

export default NotFoundPage;
