const Pickup = require("../models/Pickup");
const { success, error } = require("../utils/apiResponse");

const createPickup = async (req, res, next) => {
  try {
    const pickup = await Pickup.create({ ...req.body, customer: req.user.id });
    return success(res, { pickup }, "Pickup requested", 201);
  } catch (err) { return next(err); }
};

const listPickups = async (req, res, next) => {
  try {
    const filter = req.user.role === "admin" ? {} : { customer: req.user.id };
    return success(res, { pickups: await Pickup.find(filter).populate("customer", "name email") });
  } catch (err) { return next(err); }
};

const updatePickupStatus = async (req, res, next) => {
  try {
    const pickup = await Pickup.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true, runValidators: true });
    if (!pickup) return error(res, "Pickup not found", 404);
    return success(res, { pickup }, "Pickup status updated");
  } catch (err) { return next(err); }
};

module.exports = { createPickup, listPickups, updatePickupStatus };