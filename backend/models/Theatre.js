const mongoose = require('mongoose');

const TheatreSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide theatre name'],
      trim: true,
    },
    location: {
      city: { type: String, required: true },
      state: { type: String, default: '' },
    },
    address: {
      type: String,
      required: [true, 'Please provide theatre address'],
    },
    totalSeats: {
      type: Number,
      default: 80,
    },
    screenType: {
      type: [String],
      default: ['IMAX 2D', 'Dolby Atmos', '4DX'],
    },
    facilities: {
      type: [String],
      default: ['Recliner Seats', 'F&B In-seat Service', 'Dolby 7.1', 'Parking Available'],
    },
  },
  {
    timestamps: true,
  }
);

TheatreSchema.index({ 'location.city': 1 });

module.exports = mongoose.model('Theatre', TheatreSchema);
