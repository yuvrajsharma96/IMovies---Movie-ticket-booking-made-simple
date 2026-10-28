const express = require('express');
const router = express.Router();
const {
  lockSeats,
  unlockSeats,
  createBooking,
  getMyBookings,
  getBookingById,
  cancelBooking,
  getAdminAnalytics,
} = require('../controllers/bookingController');
const { protect, verifyAdmin } = require('../middleware/authMiddleware');

router.post('/lock-seats', protect, lockSeats);
router.post('/unlock-seats', protect, unlockSeats);
router.post('/', protect, createBooking);
router.get('/my-bookings', protect, getMyBookings);
router.get('/analytics', protect, verifyAdmin, getAdminAnalytics);
router.get('/:id', protect, getBookingById);
router.put('/:id/cancel', protect, cancelBooking);

module.exports = router;
