const express = require('express');
const router = express.Router();
const {
  getTheatres,
  getTheatreById,
  createTheatre,
  updateTheatre,
  deleteTheatre,
} = require('../controllers/theatreController');
const { protect, verifyAdmin } = require('../middleware/authMiddleware');

router.route('/')
  .get(getTheatres)
  .post(protect, verifyAdmin, createTheatre);

router.route('/:id')
  .get(getTheatreById)
  .put(protect, verifyAdmin, updateTheatre)
  .delete(protect, verifyAdmin, deleteTheatre);

module.exports = router;
