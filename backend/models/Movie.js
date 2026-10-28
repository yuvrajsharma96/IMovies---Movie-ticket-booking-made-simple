const mongoose = require('mongoose');

const CastSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    role: { type: String, default: '' },
    image: { type: String, default: '' },
  },
  { _id: false }
);

const MovieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a movie title'],
      trim: true,
    },
    genre: {
      type: [String],
      required: [true, 'Please specify at least one genre'],
    },
    language: {
      type: String,
      required: [true, 'Please specify language'],
      default: 'English',
    },
    duration: {
      type: Number, // in minutes
      required: [true, 'Please provide duration in minutes'],
    },
    releaseDate: {
      type: Date,
      default: Date.now,
    },
    posterUrl: {
      type: String,
      required: [true, 'Please provide a poster image URL'],
    },
    backdropUrl: {
      type: String,
      default: '',
    },
    trailerUrl: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      required: [true, 'Please provide a movie description / synopsis'],
    },
    rating: {
      type: Number,
      min: 0,
      max: 10,
      default: 8.0,
    },
    votes: {
      type: Number,
      default: 1200,
    },
    certificate: {
      type: String,
      default: 'UA',
    },
    cast: [CastSchema],
    director: {
      type: String,
      default: '',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

MovieSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Movie', MovieSchema);
