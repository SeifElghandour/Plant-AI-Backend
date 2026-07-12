const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');

const PASSWORD_REGEX = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&]).{8,}$/;

// @desc    Register new user (Email verification bypassed for demo)
// @route   POST /api/users/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Please add all fields');
  }

  if (!PASSWORD_REGEX.test(password)) {
    res.status(400);
    throw new Error(
      'Password must be at least 8 characters and include uppercase, lowercase, number, and special character (@$!%*?&).'
    );
  }

  const normalizedEmail = email.trim().toLowerCase();

  const userExists = await User.findOne({ email: normalizedEmail });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create user with isVerified: true (bypass email verification)
  const user = await User.create({
    name,
    email: normalizedEmail,
    password: hashedPassword,
    isVerified: true,
  });

  // Generate token and return immediately (auto-login)
  const token = generateToken(user._id);

  res.status(201).json({
    message: 'Registration successful. You are now logged in.',
    _id: user.id,
    name: user.name,
    email: user.email,
    token: token,
  });
});

// @desc    Verify user email with OTP (Bypassed - returns success)
// @route   POST /api/users/verify
// @access  Public
const verifyEmail = asyncHandler(async (req, res) => {
  // Email verification bypassed - always return success
  res.status(200).json({
    message: 'Email verification bypassed for demo.',
  });
});

// @desc    Resend OTP verification code (Bypassed - returns success)
// @route   POST /api/users/resend-otp
// @access  Public
const resendOTP = asyncHandler(async (req, res) => {
  // OTP resend bypassed - always return success
  res.status(200).json({
    message: 'OTP resend bypassed for demo.',
  });
});

// @desc    Authenticate a user
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const normalizedEmail = email.trim().toLowerCase();
  const user = await User.findOne({ email: normalizedEmail });

  if (user && (await bcrypt.compare(password, user.password))) {
    // Email verification check bypassed for demo
    // if (!user.isVerified) {
    //   res.status(401);
    //   throw new Error('Please verify your email before logging in.');
    // }

    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid credentials');
  }
});

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    isVerified: user.isVerified,
    createdAt: user.createdAt,
  });
});

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

module.exports = {
  registerUser,
  verifyEmail,
  resendOTP,
  loginUser,
  getUserProfile,
};
