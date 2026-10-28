const express = require('express');
const router = express.Router();
const {
  getMovies,
  getMovieById,
  createMovie,
  updateMovie,
  deleteMovie,
} = require('../controllers/movieController');
const { protect, verifyAdmin } = require('../middleware/authMiddleware');

router.route('/')
  .get(getMovies)
  .post(protect, verifyAdmin, createMovie);

router.route('/:id')
  .get(getMovieById)
  .put(protect, verifyAdmin, updateMovie)
  .delete(protect, verifyAdmin, deleteMovie);

module.exports = router;
