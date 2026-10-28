const Show = require('../models/Show');
const Movie = require('../models/Movie');
const Theatre = require('../models/Theatre');

// @desc    Get shows with filtering by movie, theatre, date, and city
// @route   GET /api/shows
// @access  Public
exports.getShows = async (req, res, next) => {
  try {
    const { movieId, theatreId, date, city } = req.query;
    let query = {};

    if (movieId) query.movieId = movieId;
    if (theatreId) query.theatreId = theatreId;
    if (date) query.showDate = date;

    let showsQuery = Show.find(query)
      .populate('movieId', 'title posterUrl duration language genre certificate')
      .populate('theatreId', 'name location address screenType facilities');

    const shows = await showsQuery.exec();

    // If city is specified, filter by theatre's city
    let filteredShows = shows;
    if (city && city !== 'All') {
      filteredShows = shows.filter(
        (s) =>
          s.theatreId &&
          s.theatreId.location &&
          s.theatreId.location.city.toLowerCase() === city.toLowerCase()
      );
    }

    res.status(200).json({
      success: true,
      count: filteredShows.length,
      shows: filteredShows,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single show by ID with seat matrix & auto-clean locks
// @route   GET /api/shows/:id
// @access  Public
exports.getShowById = async (req, res, next) => {
  try {
    const show = await Show.findById(req.params.id)
      .populate('movieId')
      .populate('theatreId');

    if (!show) {
      return res.status(404).json({
        success: false,
        message: 'Show not found',
      });
    }

    // Clean expired seat locks (default 10 mins)
    const hasExpired = show.cleanExpiredLocks(10);
    if (hasExpired) {
      await show.save();
    }

    res.status(200).json({
      success: true,
      show,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new show
// @route   POST /api/shows
// @access  Private/Admin
exports.createShow = async (req, res, next) => {
  try {
    const {
      movieId,
      theatreId,
      screenName,
      screenType,
      showDate,
      showTime,
      ticketPrice,
      seatMatrix,
    } = req.body;

    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({ success: false, message: 'Movie not found' });
    }

    const theatre = await Theatre.findById(theatreId);
    if (!theatre) {
      return res.status(404).json({ success: false, message: 'Theatre not found' });
    }

    const prices = ticketPrice || { vip: 450, premium: 320, standard: 220 };
    const generatedMatrix =
      seatMatrix && seatMatrix.length > 0
        ? seatMatrix
        : Show.generateDefaultMatrix(prices);

    const show = await Show.create({
      movieId,
      theatreId,
      screenName: screenName || 'Audi 1 - Premium',
      screenType: screenType || 'IMAX 2D',
      showDate,
      showTime,
      ticketPrice: prices,
      seatMatrix: generatedMatrix,
    });

    const populatedShow = await Show.findById(show._id)
      .populate('movieId')
      .populate('theatreId');

    res.status(201).json({
      success: true,
      message: 'Show scheduled successfully',
      show: populatedShow,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete show
// @route   DELETE /api/shows/:id
// @access  Private/Admin
exports.deleteShow = async (req, res, next) => {
  try {
    const show = await Show.findByIdAndDelete(req.params.id);

    if (!show) {
      return res.status(404).json({
        success: false,
        message: 'Show not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Show deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
