import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/AppError.js';

/**
 * Sign JWT token containing user's payload
 * @param {string} id - User document ID
 * @param {string} role - User role
 * @returns {string} Signed JWT token
 */
const signToken = (id, role) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET must be configured in environment variables.');
  }

  return jwt.sign(
    { id, role },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '90d',
    }
  );
};

/**
 * Register a new User
 */
export const register = catchAsync(async (req, res, next) => {
  const { email, password, role, profileDetails } = req.body;

  // 1. Basic validation
  if (!email || !password) {
    return next(new AppError('Please provide both email and password.', 400));
  }

  // 2. Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new AppError('Email address is already in use.', 400));
  }

  // 3. Create the user (pre-save hook hashes passwordHash automatically)
  const newUser = await User.create({
    email,
    password,
    role,
    profileDetails,
  });

  // 4. Generate token and return response
  const token = signToken(newUser._id, newUser.role);

  // Exclude passwordHash from response data
  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: {
        id: newUser._id,
        email: newUser.email,
        role: newUser.role,
        profileDetails: newUser.profileDetails,
      },
    },
  });
});

/**
 * Log in an existing User
 */
export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1. Check if email and password are provided
  if (!email || !password) {
    return next(new AppError('Please provide email and password.', 400));
  }

  // 2. Retrieve user including passwordHash (since it is required for verification)
  const user = await User.findOne({ email });

  if (!user || !(await user.comparePassword(password))) {
    return next(new AppError('Incorrect email or password.', 401));
  }

  // 3. Generate token and respond (include profileDetails for frontend firstName display)
  const token = signToken(user._id, user.role);

  res.status(200).json({
    status: 'success',
    token,
    data: {
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        profileDetails: user.profileDetails,
      },
    },
  });
});

/**
 * Get current user profile
 */
export const getMe = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('-password');

  if (!user) {
    return next(new AppError('User not found.', 404));
  }

  res.status(200).json({
    status: 'success',
    data: { user }
  });
});

/**
 * Update current user profile
 * Handles the full expanded profileDetails object including nested socialLinks and niches array.
 */
export const updateMe = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    return next(new AppError('User not found.', 404));
  }

  // Disallow password changes through this route
  if (req.body.password) {
    return next(new AppError('This route is not for password updates.', 400));
  }

  const { profileDetails } = req.body;

  if (profileDetails) {
    // Update scalar fields if provided
    const scalarFields = [
      'firstName', 'lastName', 'location', 'phone', 'bio',
      'profilePicture', 'gender', 'dateOfBirth',
    ];

    for (const field of scalarFields) {
      if (profileDetails[field] !== undefined) {
        user.profileDetails[field] = profileDetails[field];
      }
    }

    // Update array fields if provided
    if (profileDetails.languagePreferences !== undefined) {
      user.profileDetails.languagePreferences = profileDetails.languagePreferences;
    }
    if (profileDetails.niches !== undefined) {
      user.profileDetails.niches = profileDetails.niches;
    }

    // Update nested socialLinks if provided
    if (profileDetails.socialLinks) {
      const linkFields = ['youtube', 'instagram', 'twitter', 'linkedin', 'facebook', 'website'];
      for (const field of linkFields) {
        if (profileDetails.socialLinks[field] !== undefined) {
          user.profileDetails.socialLinks[field] = profileDetails.socialLinks[field];
        }
      }
    }

    // Backwards compatibility: handle old-style niche (single string) → convert to array
    if (profileDetails.niche && !profileDetails.niches) {
      user.profileDetails.niches = profileDetails.niche
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);
    }
  }

  // Backwards compatibility for flat-style requests
  if (req.body.location) user.profileDetails.location = req.body.location;
  if (req.body.nicheTags) {
    user.profileDetails.niches = req.body.nicheTags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);
  }

  await user.save();

  // Return user without password
  const updatedUser = await User.findById(req.user.id).select('-password');

  res.status(200).json({
    status: 'success',
    data: { user: updatedUser }
  });
});

/**
 * Delete current user account permanently
 */
export const deleteMe = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.user.id);

  if (!user) {
    return next(new AppError('User not found.', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});