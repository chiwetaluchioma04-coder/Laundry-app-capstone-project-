const { error } = require("../utils/apiResponse");

const notFound = (req, res) => error(res, `Route not found: ${req.method} ${req.originalUrl}`, 404);

const errorHandler = (err, req, res, next) => {
  if (res.headersSent) return next(err);
  const statusCode = err.statusCode || (err.name === "ValidationError" ? 400 : 500);
  return error(res, statusCode === 500 ? "Internal server error" : err.message, statusCode);
};

module.exports = { notFound, errorHandler };