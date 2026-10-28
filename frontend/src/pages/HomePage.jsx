import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Play,
  Ticket,
  Star,
  Clock,
  Sparkles,
  ShieldCheck,
  Zap,
  Smartphone,
  ChevronRight,
  Flame,
} from 'lucide-react';
import api from '../services/api';
import { useCity } from '../context/CityContext';
import MovieCard from '../components/MovieCard';
import TrailerModal from '../components/TrailerModal';

const GENRES = ['All', 'Action', 'Sci-Fi', 'Adventure', 'Drama', 'Animation', 'Crime'];

const HomePage = () => {
  const { selectedCity } = useCity();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [heroIndex, setHeroIndex] = useState(0);
  const [trailerModal, setTrailerModal] = useState({ isOpen: false, url: '', title: '' });

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        const res = await api.get('/movies');
        if (res.data.success) {
          setMovies(res.data.movies);
        }
      } catch (err) {
        console.error('Error fetching movies:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  const featuredMovies = movies.slice(0, 3);
  const currentHero = featuredMovies[heroIndex] || movies[0];

  const filteredMovies = movies.filter((m) => {
    if (selectedGenre === 'All') return true;
    return m.genre.some((g) => g.toLowerCase().includes(selectedGenre.toLowerCase()));
  });

  return (
    <div className="min-h-screen bg-[#0b0f19] text-gray-100">
      {/* Hero Banner Section */}
      {currentHero && (
        <div className="relative w-full h-[520px] md:h-[620px] overflow-hidden">
          {/* Background Image with Dark Overlays */}
          <div
            className="absolute inset-0 bg-cover bg-center transition-all duration-700 scale-105"
            style={{
              backgroundImage: `url(${currentHero.backdropUrl || currentHero.posterUrl})`,
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f19] via-[#0b0f19]/70 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0b0f19] via-[#0b0f19]/80 to-transparent" />
          </div>

          {/* Hero Content */}
          <div className="relative max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-16">
            <div className="max-w-2xl space-y-4">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-rose-600/90 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5" /> Trending in {selectedCity}
                </span>
                <span className="px-2.5 py-1 rounded-md bg-black/60 border border-white/10 text-xs font-semibold text-gray-300">
                  {currentHero.certificate || 'UA'}
                </span>
                <div className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-amber-500/20 text-amber-400 text-xs font-bold border border-amber-500/30">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  {currentHero.rating?.toFixed(1) || '8.8'}
                </div>
              </div>

              <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white tracking-tight font-heading">
                {currentHero.title}
              </h1>

              <p className="text-sm md:text-base text-gray-300 line-clamp-3 leading-relaxed">
                {currentHero.description}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-gray-400 pt-1">
                <span>{currentHero.language}</span>
                <span>•</span>
                <span>{currentHero.duration} Minutes</span>
                <span>•</span>
                <span>{currentHero.genre.join(', ')}</span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-3">
                <Link
                  to={`/movie/${currentHero._id}`}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-semibold text-sm flex items-center gap-2 shadow-lg shadow-rose-900/40 hover:scale-105 transition-all"
                >
                  <Ticket className="w-4 h-4" />
                  Book Tickets
                </Link>

                {currentHero.trailerUrl && (
                  <button
                    onClick={() =>
                      setTrailerModal({
                        isOpen: true,
                        url: currentHero.trailerUrl,
                        title: currentHero.title,
                      })
                    }
                    className="px-5 py-3 rounded-xl bg-gray-900/80 hover:bg-gray-800 text-white font-semibold text-sm flex items-center gap-2 border border-gray-700/80 backdrop-blur-md hover:scale-105 transition-all"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    Watch Trailer
                  </button>
                )}
              </div>
            </div>

            {/* Slide Indicators */}
            {featuredMovies.length > 1 && (
              <div className="absolute right-6 bottom-16 hidden md:flex items-center gap-2">
                {featuredMovies.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setHeroIndex(i)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      heroIndex === i ? 'w-8 bg-rose-500' : 'w-2 bg-gray-600 hover:bg-gray-400'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        {/* Genre Filter Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-800/80 pb-6">
          <div>
            <h2 className="text-2xl font-black text-white font-heading">
              Now Showing in <span className="text-rose-500">{selectedCity}</span>
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              Select your favorite movie, pick preferred seats, and enjoy live booking.
            </p>
          </div>

          {/* Genre Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
            {GENRES.map((genre) => (
              <button
                key={genre}
                onClick={() => setSelectedGenre(genre)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedGenre === genre
                    ? 'bg-rose-600 text-white shadow-md shadow-rose-900/30'
                    : 'bg-gray-900 text-gray-400 hover:text-white hover:bg-gray-800 border border-gray-800'
                }`}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>

        {/* Movies Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <div key={n} className="aspect-[2/3] rounded-2xl bg-gray-900 animate-pulse border border-gray-800" />
            ))}
          </div>
        ) : filteredMovies.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredMovies.map((movie) => (
              <MovieCard key={movie._id} movie={movie} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-gray-900/40 rounded-2xl border border-gray-800">
            <p className="text-gray-400 text-sm">No movies found matching category "{selectedGenre}".</p>
            <button
              onClick={() => setSelectedGenre('All')}
              className="mt-3 px-4 py-2 rounded-xl bg-gray-800 text-xs font-semibold text-rose-400 hover:bg-gray-700"
            >
              Show All Movies
            </button>
          </div>
        )}

        {/* Features / Why IMovies */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-10">
          <div className="p-6 rounded-2xl bg-gray-900/60 border border-gray-800/80 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-white text-base">Real-Time Seat Locks</h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              Live Socket.io concurrency ensures zero double-booking. When you click, the seat is held exclusively for you.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-gray-900/60 border border-gray-800/80 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <Smartphone className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-white text-base">Instant QR Digital Ticket</h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              Paperless gate entry with generated high-resolution QR codes directly on your smartphone.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-gray-900/60 border border-gray-800/80 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-white text-base">VIP & Recliner Tiers</h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              Customizable seating layouts: VIP Recliners, Premium Balcony, and Executive Standard views.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-gray-900/60 border border-gray-800/80 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-white text-base">Multi-Channel Checkout</h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              Seamlessly simulate Card, UPI (Google Pay, PhonePe), and Net Banking payments with instant validation.
            </p>
          </div>
        </div>
      </div>

      {/* Trailer Modal */}
      <TrailerModal
        isOpen={trailerModal.isOpen}
        onClose={() => setTrailerModal({ isOpen: false, url: '', title: '' })}
        trailerUrl={trailerModal.url}
        movieTitle={trailerModal.title}
      />
    </div>
  );
};

export default HomePage;
