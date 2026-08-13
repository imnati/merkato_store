// Wrap async route handlers so rejected promises reach Express's error middleware
// instead of becoming unhandled rejections (which would hang the client / crash dev server)
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

module.exports = asyncHandler;