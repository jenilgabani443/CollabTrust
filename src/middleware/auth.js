import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/AppError.js';

/**
 * Middleware to verify JWT token from Authorization header
 */
export const verifyToken = catchAsync(async (req, res, next) => {
  // 1) Getting token and check if it exists
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access.', 401)
    );
  }

  // 2) Verification of token
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return next(
        new AppError('Your token has expired! Please log in again.', 401)
      );
    }
    return next(
      new AppError('Invalid token. Please log in again.', 401)
    );
  }

  // 3) Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError(
        'The user belonging to this token no longer exists.',
        401
      )
    );
  }

  // 4) Grant access to protected route and store user in req
  req.user = currentUser;
  next();
});

/**
 * Middleware to restrict access to specific roles
 * @param {...string} roles - List of allowed roles
 */
export const restrictTo = (...roles) => {
  return (req, res, next) => {
    // req.user is set by verifyToken middleware
    if (!req.user) {
      return next(
        new AppError('Authentication required to perform this action.', 401)
      );
    }

    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action.', 403)
      );
    }

    next();
  };
};
