const Order = require("../models/Order");
const LaundryService = require("../models/LaundryService");
const { createPayment } = require("../services/paymentService");
const { success, error } = require("../utils/apiResponse");

const createOrder = async (req, res, next) => {
  try {
    const { pickup, items } = req.body;
    const requestedIds = items.map((item) => item.service);
    const services = await LaundryService.find({ _id: { $in: requestedIds }, active: true });
    if (services.length !== requestedIds.length) return error(res, "One or more services are unavailable", 400);
    const pricedItems = items.map((item) => {
      const service = services.find((entry) => entry.id === item.service);
      return { service: service.id, quantity: item.quantity, unitPrice: service.price };
    });
    const total = pricedItems.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
    const order = await Order.create({ customer: req.user.id, pickup, items: pricedItems, total });
    const payment = await createPayment({ amount: total, reference: order.id });
    return success(res, { order, payment }, "Order created", 201);
  } catch (err) { return next(err); }
};

const listOrders = async (req, res, next) => {
  try {
    const filter = req.user.role === "admin" ? {} : { customer: req.user.id };
    return success(res, { orders: await Order.find(filter).populate("items.service pickup") });
  } catch (err) { return next(err); }
};

const updateOrderStatus = async (req, res, next) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true, runValidators: true });
    if (!order) return error(res, "Order not found", 404);
    return success(res, { order }, "Order status updated");
  } catch (err) { return next(err); }
};

module.exports = { createOrder, listOrders, updateOrderStatus };