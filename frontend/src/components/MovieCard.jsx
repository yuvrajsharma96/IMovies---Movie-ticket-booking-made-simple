import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock, Ticket } from 'lucide-react';

const MovieCard = ({ movie }) => {
  if (!movie) return null;

  return (
    <div className="group relative bg-gray-900/60 rounded-2xl overflow-hidden border border-gray-800/80 hover:border-rose-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-rose-950/30 flex flex-col">
      {/* Poster Image Container */}
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-gray-950">
        <img
          src={movie.posterUrl}
          alt={movie.title}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-black/40 opacity-80 group-hover:opacity-60 transition-opacity" />

        {/* Badges Top Left/Right */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          <span className="px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-[11px] font-bold text-gray-200 border border-white/10 uppercase">
            {movie.certificate || 'UA'}
          </span>
          <span className="px-2 py-0.5 rounded-md bg-rose-600/90 backdrop-blur-md text-[11px] font-semibold text-white uppercase tracking-wider">
            {movie.language}
          </span>
        </div>

        {/* Rating Badge Top Right */}
        <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-md border border-amber-500/30 text-amber-400 font-bold text-xs">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span>{movie.rating ? movie.rating.toFixed(1) : '8.5'}</span>
        </div>

        {/* Quick Duration Overlay Bottom Left */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1 text-[11px] text-gray-300 bg-black/50 backdrop-blur-sm px-2 py-0.5 rounded">
          <Clock className="w-3 h-3 text-rose-400" />
          <span>{movie.duration} mins</span>
        </div>
      </div>

      {/* Content Container */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <h3 className="text-base font-bold text-white group-hover:text-rose-400 transition-colors line-clamp-1 font-heading">
            {movie.title}
          </h3>
          <p className="text-xs text-gray-400 mt-1 line-clamp-1">
            {Array.isArray(movie.genre) ? movie.genre.join(' • ') : movie.genre}
          </p>
        </div>

        <Link
          to={`/movie/${movie._id}`}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white text-xs font-semibold shadow-md shadow-rose-900/20 group-hover:shadow-rose-600/40 transition-all"
        >
          <Ticket className="w-3.5 h-3.5" />
          <span>Book Tickets</span>
        </Link>
      </div>
    </div>
  );
};

export default MovieCard;
