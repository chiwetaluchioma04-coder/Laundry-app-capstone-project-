const Order = require("../models/Order");
const Payment = require("../models/Payment");
const Wallet = require("../models/Wallet");
const Withdrawal = require("../models/Withdrawal");
const { success } = require("../utils/apiResponse");

const createError = (message, statusCode) => Object.assign(new Error(message), { statusCode });

const adjustWalletOnce = async (vendorId, amount, referenceField, referenceId) => {
  try {
    await Wallet.updateOne(
      { vendor: vendorId },
      { $setOnInsert: { vendor: vendorId } },
      { upsert: true, setDefaultsOnInsert: true }
    );
  } catch (err) {
    if (err.code !== 11000) throw err;
  }

  return Wallet.updateOne(
    { vendor: vendorId, [referenceField]: { $ne: referenceId } },
    { $inc: { balance: amount }, $addToSet: { [referenceField]: referenceId } }
  );
};

const listPayments = async (req, res, next) => {
  try {
    const status = req.query.status || "pending";
    const filter = status === "all" ? {} : { status: status === "verified" ? "paid" : status };
    const payments = await Payment.find(filter)
      .sort({ createdAt: 1 })
      .populate("customer", "fullName email phone")
      .populate("verifiedBy", "fullName")
      .populate({ path: "order", populate: { path: "vendor", select: "fullName businessName" } });
    return success(res, { payments });
  } catch (err) {
    return next(err);
  }
};

const verifyPayment = async (req, res, next) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) throw createError("Payment not found", 404);
    if (payment.status !== "pending" && payment.status !== "paid") {
      throw createError("Payment is no longer awaiting verification", 409);
    }

    const alreadyVerified = payment.status === "paid";
    let order = await Order.findOneAndUpdate(
      { _id: payment.order, status: "awaiting_payment", paymentStatus: "pending", earningsCredited: false },
      {
        $set: { status: "scheduled", paymentStatus: "paid", earningsCredited: true },
        $push: { statusHistory: { status: "scheduled", updatedBy: req.user.id, at: new Date() } },
      },
      { returnDocument: "after", runValidators: true }
    );

    if (!order) {
      order = await Order.findOne({ _id: payment.order, paymentStatus: "paid", earningsCredited: true });
      if (!order) throw createError("Order is no longer awaiting payment", 409);
    }

    await adjustWalletOnce(order.vendor, order.vendorEarning, "creditedOrders", order._id);
    const verifiedPayment = await Payment.findOneAndUpdate(
      { _id: payment._id, status: { $in: ["pending", "paid"] } },
      { $set: { status: "paid", paidAt: payment.paidAt || new Date(), verifiedBy: req.user.id } },
      { returnDocument: "after" }
    );
    if (!verifiedPayment) throw createError("Payment changed during verification; retry", 409);

    return success(
      res,
      { payment: verifiedPayment, order, alreadyVerified },
      alreadyVerified ? "Payment was already verified" : "Payment verified and vendor wallet credited"
    );
  } catch (err) {
    return next(err);
  }
};

const listPendingWithdrawals = async (req, res, next) => {
  try {
    const withdrawals = await Withdrawal.find({
      $or: [{ status: "processing" }, { status: "failed", refundedAt: { $exists: false } }],
    })
      .sort({ createdAt: 1 })
      .populate("vendor", "fullName businessName email phone");
    return success(res, { withdrawals });
  } catch (err) {
    return next(err);
  }
};

const updateWithdrawal = async (req, res, next) => {
  try {
    let withdrawal = await Withdrawal.findOneAndUpdate(
      { _id: req.params.id, status: "processing" },
      { $set: { status: req.body.status, processedAt: new Date(), processedBy: req.user.id } },
      { returnDocument: "after", runValidators: true }
    );

    if (!withdrawal) {
      withdrawal = await Withdrawal.findById(req.params.id);
      if (!withdrawal) throw createError("Withdrawal request not found", 404);
      if (withdrawal.status !== req.body.status) throw createError("Withdrawal request is no longer pending", 409);
      if (withdrawal.status === "paid" || withdrawal.refundedAt) {
        return success(res, { withdrawal }, "Withdrawal request was already processed");
      }
    }

    if (withdrawal.status === "failed") {
      await adjustWalletOnce(withdrawal.vendor, withdrawal.amount, "refundedWithdrawals", withdrawal._id);
      withdrawal = await Withdrawal.findOneAndUpdate(
        { _id: withdrawal._id, status: "failed", refundedAt: { $exists: false } },
        { $set: { refundedAt: new Date() } },
        { returnDocument: "after" }
      ) || withdrawal;
    }

    return success(res, { withdrawal }, withdrawal.status === "paid" ? "Withdrawal marked as paid" : "Withdrawal failed and balance refunded");
  } catch (err) {
    return next(err);
  }
};

module.exports = { listPayments, listPendingWithdrawals, updateWithdrawal, verifyPayment };