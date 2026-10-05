const mongoose = require("mongoose");
const { ORDER_STATUSES, SERVICE_TYPES } = require("../utils/constants");

const statusHistorySchema = new mongoose.Schema(
  {
    status: { type: String, enum: ORDER_STATUSES, required: true },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    at: { type: Date, default: Date.now },
  },
  { _id: false }
);

const lineItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true, min: 0 },
    amount: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    customer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    vendor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    serviceType: { type: String, enum: Object.keys(SERVICE_TYPES), required: true },
    quantity: { type: Number, required: true, min: 1 },
    pickupAddress: { type: String, required: true, trim: true },
    pickupDate: { type: Date, required: true },
    pickupDateChanges: { type: Number, default: 0, min: 0, max: 2 },
    lineItems: { type: [lineItemSchema], required: true },
    subtotal: { type: Number, required: true, min: 1 },
    customerAppFee: { type: Number, required: true, min: 0 },
    totalAmount: { type: Number, required: true, min: 1 },
    platformFee: { type: Number, required: true, min: 0 },
    vendorEarning: { type: Number, required: true, min: 0 },
    earningsCredited: { type: Boolean, default: false },
    paymentStatus: { type: String, enum: ["pending", "paid", "failed"], default: "pending" },
    status: { type: String, enum: ORDER_STATUSES, default: "awaiting_payment" },
    deliverySchedule: {
      deliveryAt: Date,
      updatedAt: Date,
      updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      updateCount: { type: Number, default: 0, min: 0, max: 2 },
    },
    statusHistory: { type: [statusHistorySchema], default: [] },
  },
  { timestamps: true }
);

orderSchema.index({ status: 1, paymentStatus: 1, vendor: 1 });

module.exports = mongoose.model("Order", orderSchema);