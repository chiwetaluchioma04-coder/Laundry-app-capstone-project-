const express = require("express");
const { body } = require("express-validator");
const {
  getAvailableOrders,
  getVendorDirectory,
  getPricing,
  listVendorOrders,
  receive,
  updateBankDetails,
  updatePricing,
  updateStatus,
} = require("../controllers/vendor.controller");
const auth = require("../middlewares/auth.middleware");
const restrictTo = require("../middlewares/role.middleware");
const validate = require("../middlewares/validate.middleware");
const { ROLES, ORDER_STATUSES } = require("../utils/constants");

const router = express.Router();
router.get("/directory", auth, restrictTo(ROLES.CUSTOMER), getVendorDirectory);
router.use(auth, restrictTo(ROLES.VENDOR));
router.get("/pricing", getPricing);
router.patch(
  "/pricing",
  [
    body("washing").isInt({ min: 1 }).toInt(),
    body("ironing").isInt({ min: 1 }).toInt(),
    body("dryCleaning").isInt({ min: 1 }).toInt(),
    body("pickupDelivery").isInt({ min: 1 }).toInt(),
  ],
  validate,
  updatePricing
);
router.get("/orders/available", getAvailableOrders);
router.patch("/orders/:id/receive", receive);
router.get("/orders", listVendorOrders);
router.patch("/orders/:id/status", [body("status").isIn(ORDER_STATUSES)], validate, updateStatus);
router.patch(
  "/bank-details",
  [body("bankName").trim().notEmpty(), body("accountNumber").trim().notEmpty(), body("accountName").trim().notEmpty()],
  validate,
  updateBankDetails
);

module.exports = router;