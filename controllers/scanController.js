const asyncHandler = require('express-async-handler');
const Scan = require('../models/Scan');
const User = require('../models/User');

// @desc    Upload plant image & Get Analysis Result
// @route   POST /api/scans
// @access  Private
const uploadScan = asyncHandler(async (req, res) => {
  // Validate file upload
  if (!req.file) {
    res.status(400);
    throw new Error('Please upload an image file');
  }

  // TODO: Integrate with Python AI Service here
  // Using mock data for initial testing
  const aiResult = {
    disease: 'Healthy', 
    confidence: 98
  };

  // Create scan record in database
  const scan = await Scan.create({
    user: req.user.id,
    imageUrl: req.file.path,
    result: aiResult.disease,
    confidence: aiResult.confidence,
  });

  res.status(200).json(scan);
});

// @desc    Get current user's scan history
// @route   GET /api/scans
// @access  Private
const getMyScans = asyncHandler(async (req, res) => {
  // Fetch scans for the logged-in user, sorted by newest first
  const scans = await Scan.find({ user: req.user.id }).sort({ createdAt: -1 });
  res.status(200).json(scans);
});

module.exports = {
  uploadScan,
  getMyScans,
};