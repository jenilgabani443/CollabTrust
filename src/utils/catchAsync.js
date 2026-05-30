/**
 * Catches errors in asynchronous Express route handlers and passes them to next().
 * Eliminates the need for repetitive try-catch blocks.
 * @param {Function} fn - Asynchronous Express route handler.
 * @returns {Function} Express route handler with error catch wrapper.
 */
const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

export default catchAsync;
