const express = require('express');
const router = express.Router();
const multer = require('multer');
const { uploadScan, getMyScans } = require('../controllers/scanController');
const { protect } = require('../middleware/authMiddleware');

// Configure temporary storage for uploaded files
const upload = multer({ dest: 'uploads/' });

// Protected Routes

// POST /api/scans -> Upload image and analyze
router.post('/', protect, upload.single('image'), uploadScan);

// GET /api/scans -> Get user's history
router.get('/', protect, getMyScans);

module.exports = router;