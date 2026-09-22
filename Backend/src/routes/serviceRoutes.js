const express = require("express");
const { body } = require("express-validator");
const auth = require("../middleware/authMiddleware");
const restrictTo = require("../middleware/roleMiddleware");
const validate = require("../middleware/validateMiddleware");
const { listServices, createService, updateService } = require("../controllers/serviceController");

const router = express.Router();
router.get("/", listServices);
router.post("/", auth, restrictTo("admin"), [body("name").trim().notEmpty(), body("price").isFloat({ min: 0 }), body("turnaroundHours").isInt({ min: 1 })], validate, createService);
router.patch("/:id", auth, restrictTo("admin"), updateService);
module.exports = router;