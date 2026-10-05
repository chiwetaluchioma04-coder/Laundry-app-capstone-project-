const Order = require("../models/Order");
const User = require("../models/User");
const { calculateOrderPricing } = require("../services/order.service");
const { SERVICE_TYPES } = require("../utils/constants");
const { success, error } = require("../utils/apiResponse");
const {
  getDeliveryDateError,
  getPickupDateError,
  MAX_DELIVERY_SCHEDULE_CHANGES,
  MAX_PICKUP_DATE_CHANGES,
} = require("../utils/pickupSchedule");

const createOrder = async (req, res, next) => {
  try {
    const { vendorId, serviceType, quantity, pickupAddress, pickupDate } = req.body;
    const pickupDateError = getPickupDateError(pickupDate);
    if (pickupDateError) return error(res, pickupDateError, 400);
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

const updatePickupSchedule = async (req, res, next) => {
  try {
    const pickupDate = new Date(req.body.pickupDate);
    const pickupDateError = getPickupDateError(pickupDate);
    if (pickupDateError) return error(res, pickupDateError, 400);

    const order = await Order.findOneAndUpdate(
      {
        _id: req.params.id,
        customer: req.user.id,
        status: { $in: ["awaiting_payment", "scheduled"] },
        pickupDate: { $ne: pickupDate },
        $or: [
          { pickupDateChanges: { $lt: MAX_PICKUP_DATE_CHANGES } },
          { pickupDateChanges: { $exists: false } },
        ],
      },
      { $set: { pickupDate }, $inc: { pickupDateChanges: 1 } },
      { returnDocument: "after", runValidators: true }
    );
    if (order) return success(res, { order }, "Pickup date and time updated");

    const existingOrder = await Order.findOne({ _id: req.params.id, customer: req.user.id });
    if (!existingOrder) return error(res, "Order not found", 404);
    if (existingOrder.pickupDate.getTime() === pickupDate.getTime()) {
      return success(res, { order: existingOrder }, "Pickup date and time are unchanged");
    }
    return error(res, "Pickup date and time can only be changed twice before processing begins", 409);
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
    const deliveryDateError = getDeliveryDateError(deliveryAt);
    if (deliveryDateError) return error(res, deliveryDateError, 400);

    const currentOrder = await Order.findOne({
      _id: req.params.id,
      customer: req.user.id,
      paymentStatus: "paid",
      status: "ready_for_delivery",
    });
    if (!currentOrder) return error(res, "Delivery can only be scheduled for an order ready for delivery", 409);

    const currentSchedule = currentOrder.deliverySchedule;
    if (currentSchedule?.deliveryAt?.getTime() === deliveryAt.getTime()) {
      return success(res, { order: currentOrder }, "Delivery time is unchanged");
    }

    const updatedAt = new Date();
    let order;
    if (currentSchedule?.deliveryAt) {
      if ((currentSchedule.updateCount || 0) >= MAX_DELIVERY_SCHEDULE_CHANGES) {
        return error(res, "Delivery date and time can only be changed twice", 409);
      }
      order = await Order.findOneAndUpdate(
        {
          _id: req.params.id,
          customer: req.user.id,
          paymentStatus: "paid",
          status: "ready_for_delivery",
          "deliverySchedule.deliveryAt": currentSchedule.deliveryAt,
          $or: [
            { "deliverySchedule.updateCount": { $lt: MAX_DELIVERY_SCHEDULE_CHANGES } },
            { "deliverySchedule.updateCount": { $exists: false } },
          ],
        },
        {
          $set: {
            "deliverySchedule.deliveryAt": deliveryAt,
            "deliverySchedule.updatedAt": updatedAt,
            "deliverySchedule.updatedBy": req.user.id,
          },
          $inc: { "deliverySchedule.updateCount": 1 },
        },
        { returnDocument: "after", runValidators: true }
      );
    } else {
      order = await Order.findOneAndUpdate(
        {
          _id: req.params.id,
          customer: req.user.id,
          paymentStatus: "paid",
          status: "ready_for_delivery",
          "deliverySchedule.deliveryAt": { $exists: false },
        },
        {
          $set: {
            deliverySchedule: {
              deliveryAt,
              updatedAt,
              updatedBy: req.user.id,
              updateCount: 0,
            },
          },
        },
        { returnDocument: "after", runValidators: true }
      );
    }
    if (!order) return error(res, "Delivery schedule changed; reload and try again", 409);
    return success(res, { order }, "Delivery time saved");
  } catch (err) {
    return next(err);
  }
};

module.exports = { createOrder, getOrder, listOrders, scheduleDelivery, updatePickupSchedule };