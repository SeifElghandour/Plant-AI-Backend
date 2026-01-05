const asyncHandler = require('express-async-handler');
const Scan = require('../models/Scan');
const User = require('../models/User');
const Disease = require('../models/Disease'); // Import Disease Model

// @desc    Upload plant image & Get Analysis Result
// @route   POST /api/scans
// @access  Private
const uploadScan = asyncHandler(async (req, res) => {
  // Validate file upload
  if (!req.file) {
    res.status(400);
    throw new Error('Please upload an image file');
  }

  // TODO: Integrate with Python AI Service here (axios.post...)
  // Using mock data for initial testing
  const aiResult = {
    disease: 'Tomato_Late_Blight', // Ensure this matches a name in your Disease DB
    confidence: 98
  };

  const { disease, confidence } = aiResult;

  // 1. Fetch Disease Info from the database based on the AI result
  const diseaseInfo = await Disease.findOne({ name: disease });

  // 2. Set default values if disease info is not found
  let treatmentText = "Consult an agricultural engineer.";
  let symptomsText = "Information not available.";

  // 3. If disease exists in DB, update variables
  if (diseaseInfo) {
    treatmentText = diseaseInfo.treatment;
    symptomsText = diseaseInfo.symptoms;
  }

  // 4. Create scan record in database with all details
  const scan = await Scan.create({
    user: req.user.id,
    imageUrl: req.file.path,
    result: disease,
    confidence: confidence,
    treatment: treatmentText, // Saved for history
    symptoms: symptomsText    // Saved for history
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