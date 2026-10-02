const { randomUUID } = require("crypto");
const Order = require("../models/Order");
const Payment = require("../models/Payment");
const { success, error } = require("../utils/apiResponse");

const initializePayment = async (req, res, next) => {
  try {
    const transferDetails = {
      bankName: process.env.PAYMENT_BANK_NAME,
      accountName: process.env.PAYMENT_ACCOUNT_NAME,
      accountNumber: process.env.PAYMENT_ACCOUNT_NUMBER,
    };
    if (Object.values(transferDetails).some((value) => !value)) {
      return error(res, "Bank transfer details are not configured", 503);
    }

    const order = await Order.findOne({ _id: req.body.orderId, customer: req.user.id });
    if (!order) return error(res, "Order not found", 404);
    if (order.status !== "awaiting_payment" || order.paymentStatus !== "pending") {
      return error(res, "This order is not awaiting payment", 409);
    }

    let payment = await Payment.findOne({ order: order._id });
    if (!payment) {
      payment = await Payment.create({ order: order._id, customer: req.user.id, amount: order.totalAmount, reference: randomUUID() });
    } else if (payment.status === "failed") {
      payment.status = "pending";
      payment.reference = randomUUID();
      payment.amount = order.totalAmount;
      await payment.save();
    }
    if (payment.status !== "pending") return error(res, "This order has already been paid", 409);

    return success(
      res,
      { paymentId: payment._id, amount: payment.amount, reference: payment.reference, transferDetails },
      "Bank transfer details ready",
      201
    );
  } catch (err) {
    return next(err);
  }
};

module.exports = { initializePayment };