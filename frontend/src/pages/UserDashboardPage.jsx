import React, { useState, useEffect } from 'react';
import {
  Ticket,
  Calendar,
  Clock,
  MapPin,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Eye,
  User as UserIcon,
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { QRCodeSVG } from 'qrcode.react';

const UserDashboardPage = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('active'); // 'active' | 'past'
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);
  const [notification, setNotification] = useState('');

  const fetchBookings = async () => {
    try {
      const res = await api.get('/bookings/my-bookings');
      if (res.data.success) {
        setBookings(res.data.bookings);
      }
    } catch (err) {
      console.error('Failed to load user bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking? A refund will be initiated.')) {
      return;
    }
    setCancellingId(bookingId);
    try {
      const res = await api.put(`/bookings/${bookingId}/cancel`);
      if (res.data.success) {
        setNotification('Booking successfully cancelled. Refund processed to your source payment method.');
        fetchBookings();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel booking.');
    } finally {
      setCancellingId(null);
    }
  };

  const activeBookings = bookings.filter((b) => b.bookingStatus === 'confirmed');
  const pastBookings = bookings.filter((b) => b.bookingStatus === 'cancelled');

  return (
    <div className="min-h-screen bg-[#0b0f19] text-gray-100 py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* User Profile Header */}
        <div className="bg-gray-900/60 rounded-2xl p-6 border border-gray-800 flex flex-col sm:flex-row items-center sm:items-start gap-5">
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'}
            alt={user?.name}
            className="w-20 h-20 rounded-2xl object-cover border-2 border-rose-500/40 shadow-lg"
          />
          <div className="space-y-1 text-center sm:text-left flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-white font-heading">
                {user?.name}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-400 text-[10px] font-bold uppercase tracking-wider">
                {user?.role}
              </span>
            </div>
            <p className="text-xs text-gray-400">{user?.email}</p>
            {user?.phone && <p className="text-xs text-gray-500">{user.phone}</p>}
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-gray-950 px-4 py-3 rounded-xl border border-gray-800 text-center">
              <span className="text-lg font-black text-white">{bookings.length}</span>
              <p className="text-[10px] uppercase tracking-wider text-gray-400">Total Bookings</p>
            </div>
          </div>
        </div>

        {notification && (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center justify-between">
            <span>{notification}</span>
            <button onClick={() => setNotification('')} className="text-gray-400 hover:text-white">✕</button>
          </div>
        )}

        {/* Tabs */}
        <div className="flex border-b border-gray-800 gap-4">
          <button
            onClick={() => setActiveTab('active')}
            className={`pb-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'active'
                ? 'border-rose-500 text-rose-500'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            <Ticket className="w-4 h-4" />
            Active Bookings ({activeBookings.length})
          </button>
          <button
            onClick={() => setActiveTab('past')}
            className={`pb-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'past'
                ? 'border-rose-500 text-rose-500'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            <XCircle className="w-4 h-4" />
            Cancelled / Past ({pastBookings.length})
          </button>
        </div>

        {/* Bookings List */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2].map((n) => (
              <div key={n} className="h-40 rounded-2xl bg-gray-900 animate-pulse border border-gray-800" />
            ))}
          </div>
        ) : (activeTab === 'active' ? activeBookings : pastBookings).length > 0 ? (
          <div className="space-y-4">
            {(activeTab === 'active' ? activeBookings : pastBookings).map((b) => {
              const show = b.showId || {};
              const movie = show.movieId || {};
              const theatre = show.theatreId || {};

              return (
                <div
                  key={b._id}
                  className="bg-gray-900/60 rounded-2xl p-5 border border-gray-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 hover:border-gray-700 transition-all"
                >
                  <div className="flex gap-4">
                    <img
                      src={movie.posterUrl}
                      alt={movie.title}
                      className="w-16 h-24 rounded-xl object-cover border border-gray-800 shadow shrink-0"
                    />
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] text-gray-400 bg-gray-950 px-2 py-0.5 rounded">
                          {b.bookingId}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            b.bookingStatus === 'confirmed'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          }`}
                        >
                          {b.bookingStatus}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-white font-heading">
                        {movie.title || 'Movie'}
                      </h3>
                      <p className="text-xs text-gray-400">
                        {theatre.name} • {show.screenType}
                      </p>
                      <p className="text-xs text-rose-400 font-semibold">
                        {show.showDate} at {show.showTime}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full md:w-auto justify-between border-t md:border-t-0 border-gray-800 pt-3 md:pt-0">
                    <div className="text-left md:text-right">
                      <p className="text-xs text-gray-400">Seats: <strong className="text-white">{b.seats?.map((s) => s.seatNumber).join(', ')}</strong></p>
                      <p className="text-sm font-black text-rose-500">₹{b.totalAmount}</p>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <button
                        onClick={() => setSelectedTicket(b)}
                        className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5 text-rose-400" />
                        <span>View Pass</span>
                      </button>

                      {b.bookingStatus === 'confirmed' && (
                        <button
                          onClick={() => handleCancelBooking(b._id)}
                          disabled={cancellingId === b._id}
                          className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-semibold transition-colors disabled:opacity-50"
                        >
                          {cancellingId === b._id ? 'Cancelling...' : 'Cancel'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 bg-gray-900/40 rounded-2xl border border-gray-800 space-y-2">
            <Ticket className="w-8 h-8 text-gray-600 mx-auto" />
            <p className="text-gray-400 text-sm">No {activeTab} bookings to display.</p>
          </div>
        )}
      </div>

      {/* Ticket QR Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-md bg-gray-950 border border-gray-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-800">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Digital Pass — {selectedTicket.bookingId}
              </h3>
              <button
                onClick={() => setSelectedTicket(null)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="text-center space-y-3">
              <div className="p-3 bg-white rounded-2xl inline-block shadow-lg">
                {selectedTicket.qrCodeData?.startsWith('data:image') ? (
                  <img
                    src={selectedTicket.qrCodeData}
                    alt="Ticket QR"
                    className="w-36 h-36 object-contain"
                  />
                ) : (
                  <QRCodeSVG
                    value={selectedTicket.qrCodeData || selectedTicket.bookingId}
                    size={144}
                    bgColor="#ffffff"
                    fgColor="#0f172a"
                    level="H"
                  />
                )}
              </div>
              <div>
                <h4 className="text-base font-bold text-white">
                  {selectedTicket.showId?.movieId?.title}
                </h4>
                <p className="text-xs text-rose-400 font-medium">
                  {selectedTicket.showId?.theatreId?.name} • {selectedTicket.showId?.screenName}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Seats: <strong className="text-white">{selectedTicket.seats?.map((s) => s.seatNumber).join(', ')}</strong>
                </p>
              </div>
            </div>

            <button
              onClick={() => setSelectedTicket(null)}
              className="w-full py-2.5 rounded-xl bg-gray-800 text-white text-xs font-semibold hover:bg-gray-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboardPage;
