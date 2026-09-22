const express = require("express");
const { body } = require("express-validator");
const validate = require("../middleware/validateMiddleware");
const { register, login } = require("../controllers/authController");

const router = express.Router();
router.post("/register", [body("name").trim().notEmpty(), body("email").isEmail(), body("password").isLength({ min: 6 })], validate, register);
router.post("/login", [body("email").isEmail(), body("password").notEmpty()], validate, login);
module.exports = router;