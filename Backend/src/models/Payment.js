const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    order: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true, unique: true },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true, min: 1 },
    reference: { type: String, required: true, unique: true, index: true },
    status: { type: String, enum: ["pending", "paid", "failed"], default: "pending" },
    paidAt: Date,
    verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);