const QRCode = require('qrcode');
const Booking = require('../models/Booking');
const Show = require('../models/Show');
const User = require('../models/User');

// @desc    Temporarily lock selected seats (real-time concurrency control)
// @route   POST /api/bookings/lock-seats
// @access  Private
exports.lockSeats = async (req, res, next) => {
  try {
    const { showId, seatNumbers } = req.body;
    const userId = req.user.id;

    if (!showId || !seatNumbers || !Array.isArray(seatNumbers) || seatNumbers.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide valid showId and an array of seat numbers to lock.',
      });
    }

    const show = await Show.findById(showId);
    if (!show) {
      return res.status(404).json({ success: false, message: 'Show not found' });
    }

    // Clean expired locks first
    show.cleanExpiredLocks(10);

    // Check if any seat is already booked or locked by someone else
    const unavailableSeats = [];
    show.seatMatrix.forEach((seat) => {
      if (seatNumbers.includes(seat.seatNumber)) {
        if (seat.status === 'booked') {
          unavailableSeats.push(`${seat.seatNumber} (Already Booked)`);
        } else if (
          seat.status === 'locked' &&
          seat.lockedBy &&
          seat.lockedBy.toString() !== userId.toString()
        ) {
          unavailableSeats.push(`${seat.seatNumber} (Held by another customer)`);
        }
      }
    });

    if (unavailableSeats.length > 0) {
      return res.status(409).json({
        success: false,
        message: `Seats unavailable: ${unavailableSeats.join(', ')}`,
        unavailableSeats,
      });
    }

    const now = new Date();
    const expiryTime = new Date(now.getTime() + 10 * 60 * 1000);

    // Lock seats
    show.seatMatrix.forEach((seat) => {
      if (seatNumbers.includes(seat.seatNumber)) {
        seat.status = 'locked';
        seat.lockedBy = userId;
        seat.lockedAt = now;
      }
    });

    await show.save();

    // Broadcast socket event if io is attached to app
    const io = req.app.get('socketio');
    if (io) {
      io.to(showId.toString()).emit('seatLocked', {
        showId,
        seatNumbers,
        lockedBy: userId,
        expiryTime,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Seats locked successfully for 10 minutes.',
      showId,
      seatNumbers,
      lockExpiresAt: expiryTime,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Unlock seats (if user navigates away or clears selection)
// @route   POST /api/bookings/unlock-seats
// @access  Private
exports.unlockSeats = async (req, res, next) => {
  try {
    const { showId, seatNumbers } = req.body;
    const userId = req.user.id;

    if (!showId || !seatNumbers || !Array.isArray(seatNumbers)) {
      return res.status(400).json({ success: false, message: 'Invalid payload.' });
    }

    const show = await Show.findById(showId);
    if (!show) {
      return res.status(404).json({ success: false, message: 'Show not found' });
    }

    const unlocked = [];
    show.seatMatrix.forEach((seat) => {
      if (
        seatNumbers.includes(seat.seatNumber) &&
        seat.status === 'locked' &&
        seat.lockedBy &&
        (seat.lockedBy.toString() === userId.toString() || req.user.role === 'admin')
      ) {
        seat.status = 'available';
        seat.lockedBy = null;
        seat.lockedAt = null;
        unlocked.push(seat.seatNumber);
      }
    });

    await show.save();

    const io = req.app.get('socketio');
    if (io && unlocked.length > 0) {
      io.to(showId.toString()).emit('seatUnlocked', {
        showId,
        seatNumbers: unlocked,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Seats unlocked successfully.',
      unlocked,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Confirm booking, update seat matrix to booked, generate QR ticket
// @route   POST /api/bookings
// @access  Private
exports.createBooking = async (req, res, next) => {
  try {
    const {
      showId,
      seats, // array of { seatNumber, category, price }
      subtotal,
      convenienceFee,
      tax,
      totalAmount,
      paymentMethod,
      paymentId,
      foodAndBeverages,
    } = req.body;
    const userId = req.user.id;

    if (!showId || !seats || !Array.isArray(seats) || seats.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide showId and selected seats list.',
      });
    }

    const show = await Show.findById(showId)
      .populate('movieId')
      .populate('theatreId');

    if (!show) {
      return res.status(404).json({ success: false, message: 'Show not found' });
    }

    const seatNumberList = seats.map((s) => (typeof s === 'string' ? s : s.seatNumber));

    // Check availability
    const conflictingSeats = [];
    show.seatMatrix.forEach((s) => {
      if (seatNumberList.includes(s.seatNumber)) {
        if (s.status === 'booked') {
          conflictingSeats.push(s.seatNumber);
        } else if (
          s.status === 'locked' &&
          s.lockedBy &&
          s.lockedBy.toString() !== userId.toString()
        ) {
          conflictingSeats.push(s.seatNumber);
        }
      }
    });

    if (conflictingSeats.length > 0) {
      return res.status(409).json({
        success: false,
        message: `Seats ${conflictingSeats.join(', ')} are no longer available.`,
      });
    }

    // Mark seats as booked in show
    show.seatMatrix.forEach((s) => {
      if (seatNumberList.includes(s.seatNumber)) {
        s.status = 'booked';
        s.lockedBy = null;
        s.lockedAt = null;
      }
    });

    await show.save();

    const bookingRef = 'IMV-' + Math.random().toString(36).substring(2, 8).toUpperCase();

    // Generate QR Code data URL containing verifiable booking credentials
    const qrPayload = JSON.stringify({
      bookingId: bookingRef,
      movie: show.movieId.title,
      theatre: show.theatreId.name,
      screen: show.screenName,
      date: show.showDate,
      time: show.showTime,
      seats: seatNumberList,
      userEmail: req.user.email,
      totalPaid: totalAmount || subtotal,
      verifyUrl: `https://imovies.app/verify/${bookingRef}`,
    });

    const qrCodeData = await QRCode.toDataURL(qrPayload, {
      errorCorrectionLevel: 'H',
      margin: 2,
      color: {
        dark: '#0f172a',
        light: '#ffffff',
      },
    });

    // Format seat objects
    const seatObjects = seats.map((s) => {
      if (typeof s === 'string') {
        const matrixSeat = show.seatMatrix.find((m) => m.seatNumber === s);
        return {
          seatNumber: s,
          category: matrixSeat ? matrixSeat.category : 'Standard',
          price: matrixSeat ? matrixSeat.price : 250,
        };
      }
      return s;
    });

    const finalSubtotal = subtotal || seatObjects.reduce((sum, s) => sum + s.price, 0);
    const finalFee = convenienceFee !== undefined ? convenienceFee : 45;
    const finalTax = tax !== undefined ? tax : 18;
    const grandTotal = totalAmount || finalSubtotal + finalFee + finalTax;

    const booking = await Booking.create({
      bookingId: bookingRef,
      userId,
      showId,
      seats: seatObjects,
      subtotal: finalSubtotal,
      convenienceFee: finalFee,
      tax: finalTax,
      totalAmount: grandTotal,
      foodAndBeverages: foodAndBeverages || [],
      paymentStatus: 'completed',
      paymentMethod: paymentMethod || 'Card',
      paymentId: paymentId || 'PAY-' + Math.random().toString(36).substring(2, 10).toUpperCase(),
      bookingStatus: 'confirmed',
      bookingDate: new Date(),
      qrCodeData,
    });

    // Add booking to user's history
    await User.findByIdAndUpdate(userId, {
      $push: { bookingHistory: booking._id },
    });

    // Broadcast seats booked to active socket connections in show room
    const io = req.app.get('socketio');
    if (io) {
      io.to(showId.toString()).emit('seatsBooked', {
        showId,
        seatNumbers: seatNumberList,
      });
    }

    const populatedBooking = await Booking.findById(booking._id).populate({
      path: 'showId',
      populate: ['movieId', 'theatreId'],
    });

    res.status(201).json({
      success: true,
      message: 'Booking confirmed successfully! Digital ticket generated.',
      booking: populatedBooking,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's booking history
// @route   GET /api/bookings/my-bookings
// @access  Private
exports.getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ userId: req.user.id })
      .populate({
        path: 'showId',
        populate: ['movieId', 'theatreId'],
      })
      .sort({ bookingDate: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get booking details by ID
// @route   GET /api/bookings/:id
// @access  Private
exports.getBookingById = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('userId', 'name email phone')
      .populate({
        path: 'showId',
        populate: ['movieId', 'theatreId'],
      });

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // Check ownership or admin
    if (
      booking.userId._id.toString() !== req.user.id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized access to this booking ticket.',
      });
    }

    res.status(200).json({
      success: true,
      booking,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel a booking and free up seats
// @route   PUT /api/bookings/:id/cancel
// @access  Private
exports.cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    if (
      booking.userId.toString() !== req.user.id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to cancel this booking.',
      });
    }

    if (booking.bookingStatus === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'This booking has already been cancelled.',
      });
    }

    // Free up seats in Show
    const show = await Show.findById(booking.showId);
    const seatNumbers = booking.seats.map((s) => s.seatNumber);

    if (show) {
      show.seatMatrix.forEach((seat) => {
        if (seatNumbers.includes(seat.seatNumber)) {
          seat.status = 'available';
          seat.lockedBy = null;
          seat.lockedAt = null;
        }
      });
      await show.save();

      const io = req.app.get('socketio');
      if (io) {
        io.to(show._id.toString()).emit('seatUnlocked', {
          showId: show._id,
          seatNumbers,
        });
      }
    }

    booking.bookingStatus = 'cancelled';
    booking.paymentStatus = 'refunded';
    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully. Simulated refund processed.',
      booking,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin Analytics: Total revenue, tickets, and popular movies
// @route   GET /api/bookings/analytics
// @access  Private/Admin
exports.getAdminAnalytics = async (req, res, next) => {
  try {
    const totalBookings = await Booking.countDocuments();
    const confirmedBookings = await Booking.find({ bookingStatus: 'confirmed' });

    const totalRevenue = confirmedBookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
    const totalTicketsSold = confirmedBookings.reduce(
      (sum, b) => sum + (b.seats ? b.seats.length : 0),
      0
    );

    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalShows = await Show.countDocuments();

    // Recent 10 bookings
    const recentBookings = await Booking.find()
      .populate('userId', 'name email')
      .populate({
        path: 'showId',
        populate: ['movieId', 'theatreId'],
      })
      .sort({ bookingDate: -1 })
      .limit(10);

    res.status(200).json({
      success: true,
      metrics: {
        totalRevenue,
        totalBookings,
        totalTicketsSold,
        totalUsers,
        totalShows,
      },
      recentBookings,
    });
  } catch (error) {
    next(error);
  }
};
