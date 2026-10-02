const { error } = require("../utils/apiResponse");

const restrictTo = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) return error(res, "Forbidden", 403);
  return next();
};

module.exports = restrictTo;