const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { PUBLIC_ROLES, ROLES } = require("../utils/constants");

const vendorPricingSchema = new mongoose.Schema(
  {
    washing: { type: Number, min: 0 },
    ironing: { type: Number, min: 0 },
    dryCleaning: { type: Number, min: 0 },
    pickupDelivery: { type: Number, min: 0 },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      enum: Object.values(ROLES),
      default: ROLES.CUSTOMER,
    },
    address: { type: String, trim: true },
    businessName: { type: String, trim: true },
    businessAddress: { type: String, trim: true },
    bankName: { type: String, trim: true },
    accountNumber: { type: String, trim: true },
    accountName: { type: String, trim: true },
    pricing: { type: vendorPricingSchema, default: undefined },
  },
  { timestamps: true }
);

userSchema.pre("save", async function () {
  if (this.isModified("password")) this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  user.name = user.fullName;
  return user;
};

module.exports = mongoose.model("User", userSchema);