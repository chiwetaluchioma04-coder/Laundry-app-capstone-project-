const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const { success, error } = require("../utils/apiResponse");
const { randomUUID } = require("crypto");

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

const forgotPassword = async (req, res, next) => { 
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) return error(res, "User not found", 404);
        const resetToken = randomUUID();
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
        await user.save();
        return success(res, { resetToken }, "Reset token sent");
    } catch (err) { return next(err); }
};

// Reset Password: Check if token is valid and not expired.
const resetPassword = async (req, res, next) => { 
    try {      
        const user = await User.findOne({
          resetPasswordToken: req.body.resetToken,
          resetPasswordExpire: { $gt: Date.now() },
        });
        if (!user) 
          return error(res, "Invalid or expired reset token", 400);
        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();
        return success(res, { user }, "Password reset successful");
    } catch (err) {
      return next(err); 
    }
};


module.exports = { register, login, forgotPassword, resetPassword };