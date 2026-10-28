const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema(
  {
    bookingId: {
      type: String,
      required: true,
      unique: true,
      default: () => 'IMV-' + Math.random().toString(36).substring(2, 8).toUpperCase(),
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please provide user reference'],
    },
    showId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Show',
      required: [true, 'Please provide show reference'],
    },
    seats: [
      {
        seatNumber: { type: String, required: true },
        category: { type: String, default: 'Standard' },
        price: { type: Number, required: true },
      },
    ],
    subtotal: {
      type: Number,
      required: true,
    },
    convenienceFee: {
      type: Number,
      default: 45,
    },
    tax: {
      type: Number,
      default: 18,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'completed',
    },
    paymentMethod: {
      type: String,
      enum: ['Card', 'UPI', 'Net Banking', 'Cash'],
      default: 'Card',
    },
    paymentId: {
      type: String,
      default: () => 'PAY-' + Math.random().toString(36).substring(2, 10).toUpperCase(),
    },
    bookingStatus: {
      type: String,
      enum: ['confirmed', 'cancelled'],
      default: 'confirmed',
    },
    bookingDate: {
      type: Date,
      default: Date.now,
    },
    qrCodeData: {
      type: String, // Base64 data URL or encoded string
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

BookingSchema.index({ userId: 1, bookingDate: -1 });

module.exports = mongoose.model('Booking', BookingSchema);
