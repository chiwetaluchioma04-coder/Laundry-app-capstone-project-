const jwt = require("jsonwebtoken");
const { error } = require("../utils/apiResponse");

const authMiddleware = (req, res, next) => {
  const authorization = req.headers.authorization;
  if (!authorization || !authorization.startsWith("Bearer ")) {
    return error(res, "Authentication required", 401);
  }

  try {
    req.user = jwt.verify(authorization.slice(7), process.env.JWT_SECRET);
    return next();
  } catch {
    return error(res, "Invalid or expired token", 401);
  }
};

module.exports = authMiddleware;