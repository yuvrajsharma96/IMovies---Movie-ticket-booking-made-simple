const Theatre = require('../models/Theatre');

// @desc    Get all theatres, optionally filter by city
// @route   GET /api/theatres
// @access  Public
exports.getTheatres = async (req, res, next) => {
  try {
    const { city, search } = req.query;
    let query = {};

    if (city && city !== 'All') {
      query['location.city'] = { $regex: city, $options: 'i' };
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { address: { $regex: search, $options: 'i' } },
      ];
    }

    const theatres = await Theatre.find(query).sort({ name: 1 });

    res.status(200).json({
      success: true,
      count: theatres.length,
      theatres,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get theatre by ID
// @route   GET /api/theatres/:id
// @access  Public
exports.getTheatreById = async (req, res, next) => {
  try {
    const theatre = await Theatre.findById(req.params.id);

    if (!theatre) {
      return res.status(404).json({
        success: false,
        message: 'Theatre not found',
      });
    }

    res.status(200).json({
      success: true,
      theatre,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new theatre
// @route   POST /api/theatres
// @access  Private/Admin
exports.createTheatre = async (req, res, next) => {
  try {
    const theatre = await Theatre.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Theatre created successfully',
      theatre,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update theatre
// @route   PUT /api/theatres/:id
// @access  Private/Admin
exports.updateTheatre = async (req, res, next) => {
  try {
    const theatre = await Theatre.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!theatre) {
      return res.status(404).json({
        success: false,
        message: 'Theatre not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Theatre updated successfully',
      theatre,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete theatre
// @route   DELETE /api/theatres/:id
// @access  Private/Admin
exports.deleteTheatre = async (req, res, next) => {
  try {
    const theatre = await Theatre.findByIdAndDelete(req.params.id);

    if (!theatre) {
      return res.status(404).json({
        success: false,
        message: 'Theatre not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Theatre deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
