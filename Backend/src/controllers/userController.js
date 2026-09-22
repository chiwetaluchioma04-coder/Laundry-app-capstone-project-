const User = require("../models/User");
const { success, error } = require("../utils/apiResponse");

const getProfile = async (req, res, next) => {
  try { return success(res, { user: await User.findById(req.user.id) }); } catch (err) { return next(err); }
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

module.exports = { getProfile, updateProfile };