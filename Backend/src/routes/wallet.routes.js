const express = require("express");
const { body } = require("express-validator");
const { getBalance, listWithdrawals, withdraw } = require("../controllers/wallet.controller");
const auth = require("../middlewares/auth.middleware");
const restrictTo = require("../middlewares/role.middleware");
const validate = require("../middlewares/validate.middleware");
const { MIN_WITHDRAWAL_AMOUNT, ROLES } = require("../utils/constants");

const router = express.Router();
router.use(auth, restrictTo(ROLES.VENDOR));
router.get("/", getBalance);
router.post("/withdraw", [body("amount").isInt({ min: MIN_WITHDRAWAL_AMOUNT }).toInt()], validate, withdraw);
router.get("/withdrawals", listWithdrawals);

module.exports = router;