import React, { useEffect, useState } from 'react';
import { useParams, useLocation, Link, useNavigate } from 'react-router-dom';
import {
  CheckCircle,
  Printer,
  Ticket,
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  ArrowRight,
  Share2,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { QRCodeSVG } from 'qrcode.react';
import api from '../services/api';

const ConfirmationPage = () => {
  const { bookingId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(location.state?.booking || null);
  const [loading, setLoading] = useState(!booking);

  // Trigger celebration confetti
  useEffect(() => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  }, []);

  // Fetch booking if accessed directly
  useEffect(() => {
    const fetchBooking = async () => {
      if (booking) return;
      try {
        const res = await api.get(`/bookings/${bookingId}`);
        if (res.data.success) {
          setBooking(res.data.booking);
        }
      } catch (err) {
        console.error('Error fetching booking ticket:', err);
      } finally {
        setLoading(false);
      }
    };

    if (bookingId) fetchBooking();
  }, [bookingId, booking]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-[#0b0f19]">
        <div className="w-10 h-10 border-4 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <p className="text-gray-400">Booking information not found.</p>
        <Link
          to="/"
          className="mt-4 px-4 py-2 rounded-xl bg-gray-800 text-rose-400 text-xs font-semibold"
        >
          Return to Home
        </Link>
      </div>
    );
  }

  const show = booking.showId || {};
  const movie = show.movieId || {};
  const theatre = show.theatreId || {};

  return (
    <div className="min-h-screen bg-[#0b0f19] text-gray-100 py-10 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Success Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
            <CheckCircle className="w-8 h-8" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white font-heading">
            Booking Confirmed!
          </h1>
          <p className="text-xs text-gray-400">
            Your movie ticket has been booked successfully. Present this digital pass at the theatre entry.
          </p>
        </div>

        {/* Digital Ticket Card (Luxury Boarding Pass Style) */}
        <div
          id="printable-ticket"
          className="relative rounded-3xl bg-gradient-to-b from-gray-900 to-gray-950 border border-gray-800 overflow-hidden shadow-2xl"
        >
          {/* Top Notch Header */}
          <div className="bg-gradient-to-r from-rose-700 via-rose-600 to-amber-600 px-6 py-4 flex items-center justify-between text-white">
            <div className="flex items-center gap-2">
              <Ticket className="w-5 h-5" />
              <span className="font-black text-sm uppercase tracking-wider font-heading">
                IMOVIES ADMIT PASS
              </span>
            </div>
            <span className="text-xs font-mono font-bold bg-black/30 px-2.5 py-1 rounded-md">
              REF: {booking.bookingId}
            </span>
          </div>

          {/* Ticket Body */}
          <div className="p-6 space-y-6">
            {/* Movie Header */}
            <div className="flex gap-4">
              <img
                src={movie.posterUrl}
                alt={movie.title}
                className="w-20 h-28 rounded-xl object-cover border border-gray-800 shadow-md shrink-0"
              />
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 text-[10px] font-bold uppercase">
                    {show.screenType || 'IMAX 2D'}
                  </span>
                  <span className="text-[10px] text-gray-400 font-medium">
                    {movie.certificate || 'UA'} • {movie.language || 'English'}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-white font-heading">{movie.title}</h2>
                <p className="text-xs text-gray-300 font-medium">{theatre.name}</p>
                <p className="text-[11px] text-gray-500 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-rose-500" />
                  {theatre.address || theatre.location?.city}
                </p>
              </div>
            </div>

            {/* Timings & Seat Details Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-gray-950/80 border border-gray-800/80 text-xs">
              <div>
                <span className="text-gray-500 block text-[10px] uppercase font-semibold">Date</span>
                <span className="font-bold text-white">{show.showDate}</span>
              </div>
              <div>
                <span className="text-gray-500 block text-[10px] uppercase font-semibold">Show Time</span>
                <span className="font-bold text-rose-400">{show.showTime}</span>
              </div>
              <div>
                <span className="text-gray-500 block text-[10px] uppercase font-semibold">Screen</span>
                <span className="font-bold text-white">{show.screenName || 'Audi 1'}</span>
              </div>
              <div>
                <span className="text-gray-500 block text-[10px] uppercase font-semibold">Total Paid</span>
                <span className="font-bold text-emerald-400">₹{booking.totalAmount}</span>
              </div>
            </div>

            {/* Reserved Seats List */}
            <div className="p-3.5 rounded-xl bg-gray-900 border border-gray-800 flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">
                  Reserved Seats ({booking.seats?.length})
                </span>
                <span className="text-lg font-black text-rose-500">
                  {booking.seats?.map((s) => s.seatNumber).join(', ')}
                </span>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/30">
                Confirmed
              </span>
            </div>

            {/* QR Code & Barcode Verification */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-dashed border-gray-800">
              <div className="space-y-1 text-center sm:text-left">
                <p className="text-xs font-bold text-white">Scan at Gate for Direct Entry</p>
                <p className="text-[11px] text-gray-400">
                  Transaction: <span className="font-mono text-gray-300">{booking.paymentId}</span>
                </p>
                <p className="text-[10px] text-gray-500">
                  Booked on {new Date(booking.bookingDate || Date.now()).toLocaleDateString()}
                </p>
              </div>

              {/* QR Code Container */}
              <div className="p-2.5 rounded-2xl bg-white shadow-xl shrink-0">
                {booking.qrCodeData?.startsWith('data:image') ? (
                  <img
                    src={booking.qrCodeData}
                    alt="Ticket QR Code"
                    className="w-24 h-24 object-contain"
                  />
                ) : (
                  <QRCodeSVG
                    value={booking.qrCodeData || booking.bookingId}
                    size={96}
                    bgColor="#ffffff"
                    fgColor="#0f172a"
                    level="H"
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={handlePrint}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gray-900 hover:bg-gray-800 text-white text-xs font-bold flex items-center justify-center gap-2 border border-gray-700 transition-all shadow-md"
          >
            <Printer className="w-4 h-4 text-rose-400" />
            Print / Save Ticket (PDF)
          </button>

          <Link
            to="/my-bookings"
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-rose-900/30"
          >
            <Ticket className="w-4 h-4" />
            View in My Bookings
          </Link>

          <Link
            to="/"
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gray-950 hover:bg-gray-900 text-gray-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-2 border border-gray-800"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationPage;
