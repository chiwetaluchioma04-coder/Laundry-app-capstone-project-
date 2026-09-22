const mongoose = require("mongoose");

const pickupSchema = new mongoose.Schema(
  {
    customer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    address: { type: String, required: true, trim: true },
    scheduledFor: { type: Date, required: true },
    status: {
      type: String,
      enum: ["requested", "assigned", "picked_up", "completed", "cancelled"],
      default: "requested",
    },
    notes: { type: String, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Pickup", pickupSchema);