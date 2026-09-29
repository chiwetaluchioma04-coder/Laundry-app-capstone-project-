const express = require("express");
const { body } = require("express-validator");
const validate = require("../middleware/validateMiddleware");
const { register, login, forgotPassword, resetPassword } = require("../controllers/authController");
const router = express.Router();

router.post("/register", [body("name").trim().notEmpty(), body("email").isEmail(), body("password").isLength({ min: 6 })], validate, register);
router.post("/login", [body("email").isEmail(), body("password").notEmpty()], validate, login);
router.post("/forgot-password", [body("email").isEmail()], validate, forgotPassword);
router.post("/reset-password", [body("resetToken").notEmpty(), body("password").isLength({ min: 6 })], validate, resetPassword);

module.exports = router;