const User = require("../models/User");
const { success, error } = require("../utils/apiResponse");


// this gets 
const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return error(res, "User not found", 404);
    return success(res, { user }, "User found");
  } catch (err) { return next(err); }
};

const updateProfile = async (req, res, next) => {
  try {
    const allowed = ["name", "phone", "address"];
    const updates = Object.fromEntries(Object.entries(req.body).filter(([key]) => allowed.includes(key)));
    const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true, runValidators: true });
    if (!user) return error(res, "User not found", 404);
    return success(res, { user }, "Profile updated");
  } catch (err) { return next(err); }
};

const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    return success(res, { users }, "Users found");
  } catch (err) { return next(err); }
};

const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return error(res, "User not found", 404);
    return success(res, { user }, "User found");
  } catch (err) { return next(err); }
};
module.exports = { getUser, updateProfile, getAllUsers, getProfile };