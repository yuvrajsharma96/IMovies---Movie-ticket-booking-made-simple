import React, { useState, useEffect } from 'react';
import {
  DollarSign,
  Ticket,
  Film,
  Calendar,
  Users,
  Plus,
  Trash2,
  TrendingUp,
  Clock,
  MapPin,
  CheckCircle,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import api from '../services/api';

const AdminDashboardPage = () => {
  const [activeTab, setActiveTab] = useState('analytics'); // 'analytics' | 'movies' | 'theatres' | 'shows'
  const [analytics, setAnalytics] = useState(null);
  const [movies, setMovies] = useState([]);
  const [theatres, setTheatres] = useState([]);
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionSuccess, setActionSuccess] = useState('');
  const [actionError, setActionError] = useState('');

  // Movie Form Modal / State
  const [showMovieModal, setShowMovieModal] = useState(false);
  const [movieForm, setMovieForm] = useState({
    title: '',
    genre: 'Action, Sci-Fi',
    language: 'English',
    duration: 150,
    certificate: 'UA',
    posterUrl: '',
    backdropUrl: '',
    trailerUrl: '',
    description: '',
    rating: 8.5,
  });

  // Theatre Form Modal / State
  const [showTheatreModal, setShowTheatreModal] = useState(false);
  const [theatreForm, setTheatreForm] = useState({
    name: '',
    city: 'Mumbai',
    address: '',
    screenType: 'IMAX 2D, Dolby Atmos',
  });

  // Schedule Show Form Modal / State
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [scheduleForm, setScheduleForm] = useState({
    movieId: '',
    theatreId: '',
    screenName: 'Audi 1 - IMAX',
    screenType: 'IMAX 2D',
    showDate: new Date().toISOString().split('T')[0],
    showTime: '07:30 PM',
    vipPrice: 450,
    premiumPrice: 320,
    standardPrice: 220,
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [anRes, movRes, theRes, shoRes] = await Promise.all([
        api.get('/bookings/analytics'),
        api.get('/movies'),
        api.get('/theatres'),
        api.get('/shows'),
      ]);

      if (anRes.data.success) setAnalytics(anRes.data);
      if (movRes.data.success) setMovies(movRes.data.movies);
      if (theRes.data.success) setTheatres(theRes.data.theatres);
      if (shoRes.data.success) setShows(shoRes.data.shows);
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateMovie = async (e) => {
    e.preventDefault();
    setActionError('');
    try {
      const genreArray = movieForm.genre.split(',').map((g) => g.trim());
      const res = await api.post('/movies', {
        ...movieForm,
        genre: genreArray,
      });
      if (res.data.success) {
        setActionSuccess('Movie added successfully!');
        setShowMovieModal(false);
        loadData();
      }
    } catch (err) {
      setActionError(err.response?.data?.message || 'Failed to add movie');
    }
  };

  const handleDeleteMovie = async (id) => {
    if (!window.confirm('Are you sure you want to delete this movie?')) return;
    try {
      await api.delete(`/movies/${id}`);
      setActionSuccess('Movie deleted successfully');
      loadData();
    } catch (err) {
      setActionError(err.response?.data?.message || 'Failed to delete movie');
    }
  };

  const handleCreateTheatre = async (e) => {
    e.preventDefault();
    setActionError('');
    try {
      const screenArray = theatreForm.screenType.split(',').map((s) => s.trim());
      const res = await api.post('/theatres', {
        name: theatreForm.name,
        location: { city: theatreForm.city },
        address: theatreForm.address,
        screenType: screenArray,
      });
      if (res.data.success) {
        setActionSuccess('Theatre created successfully!');
        setShowTheatreModal(false);
        loadData();
      }
    } catch (err) {
      setActionError(err.response?.data?.message || 'Failed to add theatre');
    }
  };

  const handleDeleteTheatre = async (id) => {
    if (!window.confirm('Are you sure you want to delete this theatre?')) return;
    try {
      await api.delete(`/theatres/${id}`);
      setActionSuccess('Theatre removed successfully');
      loadData();
    } catch (err) {
      setActionError(err.response?.data?.message || 'Failed to delete theatre');
    }
  };

  const handleScheduleShow = async (e) => {
    e.preventDefault();
    setActionError('');
    try {
      const res = await api.post('/shows', {
        movieId: scheduleForm.movieId,
        theatreId: scheduleForm.theatreId,
        screenName: scheduleForm.screenName,
        screenType: scheduleForm.screenType,
        showDate: scheduleForm.showDate,
        showTime: scheduleForm.showTime,
        ticketPrice: {
          vip: Number(scheduleForm.vipPrice),
          premium: Number(scheduleForm.premiumPrice),
          standard: Number(scheduleForm.standardPrice),
        },
      });
      if (res.data.success) {
        setActionSuccess('Show scheduled successfully with auto-generated seat matrix!');
        setShowScheduleModal(false);
        loadData();
      }
    } catch (err) {
      setActionError(err.response?.data?.message || 'Failed to schedule show');
    }
  };

  const handleDeleteShow = async (id) => {
    if (!window.confirm('Delete this show schedule?')) return;
    try {
      await api.delete(`/shows/${id}`);
      setActionSuccess('Show schedule removed successfully');
      loadData();
    } catch (err) {
      setActionError(err.response?.data?.message || 'Failed to delete show');
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-gray-100 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-400 text-[10px] font-bold uppercase tracking-wider">
                Admin Console
              </span>
            </div>
            <h1 className="text-3xl font-black text-white font-heading mt-1">
              Cinema Management Portal
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setShowMovieModal(true);
                setActionError('');
              }}
              className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-rose-900/30 transition-all"
            >
              <Plus className="w-4 h-4" /> Add Movie
            </button>
            <button
              onClick={() => {
                setShowScheduleModal(true);
                setActionError('');
              }}
              className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-amber-900/30 transition-all"
            >
              <Plus className="w-4 h-4" /> Schedule Show
            </button>
          </div>
        </div>

        {/* Notifications */}
        {actionSuccess && (
          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span>{actionSuccess}</span>
            </div>
            <button onClick={() => setActionSuccess('')}>✕</button>
          </div>
        )}
        {actionError && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              <span>{actionError}</span>
            </div>
            <button onClick={() => setActionError('')}>✕</button>
          </div>
        )}

        {/* KPI Analytics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gray-900/70 p-5 rounded-2xl border border-gray-800 space-y-2">
            <div className="flex items-center justify-between text-gray-400">
              <span className="text-xs font-semibold">Total Revenue</span>
              <DollarSign className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-2xl font-black text-white">
              ₹{analytics?.metrics?.totalRevenue?.toLocaleString() || '0'}
            </p>
            <span className="text-[10px] text-emerald-400 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> Live Gross Sales
            </span>
          </div>

          <div className="bg-gray-900/70 p-5 rounded-2xl border border-gray-800 space-y-2">
            <div className="flex items-center justify-between text-gray-400">
              <span className="text-xs font-semibold">Total Bookings</span>
              <Ticket className="w-4 h-4 text-rose-400" />
            </div>
            <p className="text-2xl font-black text-white">
              {analytics?.metrics?.totalBookings || '0'}
            </p>
            <span className="text-[10px] text-gray-400">
              {analytics?.metrics?.totalTicketsSold || '0'} Tickets Issued
            </span>
          </div>

          <div className="bg-gray-900/70 p-5 rounded-2xl border border-gray-800 space-y-2">
            <div className="flex items-center justify-between text-gray-400">
              <span className="text-xs font-semibold">Movies In Catalog</span>
              <Film className="w-4 h-4 text-amber-400" />
            </div>
            <p className="text-2xl font-black text-white">{movies.length}</p>
            <span className="text-[10px] text-amber-400">Active screenings</span>
          </div>

          <div className="bg-gray-900/70 p-5 rounded-2xl border border-gray-800 space-y-2">
            <div className="flex items-center justify-between text-gray-400">
              <span className="text-xs font-semibold">Scheduled Shows</span>
              <Calendar className="w-4 h-4 text-purple-400" />
            </div>
            <p className="text-2xl font-black text-white">{shows.length}</p>
            <span className="text-[10px] text-purple-400">Across {theatres.length} Theatres</span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-800 gap-6 text-sm font-bold">
          {[
            { id: 'analytics', label: 'Recent Transactions' },
            { id: 'movies', label: `Manage Movies (${movies.length})` },
            { id: 'theatres', label: `Theatres (${theatres.length})` },
            { id: 'shows', label: `Shows Schedule (${shows.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 transition-colors border-b-2 ${
                activeTab === tab.id
                  ? 'border-rose-500 text-rose-500'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab 1: Recent Transactions */}
        {activeTab === 'analytics' && (
          <div className="bg-gray-900/60 rounded-2xl border border-gray-800 overflow-hidden">
            <div className="p-4 border-b border-gray-800">
              <h3 className="text-sm font-bold text-white">Live Transactions Stream</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-gray-300">
                <thead className="bg-gray-950 text-gray-400 uppercase font-semibold">
                  <tr>
                    <th className="p-3.5">Booking Ref</th>
                    <th className="p-3.5">Customer</th>
                    <th className="p-3.5">Movie / Theatre</th>
                    <th className="p-3.5">Seats</th>
                    <th className="p-3.5">Total Amount</th>
                    <th className="p-3.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {analytics?.recentBookings?.map((b) => (
                    <tr key={b._id} className="hover:bg-gray-800/40">
                      <td className="p-3.5 font-mono text-white font-bold">{b.bookingId}</td>
                      <td className="p-3.5">
                        <p className="font-semibold text-white">{b.userId?.name || 'Customer'}</p>
                        <p className="text-[10px] text-gray-400">{b.userId?.email}</p>
                      </td>
                      <td className="p-3.5">
                        <p className="font-medium text-white">{b.showId?.movieId?.title}</p>
                        <p className="text-[10px] text-gray-400">{b.showId?.theatreId?.name}</p>
                      </td>
                      <td className="p-3.5 font-semibold text-rose-400">
                        {b.seats?.map((s) => s.seatNumber).join(', ')}
                      </td>
                      <td className="p-3.5 font-bold text-white">₹{b.totalAmount}</td>
                      <td className="p-3.5">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            b.bookingStatus === 'confirmed'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          }`}
                        >
                          {b.bookingStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Movies */}
        {activeTab === 'movies' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {movies.map((movie) => (
                <div
                  key={movie._id}
                  className="bg-gray-900/60 p-4 rounded-2xl border border-gray-800 flex gap-4 items-center justify-between"
                >
                  <img
                    src={movie.posterUrl}
                    alt={movie.title}
                    className="w-14 h-20 rounded-lg object-cover border border-gray-800"
                  />
                  <div className="flex-1 space-y-1">
                    <h4 className="text-sm font-bold text-white line-clamp-1">{movie.title}</h4>
                    <p className="text-xs text-gray-400">{movie.language} • {movie.duration}m</p>
                    <p className="text-[10px] text-rose-400">{Array.isArray(movie.genre) ? movie.genre.join(', ') : movie.genre}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteMovie(movie._id)}
                    className="p-2 rounded-lg bg-gray-800 hover:bg-rose-600 text-gray-400 hover:text-white transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Theatres */}
        {activeTab === 'theatres' && (
          <div className="space-y-4">
            <div className="flex justify-end">
              <button
                onClick={() => setShowTheatreModal(true)}
                className="px-3.5 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-white text-xs font-semibold flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4 text-rose-400" /> Add Theatre
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {theatres.map((theatre) => (
                <div
                  key={theatre._id}
                  className="bg-gray-900/60 p-5 rounded-2xl border border-gray-800 space-y-2 flex justify-between items-start"
                >
                  <div className="space-y-1">
                    <h4 className="text-base font-bold text-white">{theatre.name}</h4>
                    <p className="text-xs text-gray-400 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-rose-500" />
                      {theatre.address || theatre.location?.city}
                    </p>
                    <div className="flex gap-1.5 pt-1">
                      {theatre.screenType?.map((s, i) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-gray-950 text-[10px] text-gray-300 border border-gray-800">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteTheatre(theatre._id)}
                    className="p-2 rounded-lg bg-gray-800 hover:bg-rose-600 text-gray-400 hover:text-white transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Shows */}
        {activeTab === 'shows' && (
          <div className="bg-gray-900/60 rounded-2xl border border-gray-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-gray-300">
                <thead className="bg-gray-950 text-gray-400 uppercase font-semibold">
                  <tr>
                    <th className="p-3.5">Movie</th>
                    <th className="p-3.5">Theatre & Screen</th>
                    <th className="p-3.5">Date & Time</th>
                    <th className="p-3.5">Prices (VIP/Prem/Std)</th>
                    <th className="p-3.5">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {shows.map((s) => (
                    <tr key={s._id} className="hover:bg-gray-800/40">
                      <td className="p-3.5 font-bold text-white">{s.movieId?.title}</td>
                      <td className="p-3.5">
                        <p className="font-semibold text-gray-200">{s.theatreId?.name}</p>
                        <p className="text-[10px] text-gray-400">{s.screenName} • {s.screenType}</p>
                      </td>
                      <td className="p-3.5 font-medium text-rose-400">
                        {s.showDate} at {s.showTime}
                      </td>
                      <td className="p-3.5">
                        ₹{s.ticketPrice?.vip} / ₹{s.ticketPrice?.premium} / ₹{s.ticketPrice?.standard}
                      </td>
                      <td className="p-3.5">
                        <button
                          onClick={() => handleDeleteShow(s._id)}
                          className="p-1.5 rounded-lg bg-gray-800 hover:bg-rose-600 text-gray-400 hover:text-white transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Modal: Add Movie */}
      {showMovieModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-bold text-white font-heading">Add New Movie</h3>
            <form onSubmit={handleCreateMovie} className="space-y-3 text-xs">
              <div>
                <label className="text-gray-400 block mb-1">Movie Title</label>
                <input
                  type="text"
                  required
                  value={movieForm.title}
                  onChange={(e) => setMovieForm({ ...movieForm, title: e.target.value })}
                  className="w-full bg-gray-950 rounded-xl p-2.5 border border-gray-800 text-white"
                  placeholder="e.g. Gladiator II"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-gray-400 block mb-1">Genres (comma separated)</label>
                  <input
                    type="text"
                    required
                    value={movieForm.genre}
                    onChange={(e) => setMovieForm({ ...movieForm, genre: e.target.value })}
                    className="w-full bg-gray-950 rounded-xl p-2.5 border border-gray-800 text-white"
                  />
                </div>
                <div>
                  <label className="text-gray-400 block mb-1">Language</label>
                  <input
                    type="text"
                    required
                    value={movieForm.language}
                    onChange={(e) => setMovieForm({ ...movieForm, language: e.target.value })}
                    className="w-full bg-gray-950 rounded-xl p-2.5 border border-gray-800 text-white"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-gray-400 block mb-1">Duration (Minutes)</label>
                  <input
                    type="number"
                    required
                    value={movieForm.duration}
                    onChange={(e) => setMovieForm({ ...movieForm, duration: e.target.value })}
                    className="w-full bg-gray-950 rounded-xl p-2.5 border border-gray-800 text-white"
                  />
                </div>
                <div>
                  <label className="text-gray-400 block mb-1">Rating (out of 10)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={movieForm.rating}
                    onChange={(e) => setMovieForm({ ...movieForm, rating: e.target.value })}
                    className="w-full bg-gray-950 rounded-xl p-2.5 border border-gray-800 text-white"
                  />
                </div>
              </div>
              <div>
                <label className="text-gray-400 block mb-1">Poster Image URL</label>
                <input
                  type="url"
                  required
                  value={movieForm.posterUrl}
                  onChange={(e) => setMovieForm({ ...movieForm, posterUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-gray-950 rounded-xl p-2.5 border border-gray-800 text-white"
                />
              </div>
              <div>
                <label className="text-gray-400 block mb-1">Trailer Embed URL (YouTube)</label>
                <input
                  type="url"
                  value={movieForm.trailerUrl}
                  onChange={(e) => setMovieForm({ ...movieForm, trailerUrl: e.target.value })}
                  placeholder="https://www.youtube.com/embed/..."
                  className="w-full bg-gray-950 rounded-xl p-2.5 border border-gray-800 text-white"
                />
              </div>
              <div>
                <label className="text-gray-400 block mb-1">Synopsis / Description</label>
                <textarea
                  rows="3"
                  required
                  value={movieForm.description}
                  onChange={(e) => setMovieForm({ ...movieForm, description: e.target.value })}
                  className="w-full bg-gray-950 rounded-xl p-2.5 border border-gray-800 text-white"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowMovieModal(false)}
                  className="px-4 py-2 rounded-xl bg-gray-800 text-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-rose-600 text-white font-bold"
                >
                  Add Movie
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Schedule Show */}
      {showScheduleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl max-w-lg w-full p-6 space-y-4">
            <h3 className="text-base font-bold text-white font-heading">Schedule New Show</h3>
            <form onSubmit={handleScheduleShow} className="space-y-3 text-xs">
              <div>
                <label className="text-gray-400 block mb-1">Select Movie</label>
                <select
                  required
                  value={scheduleForm.movieId}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, movieId: e.target.value })}
                  className="w-full bg-gray-950 rounded-xl p-2.5 border border-gray-800 text-white"
                >
                  <option value="">-- Choose Movie --</option>
                  {movies.map((m) => (
                    <option key={m._id} value={m._id}>{m.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-gray-400 block mb-1">Select Theatre</label>
                <select
                  required
                  value={scheduleForm.theatreId}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, theatreId: e.target.value })}
                  className="w-full bg-gray-950 rounded-xl p-2.5 border border-gray-800 text-white"
                >
                  <option value="">-- Choose Theatre --</option>
                  {theatres.map((t) => (
                    <option key={t._id} value={t._id}>{t.name} ({t.location?.city})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-gray-400 block mb-1">Show Date</label>
                  <input
                    type="date"
                    required
                    value={scheduleForm.showDate}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, showDate: e.target.value })}
                    className="w-full bg-gray-950 rounded-xl p-2.5 border border-gray-800 text-white"
                  />
                </div>
                <div>
                  <label className="text-gray-400 block mb-1">Show Time</label>
                  <input
                    type="text"
                    required
                    value={scheduleForm.showTime}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, showTime: e.target.value })}
                    placeholder="e.g. 07:30 PM"
                    className="w-full bg-gray-950 rounded-xl p-2.5 border border-gray-800 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-gray-400 block mb-1">VIP (₹)</label>
                  <input
                    type="number"
                    value={scheduleForm.vipPrice}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, vipPrice: e.target.value })}
                    className="w-full bg-gray-950 rounded-xl p-2.5 border border-gray-800 text-white"
                  />
                </div>
                <div>
                  <label className="text-gray-400 block mb-1">Premium (₹)</label>
                  <input
                    type="number"
                    value={scheduleForm.premiumPrice}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, premiumPrice: e.target.value })}
                    className="w-full bg-gray-950 rounded-xl p-2.5 border border-gray-800 text-white"
                  />
                </div>
                <div>
                  <label className="text-gray-400 block mb-1">Standard (₹)</label>
                  <input
                    type="number"
                    value={scheduleForm.standardPrice}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, standardPrice: e.target.value })}
                    className="w-full bg-gray-950 rounded-xl p-2.5 border border-gray-800 text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowScheduleModal(false)}
                  className="px-4 py-2 rounded-xl bg-gray-800 text-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-600 text-white font-bold"
                >
                  Schedule Show
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Theatre */}
      {showTheatreModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-base font-bold text-white font-heading">Add New Theatre</h3>
            <form onSubmit={handleCreateTheatre} className="space-y-3 text-xs">
              <div>
                <label className="text-gray-400 block mb-1">Theatre Name</label>
                <input
                  type="text"
                  required
                  value={theatreForm.name}
                  onChange={(e) => setTheatreForm({ ...theatreForm, name: e.target.value })}
                  placeholder="e.g. Cinepolis IMAX Orion Mall"
                  className="w-full bg-gray-950 rounded-xl p-2.5 border border-gray-800 text-white"
                />
              </div>
              <div>
                <label className="text-gray-400 block mb-1">City</label>
                <input
                  type="text"
                  required
                  value={theatreForm.city}
                  onChange={(e) => setTheatreForm({ ...theatreForm, city: e.target.value })}
                  className="w-full bg-gray-950 rounded-xl p-2.5 border border-gray-800 text-white"
                />
              </div>
              <div>
                <label className="text-gray-400 block mb-1">Full Address</label>
                <textarea
                  rows="2"
                  required
                  value={theatreForm.address}
                  onChange={(e) => setTheatreForm({ ...theatreForm, address: e.target.value })}
                  className="w-full bg-gray-950 rounded-xl p-2.5 border border-gray-800 text-white"
                />
              </div>
              <div>
                <label className="text-gray-400 block mb-1">Screen Formats (comma separated)</label>
                <input
                  type="text"
                  value={theatreForm.screenType}
                  onChange={(e) => setTheatreForm({ ...theatreForm, screenType: e.target.value })}
                  className="w-full bg-gray-950 rounded-xl p-2.5 border border-gray-800 text-white"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowTheatreModal(false)}
                  className="px-4 py-2 rounded-xl bg-gray-800 text-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-rose-600 text-white font-bold"
                >
                  Save Theatre
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboardPage;
