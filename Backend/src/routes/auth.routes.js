const express = require("express");
const { body } = require("express-validator");
const { login, me, register } = require("../controllers/auth.controller");
const auth = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validate.middleware");
const { PUBLIC_ROLES, ROLES } = require("../utils/constants");

const router = express.Router();

router.post(
  "/register",
  [
    body("fullName").optional().trim().notEmpty(),
    body("name").optional().trim().notEmpty(),
    body("email").isEmail().normalizeEmail(),
    body("password").isLength({ min: 6 }),
    body("phone").optional().isString().trim(),
    body("role").optional().isIn(PUBLIC_ROLES),
    body("address").optional().isString().trim(),
    body("businessName").optional().isString().trim(),
    body("businessAddress").optional().isString().trim(),
  ],
  validate,
  register
);
router.post(
  "/login",
  [body("email").isEmail().normalizeEmail(), body("password").notEmpty(), body("role").optional().isIn(Object.values(ROLES))],
  validate,
  login
);
router.get("/me", auth, me);

module.exports = router;