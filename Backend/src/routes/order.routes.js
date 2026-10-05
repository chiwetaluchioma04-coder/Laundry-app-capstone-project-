const express = require("express");
const { body, param } = require("express-validator");
const { createOrder, getOrder, listOrders, scheduleDelivery, updatePickupSchedule } = require("../controllers/order.controller");
const auth = require("../middlewares/auth.middleware");
const restrictTo = require("../middlewares/role.middleware");
const validate = require("../middlewares/validate.middleware");
const { ROLES, SERVICE_TYPES } = require("../utils/constants");

const router = express.Router();
router.use(auth, restrictTo(ROLES.CUSTOMER));
router.get("/", listOrders);
router.patch(
  "/:id/pickup-schedule",
  [param("id").isMongoId(), body("pickupDate").isISO8601().toDate()],
  validate,
  updatePickupSchedule
);
router.patch(
  "/:id/delivery-schedule",
  [param("id").isMongoId(), body("deliveryAt").isISO8601().toDate()],
  validate,
  scheduleDelivery
);
router.post(
  "/",
  [
    body("serviceType").isIn(Object.keys(SERVICE_TYPES)),
    body("vendorId").isMongoId(),
    body("quantity").isInt({ min: 1 }).toInt(),
    body("pickupAddress").trim().notEmpty(),
    body("pickupDate").isISO8601().toDate(),
  ],
  validate,
  createOrder
);
router.get("/:id", getOrder);

module.exports = router;