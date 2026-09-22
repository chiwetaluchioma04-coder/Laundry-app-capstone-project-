const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const { success, error } = require("../utils/apiResponse");

const register = async (req, res, next) => {
  try {
    const { name, email, password, phone, address } = req.body;
    if (await User.findOne({ email })) return error(res, "Email is already registered", 409);
    const user = await User.create({ name, email, password, phone, address });
    return success(res, { user, token: generateToken(user) }, "Registration successful", 201);
  } catch (err) { return next(err); }
};

const login = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user || !(await user.comparePassword(req.body.password))) return error(res, "Invalid email or password", 401);
    return success(res, { user, token: generateToken(user) }, "Login successful");
  } catch (err) { return next(err); }
};

module.exports = { register, login };