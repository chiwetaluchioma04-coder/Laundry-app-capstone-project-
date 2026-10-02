const express = require("express");
const { body, param, query } = require("express-validator");
const {
  listPayments,
  listPendingWithdrawals,
  updateWithdrawal,
  verifyPayment,
} = require("../controllers/admin.controller");
const auth = require("../middlewares/auth.middleware");
const restrictTo = require("../middlewares/role.middleware");
const validate = require("../middlewares/validate.middleware");
const { ROLES } = require("../utils/constants");

const router = express.Router();
router.use(auth, restrictTo(ROLES.ADMIN));
router.get("/payments", [query("status").optional().isIn(["pending", "verified", "all"])], validate, listPayments);
router.post("/payments/:id/verify", [param("id").isMongoId()], validate, verifyPayment);
router.get("/withdrawals", listPendingWithdrawals);
router.patch(
  "/withdrawals/:id",
  [param("id").isMongoId(), body("status").isIn(["paid", "failed"])],
  validate,
  updateWithdrawal
);

module.exports = router;