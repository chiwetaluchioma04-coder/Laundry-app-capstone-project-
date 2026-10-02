const mongoose = require("mongoose");
const { WITHDRAWAL_STATUSES } = require("../utils/constants");

const bankDetailsSchema = new mongoose.Schema(
  {
    bankName: { type: String, required: true },
    accountNumber: { type: String, required: true },
    accountName: { type: String, required: true },
  },
  { _id: false }
);

const withdrawalSchema = new mongoose.Schema(
  {
    vendor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    amount: { type: Number, required: true, min: 1 },
    bankDetails: { type: bankDetailsSchema, required: true },
    reference: { type: String, required: true, unique: true },
    status: { type: String, enum: WITHDRAWAL_STATUSES, default: "processing" },
    processedAt: Date,
    processedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    refundedAt: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Withdrawal", withdrawalSchema);