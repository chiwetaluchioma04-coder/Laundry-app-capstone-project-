const User = require("../models/User");
const Wallet = require("../models/Wallet");
const generateToken = require("../utils/generateToken");
const { PUBLIC_ROLES, ROLES } = require("../utils/constants");
const { success, error } = require("../utils/apiResponse");

const publicUser = (user) => user.toJSON();

const register = async (req, res, next) => {
  try {
    const fullName = req.body.fullName || req.body.name;
    const role = req.body.role || ROLES.CUSTOMER;
    if (!fullName?.trim()) return error(res, "Full name is required", 400);
    if (!PUBLIC_ROLES.includes(role)) return error(res, "Role must be customer or vendor", 400);

    const user = await User.create({
      fullName,
      email: req.body.email,
      phone: req.body.phone,
      password: req.body.password,
      role,
      address: req.body.address,
      businessName: role === ROLES.VENDOR ? req.body.businessName : undefined,
      businessAddress: role === ROLES.VENDOR ? req.body.businessAddress : undefined,
    });

    if (role === ROLES.VENDOR) {
      try {
        await Wallet.create({ vendor: user._id });
      } catch (walletError) {
        await User.findByIdAndDelete(user._id);
        throw walletError;
      }
    }

    return success(res, { user: publicUser(user), token: generateToken(user) }, "Registration successful", 201);
  } catch (err) {
    return next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email.toLowerCase() });
    if (!user || !(await user.comparePassword(req.body.password))) {
      return error(res, "Invalid email or password", 401);
    }
    if (req.body.role && user.role !== req.body.role) {
      return error(res, "This account does not have the selected role", 403);
    }
    return success(res, { user: publicUser(user), token: generateToken(user) }, "Login successful");
  } catch (err) {
    return next(err);
  }
};

const me = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return error(res, "User not found", 404);
    return success(res, { user: publicUser(user) }, "Current user loaded");
  } catch (err) {
    return next(err);
  }
};

module.exports = { login, me, register };