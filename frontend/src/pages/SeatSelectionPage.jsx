import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Clock,
  Ticket,
  MapPin,
  ChevronLeft,
  AlertCircle,
  ShieldCheck,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import api from '../services/api';
import { getSocket } from '../services/socket';
import { useAuth } from '../context/AuthContext';

const SeatSelectionPage = () => {
  const { showId } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [show, setShow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [lockTimer, setLockTimer] = useState(600); // 10 minutes in seconds

  // Fetch show details
  useEffect(() => {
    const fetchShow = async () => {
      try {
        const res = await api.get(`/shows/${showId}`);
        if (res.data.success) {
          setShow(res.data.show);
        }
      } catch (err) {
        console.error('Error fetching show:', err);
        setErrorMsg('Failed to load show details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (showId) fetchShow();
  }, [showId]);

  // Socket.io Real-Time Synchronization
  useEffect(() => {
    if (!showId) return;
    const socket = getSocket();

    // Join show room
    socket.emit('join-show', showId);

    // When someone locks seats
    const handleSeatLocked = (data) => {
      if (data.showId === showId) {
        setShow((prev) => {
          if (!prev) return prev;
          const updatedMatrix = prev.seatMatrix.map((seat) => {
            if (data.seatNumbers.includes(seat.seatNumber)) {
              return {
                ...seat,
                status: 'locked',
                lockedBy: data.lockedBy,
              };
            }
            return seat;
          });
          return { ...prev, seatMatrix: updatedMatrix };
        });

        // If another user locked a seat we had selected, deselect it
        if (data.lockedBy !== user?._id) {
          setSelectedSeats((prev) =>
            prev.filter((s) => !data.seatNumbers.includes(s.seatNumber))
          );
        }
      }
    };

    // When seats are unlocked
    const handleSeatUnlocked = (data) => {
      if (data.showId === showId) {
        setShow((prev) => {
          if (!prev) return prev;
          const updatedMatrix = prev.seatMatrix.map((seat) => {
            if (data.seatNumbers.includes(seat.seatNumber)) {
              return {
                ...seat,
                status: 'available',
                lockedBy: null,
              };
            }
            return seat;
          });
          return { ...prev, seatMatrix: updatedMatrix };
        });
      }
    };

    // When seats are permanently booked
    const handleSeatsBooked = (data) => {
      if (data.showId === showId) {
        setShow((prev) => {
          if (!prev) return prev;
          const updatedMatrix = prev.seatMatrix.map((seat) => {
            if (data.seatNumbers.includes(seat.seatNumber)) {
              return {
                ...seat,
                status: 'booked',
                lockedBy: null,
              };
            }
            return seat;
          });
          return { ...prev, seatMatrix: updatedMatrix };
        });

        setSelectedSeats((prev) =>
          prev.filter((s) => !data.seatNumbers.includes(s.seatNumber))
        );
      }
    };

    socket.on('seatLocked', handleSeatLocked);
    socket.on('seatUnlocked', handleSeatUnlocked);
    socket.on('seatsBooked', handleSeatsBooked);

    return () => {
      socket.emit('leave-show', showId);
      socket.off('seatLocked', handleSeatLocked);
      socket.off('seatUnlocked', handleSeatUnlocked);
      socket.off('seatsBooked', handleSeatsBooked);
    };
  }, [showId, user]);

  // Lock timer countdown when seats are selected
  useEffect(() => {
    let timer;
    if (selectedSeats.length > 0) {
      timer = setInterval(() => {
        setLockTimer((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setSelectedSeats([]);
            setErrorMsg('Seat reservation hold expired. Please re-select your seats.');
            return 600;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      setLockTimer(600);
    }
    return () => clearInterval(timer);
  }, [selectedSeats.length]);

  const handleSeatClick = (seat) => {
    setErrorMsg('');

    // Check if booked
    if (seat.status === 'booked') return;

    // Check if locked by someone else
    if (
      seat.status === 'locked' &&
      seat.lockedBy &&
      seat.lockedBy.toString() !== user?._id?.toString()
    ) {
      setErrorMsg(`Seat ${seat.seatNumber} is currently reserved by another customer.`);
      return;
    }

    const isAlreadySelected = selectedSeats.some((s) => s.seatNumber === seat.seatNumber);

    if (isAlreadySelected) {
      // Deselect
      const updated = selectedSeats.filter((s) => s.seatNumber !== seat.seatNumber);
      setSelectedSeats(updated);

      // Unlock on server / socket
      const socket = getSocket();
      socket.emit('client-unlock-seats', {
        showId,
        seatNumbers: [seat.seatNumber],
      });
    } else {
      // Maximum 8 seats per booking
      if (selectedSeats.length >= 8) {
        setErrorMsg('You can select a maximum of 8 seats per booking.');
        return;
      }

      const newSelected = [...selectedSeats, seat];
      setSelectedSeats(newSelected);

      // Lock on server / socket
      const socket = getSocket();
      socket.emit('client-lock-seats', {
        showId,
        seatNumbers: [seat.seatNumber],
        userId: user?._id || 'guest',
      });
    }
  };

  const calculateSubtotal = () => {
    return selectedSeats.reduce((sum, s) => sum + s.price, 0);
  };

  const handleProceedToCheckout = async () => {
    if (selectedSeats.length === 0) {
      setErrorMsg('Please select at least one seat to proceed.');
      return;
    }

    if (!isAuthenticated) {
      navigate('/login', {
        state: {
          from: `/seat-selection/${showId}`,
          message: 'Please sign in to complete your ticket booking.',
        },
      });
      return;
    }

    try {
      // Call backend lock API to ensure concurrency lock
      const seatNums = selectedSeats.map((s) => s.seatNumber);
      const res = await api.post('/bookings/lock-seats', {
        showId,
        seatNumbers: seatNums,
      });

      if (res.data.success) {
        navigate('/checkout', {
          state: {
            show,
            selectedSeats,
            subtotal: calculateSubtotal(),
            convenienceFee: 45,
            tax: 18,
          },
        });
      }
    } catch (err) {
      setErrorMsg(
        err.response?.data?.message || 'Some seats were just reserved by another customer. Please select available seats.'
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-[#0b0f19]">
        <div className="w-10 h-10 border-4 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!show) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <p className="text-gray-400">Show details not found.</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-4 py-2 rounded-xl bg-gray-800 text-rose-400 text-xs font-semibold"
        >
          Go Back
        </button>
      </div>
    );
  }

  // Group seat matrix by category and row
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
  const categories = [
    { name: 'VIP Recliners', rows: ['A', 'B'], price: show.ticketPrice?.vip || 450, color: 'text-amber-400' },
    { name: 'Premium Club', rows: ['C', 'D'], price: show.ticketPrice?.premium || 320, color: 'text-rose-400' },
    { name: 'Standard Executive', rows: ['E', 'F', 'G'], price: show.ticketPrice?.standard || 220, color: 'text-blue-400' },
  ];

  const formatTimer = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-gray-100 pb-32">
      {/* Show Header */}
      <div className="bg-gray-950/80 border-b border-gray-800/80 sticky top-16 z-30 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="p-1.5 rounded-lg bg-gray-900 hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-base font-bold text-white font-heading">
                {show.movieId?.title}
              </h2>
              <p className="text-xs text-gray-400 flex items-center gap-2">
                <span>{show.theatreId?.name}</span>
                <span>•</span>
                <span className="text-rose-400 font-semibold">{show.screenType}</span>
                <span>•</span>
                <span>{show.showDate} at {show.showTime}</span>
              </p>
            </div>
          </div>

          {/* Seat Hold Timer */}
          {selectedSeats.length > 0 && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold self-start sm:self-auto animate-pulse">
              <Clock className="w-4 h-4" />
              <span>Seats locked for: {formatTimer(lockTimer)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Seat Map Area */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Error Alert */}
        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-gray-400 bg-gray-900/40 py-3 px-4 rounded-xl border border-gray-800/60">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gray-900 border border-gray-700"></div>
            <span>Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-rose-600 shadow-md shadow-rose-900/50"></div>
            <span className="text-rose-400 font-medium">Selected</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-amber-500/30 border border-amber-500/50 animate-pulse"></div>
            <span className="text-amber-400">Held by others</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gray-800/40 border border-gray-800 text-gray-600 flex items-center justify-center text-[10px]">✕</div>
            <span>Booked</span>
          </div>
        </div>

        {/* Curved Screen Effect */}
        <div className="pt-4 text-center">
          <div className="cinema-screen-curve max-w-xl mx-auto"></div>
          <p className="text-[11px] uppercase tracking-widest text-gray-500 font-semibold mt-2">
            All Eyes This Way • Cinema Projection Screen
          </p>
        </div>

        {/* Seating Categories */}
        <div className="space-y-8 pt-4">
          {categories.map((cat) => (
            <div key={cat.name} className="space-y-3">
              <div className="flex items-center justify-between border-b border-gray-800/80 pb-1.5 text-xs">
                <span className={`font-bold ${cat.color}`}>{cat.name}</span>
                <span className="text-gray-400 font-medium">₹{cat.price}</span>
              </div>

              {/* Rows */}
              <div className="space-y-2">
                {cat.rows.map((rowLetter) => {
                  const rowSeats = show.seatMatrix.filter((s) => s.row === rowLetter);

                  return (
                    <div key={rowLetter} className="flex items-center justify-center gap-2 sm:gap-3">
                      {/* Row Label */}
                      <span className="w-5 text-xs font-bold text-gray-500 text-center">
                        {rowLetter}
                      </span>

                      {/* Seats List */}
                      <div className="flex items-center gap-1.5 sm:gap-2">
                        {rowSeats.map((seat) => {
                          const isSelected = selectedSeats.some(
                            (s) => s.seatNumber === seat.seatNumber
                          );
                          const isBooked = seat.status === 'booked';
                          const isLockedByOther =
                            seat.status === 'locked' &&
                            seat.lockedBy &&
                            seat.lockedBy.toString() !== user?._id?.toString();

                          let buttonStyle = 'bg-gray-900 border border-gray-700/80 hover:border-rose-500 text-gray-300';

                          if (isSelected) {
                            buttonStyle = 'bg-rose-600 border border-rose-500 text-white shadow-md shadow-rose-900/60 font-bold scale-105';
                          } else if (isBooked) {
                            buttonStyle = 'bg-gray-950 border border-gray-800 text-gray-600 cursor-not-allowed';
                          } else if (isLockedByOther) {
                            buttonStyle = 'bg-amber-500/20 border border-amber-500/40 text-amber-300 animate-pulse cursor-not-allowed';
                          }

                          return (
                            <button
                              key={seat.seatNumber}
                              disabled={isBooked || isLockedByOther}
                              onClick={() => handleSeatClick(seat)}
                              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg text-xs font-medium flex items-center justify-center transition-all ${buttonStyle}`}
                              title={`${seat.seatNumber} - ₹${seat.price}`}
                            >
                              {isBooked ? '✕' : seat.col}
                            </button>
                          );
                        })}
                      </div>

                      {/* Row Label Right */}
                      <span className="w-5 text-xs font-bold text-gray-500 text-center">
                        {rowLetter}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Floating Checkout Footer Bar */}
      <div className="fixed bottom-0 inset-x-0 z-40 bg-gray-950/95 border-t border-gray-800 backdrop-blur-md shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-4">
            <div className="flex flex-col">
              <span className="text-xs text-gray-400">
                Selected Seats ({selectedSeats.length}):
              </span>
              <span className="text-sm font-bold text-white">
                {selectedSeats.length > 0
                  ? selectedSeats.map((s) => s.seatNumber).join(', ')
                  : 'No seats selected'}
              </span>
            </div>

            {selectedSeats.length > 0 && (
              <div className="border-l border-gray-800 pl-4 flex flex-col">
                <span className="text-xs text-gray-400">Total Price:</span>
                <span className="text-lg font-black text-rose-500">
                  ₹{calculateSubtotal()}
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleProceedToCheckout}
              disabled={selectedSeats.length === 0}
              className={`w-full sm:w-auto px-8 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg ${
                selectedSeats.length > 0
                  ? 'bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white shadow-rose-900/30 hover:scale-105'
                  : 'bg-gray-800 text-gray-500 cursor-not-allowed shadow-none'
              }`}
            >
              <Ticket className="w-4 h-4" />
              <span>Proceed to Checkout</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeatSelectionPage;
