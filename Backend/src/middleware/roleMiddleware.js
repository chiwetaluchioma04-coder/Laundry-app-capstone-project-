const { error } = require("../utils/apiResponse");

// this checks if the user is authorized to access the route
const restrictTo = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) return error(res, "Forbidden", 403);
  next();
};

// it will return 403 if the user is not authorized to access the route

module.exports = restrictTo;