import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Star,
  Clock,
  Calendar,
  Play,
  MapPin,
  Sparkles,
  ChevronRight,
  Info,
  Shield,
} from 'lucide-react';
import api from '../services/api';
import { useCity } from '../context/CityContext';
import TrailerModal from '../components/TrailerModal';

const MovieDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { selectedCity } = useCity();

  const [movie, setMovie] = useState(null);
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState('');
  const [datesList, setDatesList] = useState([]);
  const [trailerModal, setTrailerModal] = useState(false);

  // Generate next 5 dates
  useEffect(() => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 5; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const iso = d.toISOString().split('T')[0];
      const dayName = i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : d.toLocaleDateString('en-US', { weekday: 'short' });
      const dayNum = d.getDate();
      const monthName = d.toLocaleDateString('en-US', { month: 'short' });
      dates.push({ iso, dayName, dayNum, monthName });
    }
    setDatesList(dates);
    if (dates.length > 0) {
      setSelectedDate(dates[0].iso);
    }
  }, []);

  // Fetch movie details
  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const res = await api.get(`/movies/${id}`);
        if (res.data.success) {
          setMovie(res.data.movie);
        }
      } catch (err) {
        console.error('Failed to fetch movie details:', err);
      }
    };

    if (id) fetchMovie();
  }, [id]);

  // Fetch shows when movie or date or city changes
  useEffect(() => {
    const fetchShows = async () => {
      if (!id || !selectedDate) return;
      setLoading(true);
      try {
        const res = await api.get(`/shows?movieId=${id}&date=${selectedDate}&city=${encodeURIComponent(selectedCity)}`);
        if (res.data.success) {
          setShows(res.data.shows);
        }
      } catch (err) {
        console.error('Failed to fetch shows:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchShows();
  }, [id, selectedDate, selectedCity]);

  // Group shows by Theatre
  const groupedTheatres = {};
  shows.forEach((show) => {
    const tId = show.theatreId?._id || 'unknown';
    if (!groupedTheatres[tId]) {
      groupedTheatres[tId] = {
        theatre: show.theatreId,
        shows: [],
      };
    }
    groupedTheatres[tId].shows.push(show);
  });

  if (!movie) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-[#0b0f19]">
        <div className="w-10 h-10 border-4 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0f19] text-gray-100 pb-20">
      {/* Backdrop Header */}
      <div className="relative w-full h-[400px] md:h-[480px] overflow-hidden bg-gray-950">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40 blur-sm scale-105"
          style={{ backgroundImage: `url(${movie.backdropUrl || movie.posterUrl})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f19] via-[#0b0f19]/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0b0f19] via-[#0b0f19]/60 to-transparent" />

        <div className="relative max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-8">
          <div className="flex flex-col md:flex-row items-start md:items-end gap-6 md:gap-8">
            {/* Poster Thumbnail */}
            <div className="hidden sm:block w-48 md:w-56 aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl border-2 border-gray-700/60 bg-gray-900 shrink-0">
              <img
                src={movie.posterUrl}
                alt={movie.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Info Block */}
            <div className="space-y-3 max-w-3xl">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-md bg-rose-600 text-white text-xs font-bold uppercase tracking-wider">
                  {movie.certificate || 'UA'}
                </span>
                <div className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-amber-500/20 text-amber-400 text-xs font-bold border border-amber-500/30">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  {movie.rating ? movie.rating.toFixed(1) : '8.5'}/10
                </div>
                <span className="text-xs text-gray-400">({movie.votes?.toLocaleString() || '15,000'} votes)</span>
              </div>

              <h1 className="text-3xl md:text-5xl font-black text-white font-heading">
                {movie.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-gray-300">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-rose-500" /> {movie.duration} mins
                </span>
                <span>•</span>
                <span>{Array.isArray(movie.genre) ? movie.genre.join(', ') : movie.genre}</span>
                <span>•</span>
                <span>{movie.language}</span>
                {movie.director && (
                  <>
                    <span>•</span>
                    <span>Dir: {movie.director}</span>
                  </>
                )}
              </div>

              <p className="text-xs md:text-sm text-gray-300 leading-relaxed pt-1">
                {movie.description}
              </p>

              {movie.trailerUrl && (
                <div className="pt-2">
                  <button
                    onClick={() => setTrailerModal(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-900/90 hover:bg-gray-800 text-white text-xs font-semibold border border-gray-700 transition-all hover:scale-105"
                  >
                    <Play className="w-3.5 h-3.5 fill-white text-white" />
                    Watch Official Trailer
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-10">
        {/* Cast & Crew Section */}
        {movie.cast && movie.cast.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-white font-heading">Cast & Crew</h3>
            <div className="flex items-center gap-4 overflow-x-auto pb-2 scrollbar-none">
              {movie.cast.map((actor, idx) => (
                <div
                  key={idx}
                  className="w-28 shrink-0 text-center space-y-2 p-2 rounded-xl bg-gray-900/40 border border-gray-800/60"
                >
                  <img
                    src={actor.image || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
                    alt={actor.name}
                    className="w-16 h-16 rounded-full mx-auto object-cover border border-gray-700"
                  />
                  <div>
                    <p className="text-xs font-semibold text-white truncate">{actor.name}</p>
                    <p className="text-[10px] text-gray-400 truncate">{actor.role || 'Actor'}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Date Selector Strip */}
        <div className="bg-gray-900/80 border border-gray-800 rounded-2xl p-4 sticky top-16 z-30 backdrop-blur-md">
          <div className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-xs font-semibold text-gray-400 mr-2 flex items-center gap-1.5 whitespace-nowrap">
              <Calendar className="w-4 h-4 text-rose-500" /> Show Date:
            </span>
            {datesList.map((d) => (
              <button
                key={d.iso}
                onClick={() => setSelectedDate(d.iso)}
                className={`flex flex-col items-center justify-center min-w-[76px] py-2 px-3 rounded-xl transition-all ${
                  selectedDate === d.iso
                    ? 'bg-gradient-to-b from-rose-600 to-rose-700 text-white shadow-lg shadow-rose-950/40 font-bold scale-105'
                    : 'bg-gray-950 text-gray-400 hover:text-white hover:bg-gray-800 border border-gray-800'
                }`}
              >
                <span className="text-[10px] uppercase tracking-wider">{d.dayName}</span>
                <span className="text-base font-extrabold">{d.dayNum}</span>
                <span className="text-[9px] uppercase">{d.monthName}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Theatres & Showtimes Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white font-heading">
              Available Theatres in <span className="text-rose-500">{selectedCity}</span>
            </h2>
            <span className="text-xs text-gray-400">
              Showing schedules for {selectedDate}
            </span>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-32 rounded-2xl bg-gray-900 animate-pulse border border-gray-800" />
              ))}
            </div>
          ) : Object.keys(groupedTheatres).length > 0 ? (
            <div className="space-y-4">
              {Object.values(groupedTheatres).map(({ theatre, shows: tShows }) => (
                <div
                  key={theatre?._id || Math.random()}
                  className="bg-gray-900/60 rounded-2xl p-5 border border-gray-800/80 hover:border-gray-700 transition-all space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-gray-800">
                    <div>
                      <h4 className="text-base font-bold text-white font-heading">
                        {theatre?.name || 'Multiplex Cinema'}
                      </h4>
                      <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-rose-500" />
                        {theatre?.address || theatre?.location?.city}
                      </p>
                    </div>

                    {/* Facilities chips */}
                    <div className="flex flex-wrap items-center gap-1.5">
                      {theatre?.facilities?.slice(0, 2).map((fac, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded bg-gray-950 border border-gray-800 text-[10px] text-gray-300"
                        >
                          {fac}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Showtimes Buttons */}
                  <div className="flex flex-wrap items-center gap-3">
                    {tShows.map((show) => {
                      const availableSeats = show.seatMatrix?.filter(
                        (s) => s.status === 'available'
                      ).length;
                      const isFillingFast = availableSeats < 25;

                      return (
                        <button
                          key={show._id}
                          onClick={() => navigate(`/seat-selection/${show._id}`)}
                          className="group relative flex flex-col items-center justify-center px-4 py-2 rounded-xl bg-gray-950 hover:bg-rose-600 border border-gray-800 hover:border-rose-500 transition-all duration-200 hover:scale-105 shadow-sm"
                        >
                          <span className="text-sm font-bold text-white group-hover:text-white">
                            {show.showTime}
                          </span>
                          <span className="text-[10px] text-emerald-400 group-hover:text-rose-100 font-medium">
                            {show.screenType || 'IMAX'}
                          </span>
                          {isFillingFast && (
                            <span className="text-[9px] text-amber-400 group-hover:text-amber-200 font-semibold animate-pulse">
                              Fast Filling
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-gray-900/40 rounded-2xl border border-gray-800 space-y-3">
              <p className="text-gray-400 text-sm">
                No scheduled shows found for this movie in <span className="text-rose-400 font-semibold">{selectedCity}</span> on {selectedDate}.
              </p>
              <p className="text-xs text-gray-500">
                Try selecting another date or change your city from the top navigation bar.
              </p>
            </div>
          )}
        </div>
      </div>

      <TrailerModal
        isOpen={trailerModal}
        onClose={() => setTrailerModal(false)}
        trailerUrl={movie.trailerUrl}
        movieTitle={movie.title}
      />
    </div>
  );
};

export default MovieDetailsPage;
