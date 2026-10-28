const express = require('express');
const router = express.Router();
const {
  getShows,
  getShowById,
  createShow,
  deleteShow,
} = require('../controllers/showController');
const { protect, verifyAdmin } = require('../middleware/authMiddleware');

router.route('/')
  .get(getShows)
  .post(protect, verifyAdmin, createShow);

router.route('/:id')
  .get(getShowById)
  .delete(protect, verifyAdmin, deleteShow);

module.exports = router;
