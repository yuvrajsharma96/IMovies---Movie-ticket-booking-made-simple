import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, SlidersHorizontal } from 'lucide-react';
import api from '../services/api';
import MovieCard from '../components/MovieCard';

const GENRES = ['All', 'Action', 'Sci-Fi', 'Adventure', 'Drama', 'Animation', 'Crime', 'Biography'];
const LANGUAGES = ['All', 'English', 'Hindi', 'Tamil', 'Telugu'];

const MoviesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(initialSearch);
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [selectedLanguage, setSelectedLanguage] = useState('All');
  const [sortBy, setSortBy] = useState('default');

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        let url = `/movies?`;
        if (search) url += `search=${encodeURIComponent(search)}&`;
        if (selectedGenre !== 'All') url += `genre=${encodeURIComponent(selectedGenre)}&`;
        if (selectedLanguage !== 'All') url += `language=${encodeURIComponent(selectedLanguage)}&`;
        if (sortBy !== 'default') url += `sort=${sortBy}&`;

        const res = await api.get(url);
        if (res.data.success) {
          setMovies(res.data.movies);
        }
      } catch (err) {
        console.error('Error fetching movies:', err);
      } finally {
        setLoading(false);
      }
    };

    const delayDebounce = setTimeout(() => {
      fetchMovies();
    }, 250);

    return () => clearTimeout(delayDebounce);
  }, [search, selectedGenre, selectedLanguage, sortBy]);

  return (
    <div className="min-h-screen bg-[#0b0f19] text-gray-100 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Title Header */}
        <div>
          <h1 className="text-3xl font-black text-white font-heading">Explore Movies</h1>
          <p className="text-xs text-gray-400 mt-1">
            Browse through current releases, discover blockbusters, and reserve your seats.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-gray-900/70 border border-gray-800 rounded-2xl p-4 sm:p-5 space-y-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search by movie title, director, or cast..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-gray-950 text-sm text-gray-200 placeholder-gray-500 rounded-xl pl-10 pr-4 py-2.5 border border-gray-800 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
              />
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
            </div>

            {/* Language Selector */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400 whitespace-nowrap">Language:</span>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="bg-gray-950 text-xs font-semibold text-gray-200 rounded-xl px-3 py-2.5 border border-gray-800 focus:outline-none focus:border-rose-500"
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
              </select>
            </div>

            {/* Sort Selector */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400 whitespace-nowrap">Sort By:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-gray-950 text-xs font-semibold text-gray-200 rounded-xl px-3 py-2.5 border border-gray-800 focus:outline-none focus:border-rose-500"
              >
                <option value="default">Latest Additions</option>
                <option value="rating">Top Rated</option>
                <option value="releaseDate">Release Date</option>
              </select>
            </div>
          </div>

          {/* Genre Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-xs text-gray-400 mr-1 flex items-center gap-1">
              <Filter className="w-3 h-3 text-rose-500" /> Genre:
            </span>
            {GENRES.map((genre) => (
              <button
                key={genre}
                onClick={() => setSelectedGenre(genre)}
                className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedGenre === genre
                    ? 'bg-rose-600 text-white shadow-sm shadow-rose-900/40'
                    : 'bg-gray-950 text-gray-400 hover:text-white hover:bg-gray-800 border border-gray-800'
                }`}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>

        {/* Results Info */}
        <div className="flex items-center justify-between text-xs text-gray-400 px-1">
          <span>Found <strong className="text-white">{movies.length}</strong> movies</span>
          {(search || selectedGenre !== 'All' || selectedLanguage !== 'All') && (
            <button
              onClick={() => {
                setSearch('');
                setSelectedGenre('All');
                setSelectedLanguage('All');
                setSortBy('default');
              }}
              className="text-rose-400 hover:underline"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Movies Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <div key={n} className="aspect-[2/3] rounded-2xl bg-gray-900 animate-pulse border border-gray-800" />
            ))}
          </div>
        ) : movies.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {movies.map((movie) => (
              <MovieCard key={movie._id} movie={movie} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-gray-900/40 rounded-2xl border border-gray-800">
            <p className="text-gray-400 text-sm">No movies match your current search and filter settings.</p>
            <button
              onClick={() => {
                setSearch('');
                setSelectedGenre('All');
                setSelectedLanguage('All');
              }}
              className="mt-4 px-4 py-2 rounded-xl bg-gray-800 text-xs font-semibold text-rose-400 hover:bg-gray-700"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MoviesPage;
