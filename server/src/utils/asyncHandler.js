/**
 * asyncHandler — wraps async controller functions so we don't need
 * try/catch blocks in every handler. Passes errors to Express's
 * centralized error handler via next().
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
