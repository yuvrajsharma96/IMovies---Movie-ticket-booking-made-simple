const mongoose = require('mongoose');

const SeatSchema = new mongoose.Schema(
  {
    seatNumber: { type: String, required: true },
    row: { type: String, required: true },
    col: { type: Number, required: true },
    category: {
      type: String,
      enum: ['VIP', 'Premium', 'Standard'],
      default: 'Standard',
    },
    price: { type: Number, required: true },
    status: {
      type: String,
      enum: ['available', 'locked', 'booked'],
      default: 'available',
    },
    lockedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    lockedAt: {
      type: Date,
      default: null,
    },
  },
  { _id: false }
);

const ShowSchema = new mongoose.Schema(
  {
    movieId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Movie',
      required: [true, 'Please associate a movie'],
    },
    theatreId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Theatre',
      required: [true, 'Please associate a theatre'],
    },
    screenName: {
      type: String,
      default: 'Audi 1 - Premium',
    },
    screenType: {
      type: String,
      default: 'IMAX 2D',
    },
    showDate: {
      type: String, // YYYY-MM-DD for easier querying across timezones
      required: [true, 'Please specify show date in YYYY-MM-DD'],
    },
    showTime: {
      type: String, // e.g. "10:30 AM", "02:15 PM", "06:45 PM", "09:30 PM"
      required: [true, 'Please specify show time'],
    },
    ticketPrice: {
      vip: { type: Number, default: 450 },
      premium: { type: Number, default: 320 },
      standard: { type: Number, default: 220 },
    },
    seatMatrix: [SeatSchema],
  },
  {
    timestamps: true,
  }
);

// Helper to generate seat matrix default layout
ShowSchema.statics.generateDefaultMatrix = function (prices = { vip: 450, premium: 320, standard: 220 }) {
  const rows = [
    { row: 'A', category: 'VIP', price: prices.vip },
    { row: 'B', category: 'VIP', price: prices.vip },
    { row: 'C', category: 'Premium', price: prices.premium },
    { row: 'D', category: 'Premium', price: prices.premium },
    { row: 'E', category: 'Standard', price: prices.standard },
    { row: 'F', category: 'Standard', price: prices.standard },
    { row: 'G', category: 'Standard', price: prices.standard },
  ];

  const colsPerRow = 12;
  const matrix = [];

  rows.forEach((r) => {
    for (let c = 1; c <= colsPerRow; c++) {
      matrix.push({
        seatNumber: `${r.row}${c}`,
        row: r.row,
        col: c,
        category: r.category,
        price: r.price,
        status: 'available',
        lockedBy: null,
        lockedAt: null,
      });
    }
  });

  return matrix;
};

// Auto-clean expired locked seats before returning show
ShowSchema.methods.cleanExpiredLocks = function (lockMinutes = 10) {
  const expiryTime = new Date(Date.now() - lockMinutes * 60 * 1000);
  let changed = false;

  this.seatMatrix.forEach((seat) => {
    if (seat.status === 'locked' && seat.lockedAt && seat.lockedAt < expiryTime) {
      seat.status = 'available';
      seat.lockedBy = null;
      seat.lockedAt = null;
      changed = true;
    }
  });

  return changed;
};

ShowSchema.index({ movieId: 1, theatreId: 1, showDate: 1 });

module.exports = mongoose.model('Show', ShowSchema);
