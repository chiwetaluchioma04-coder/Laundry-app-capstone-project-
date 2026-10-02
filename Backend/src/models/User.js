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
<<<<<<< HEAD
    fullName: {
=======
    name: {
>>>>>>> e8482ed7615ba475b98d492e90eda645da7bbef8
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
<<<<<<< HEAD
      trim: true,
=======
      required: true,
      unique: true,
      trim: true,
      // sparse: true // Add this if you have existing users in your DB without a phone number
>>>>>>> e8482ed7615ba475b98d492e90eda645da7bbef8
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
<<<<<<< HEAD
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
=======
      enum: ["customer", "vendor", "delivery_agent", "admin"],
      default: "customer",
    },
    address: {
      street: { type: String, trim: true },
      city: { type: String, trim: true },
      state: { type: String, trim: true },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
>>>>>>> e8482ed7615ba475b98d492e90eda645da7bbef8
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