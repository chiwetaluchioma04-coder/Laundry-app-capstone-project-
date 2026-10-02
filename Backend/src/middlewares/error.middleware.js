const { error } = require("../utils/apiResponse");

const notFound = (req, res) => error(res, `Route not found: ${req.method} ${req.originalUrl}`, 404);

const errorHandler = (err, req, res, next) => {
  if (res.headersSent) return next(err);
  if (err.code === 11000) return error(res, "A record with that value already exists", 409);
  if (err.name === "CastError") return error(res, "Invalid resource identifier", 400);

  const statusCode = err.statusCode || (err.name === "ValidationError" ? 400 : 500);
  return error(res, statusCode === 500 ? "Internal server error" : err.message, statusCode);
};

module.exports = { errorHandler, notFound };