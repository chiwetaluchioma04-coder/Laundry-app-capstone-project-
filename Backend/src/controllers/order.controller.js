const Order = require("../models/Order");
const User = require("../models/User");
const { calculateOrderPricing } = require("../services/order.service");
const { SERVICE_TYPES } = require("../utils/constants");
const { success, error } = require("../utils/apiResponse");

const createOrder = async (req, res, next) => {
  try {
    const { vendorId, serviceType, quantity, pickupAddress, pickupDate } = req.body;
    const vendor = await User.findOne({ _id: vendorId, role: "vendor" });
    if (!vendor) return error(res, "Vendor not found", 404);
    const pricing = calculateOrderPricing({ vendorPricing: vendor.pricing || {}, serviceType, quantity });
    const order = await Order.create({
      customer: req.user.id,
      vendor: vendor._id,
      serviceType,
      quantity,
      pickupAddress,
      pickupDate,
      ...pricing,
      statusHistory: [{ status: "awaiting_payment", updatedBy: req.user.id }],
    });

    return success(res, { order }, "Order created", 201);
  } catch (err) {
    return next(err);
  }
};

const listOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ customer: req.user.id })
      .sort({ createdAt: -1 })
      .populate("vendor", "fullName businessName");
    return success(res, { orders });
  } catch (err) {
    return next(err);
  }
};

const getOrder = async (req, res, next) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, customer: req.user.id })
      .populate("vendor", "fullName businessName")
      .populate("statusHistory.updatedBy", "fullName role");
    if (!order) return error(res, "Order not found", 404);
    return success(res, { order });
  } catch (err) {
    return next(err);
  }
};

const scheduleDelivery = async (req, res, next) => {
  try {
    const deliveryAt = new Date(req.body.deliveryAt);
    if (!Number.isFinite(deliveryAt.getTime()) || deliveryAt <= new Date()) {
      return error(res, "Choose a delivery date and time in the future", 400);
    }

    const order = await Order.findOneAndUpdate(
      { _id: req.params.id, customer: req.user.id, paymentStatus: "paid", status: "ready_for_delivery" },
      { $set: { deliverySchedule: { deliveryAt, updatedAt: new Date(), updatedBy: req.user.id } } },
      { returnDocument: "after", runValidators: true }
    );
    if (!order) return error(res, "Delivery can only be scheduled for an order ready for delivery", 409);
    return success(res, { order }, "Delivery time saved");
  } catch (err) {
    return next(err);
  }
};

module.exports = { createOrder, getOrder, listOrders, scheduleDelivery };