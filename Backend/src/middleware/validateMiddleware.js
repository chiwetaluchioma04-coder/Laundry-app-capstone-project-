const { validationResult } = require("express-validator");
const { error } = require("../utils/apiResponse");

const validate = (req, res, next) => {
  const result = validationResult(req);
  if (!result.isEmpty()) return error(res, "Validation failed", 400, result.array());
  next();
};

module.exports = validate;