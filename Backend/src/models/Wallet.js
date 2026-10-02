const mongoose = require("mongoose");

const walletSchema = new mongoose.Schema(
  {
    vendor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    balance: { type: Number, required: true, min: 0, default: 0 },
    creditedOrders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }],
    refundedWithdrawals: [{ type: mongoose.Schema.Types.ObjectId, ref: "Withdrawal" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Wallet", walletSchema);