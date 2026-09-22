const jwt = require("jsonwebtoken");
const { error } = require("../utils/apiResponse");

const authMiddleware = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) return error(res, "Authentication required", 401);

  try {
    req.user = jwt.verify(header.slice(7), process.env.JWT_SECRET);
    next();
  } catch (err) {
    return error(res, "Invalid or expired token", 401);
  }
};

module.exports = authMiddleware;