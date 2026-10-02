const Order = require("../models/Order");
const User = require("../models/User");
const { receiveOrder, updateOrderStatus } = require("../services/order.service");
const { CUSTOMER_APP_FEE_PERCENT, VENDOR_FEE_PERCENT } = require("../utils/constants");
const { success, error } = require("../utils/apiResponse");

const getVendorDirectory = async (req, res, next) => {
  try {
    const vendors = await User.find({ role: "vendor" })
      .select("fullName businessName businessAddress pricing")
      .sort({ businessName: 1, fullName: 1 });
    const completeVendors = vendors.filter((vendor) =>
      ["washing", "ironing", "dryCleaning", "pickupDelivery"].every((key) => Number.isSafeInteger(vendor.pricing?.[key]))
    );
    return success(res, { vendors: completeVendors, customerAppFeePercent: CUSTOMER_APP_FEE_PERCENT });
  } catch (err) {
    return next(err);
  }
};

const updatePricing = async (req, res, next) => {
  try {
    const vendor = await User.findOne({ _id: req.user.id, role: "vendor" });
    if (!vendor) return error(res, "Vendor account not found", 404);
    vendor.pricing = {
      washing: req.body.washing,
      ironing: req.body.ironing,
      dryCleaning: req.body.dryCleaning,
      pickupDelivery: req.body.pickupDelivery,
    };
    await vendor.save();
    return success(res, { pricing: vendor.pricing }, "Pricing saved");
  } catch (err) {
    return next(err);
  }
};

const getPricing = async (req, res, next) => {
  try {
    const vendor = await User.findOne({ _id: req.user.id, role: "vendor" }).select("pricing");
    if (!vendor) return error(res, "Vendor account not found", 404);
    return success(res, { pricing: vendor.pricing || {}, vendorFeePercent: VENDOR_FEE_PERCENT });
  } catch (err) {
    return next(err);
  }
};

const getAvailableOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ vendor: req.user.id, status: "scheduled", paymentStatus: "paid" })
      .sort({ createdAt: 1 })
      .populate("customer", "fullName phone");
    return success(res, { orders });
  } catch (err) {
    return next(err);
  }
};

const receive = async (req, res, next) => {
  try {
    const order = await receiveOrder(req.params.id, req.user.id);
    return success(res, { order }, "Order received");
  } catch (err) {
    return next(err);
  }
};

const listVendorOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ vendor: req.user.id })
      .sort({ updatedAt: -1 })
      .populate("customer", "fullName phone")
      .populate("statusHistory.updatedBy", "fullName role");
    return success(res, { orders });
  } catch (err) {
    return next(err);
  }
};

const updateStatus = async (req, res, next) => {
  try {
    const order = await updateOrderStatus({
      orderId: req.params.id,
      vendorId: req.user.id,
      status: req.body.status,
    });
    return success(res, { order }, "Order status updated");
  } catch (err) {
    return next(err);
  }
};

const updateBankDetails = async (req, res, next) => {
  try {
    const user = await User.findOneAndUpdate(
      { _id: req.user.id, role: "vendor" },
      {
        $set: {
          bankName: req.body.bankName,
          accountNumber: req.body.accountNumber,
          accountName: req.body.accountName,
        },
      },
      { returnDocument: "after", runValidators: true }
    );
    if (!user) return error(res, "Vendor account not found", 404);
    return success(res, { bankDetails: { bankName: user.bankName, accountNumber: user.accountNumber, accountName: user.accountName } }, "Bank details saved");
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  getAvailableOrders,
  getVendorDirectory,
  getPricing,
  listVendorOrders,
  receive,
  updateBankDetails,
  updatePricing,
  updateStatus,
};