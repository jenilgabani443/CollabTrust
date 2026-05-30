/**
 * Custom application error class.
 * Extends the built-in Error class to provide HTTP status codes and operational flagging.
 */
class AppError extends Error {
  /**
   * Create an AppError.
   * @param {string} message - Error description message.
   * @param {number} statusCode - HTTP status code (e.g., 400, 404, 500).
   */
  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode;
    // Status is 'fail' for 4xx client errors, and 'error' for 5xx server errors
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    // Operational error flag (distinguishes predictable run-time errors from bugs)
    this.isOperational = true;

    // Capture the call stack, excluding this constructor call
    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
