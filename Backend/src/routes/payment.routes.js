const express = require("express");
const { body } = require("express-validator");
const { initializePayment } = require("../controllers/payment.controller");
const auth = require("../middlewares/auth.middleware");
const restrictTo = require("../middlewares/role.middleware");
const validate = require("../middlewares/validate.middleware");
const { ROLES } = require("../utils/constants");

const router = express.Router();
router.post("/initialize", express.json(), auth, restrictTo(ROLES.CUSTOMER), [body("orderId").isMongoId()], validate, initializePayment);

module.exports = router;