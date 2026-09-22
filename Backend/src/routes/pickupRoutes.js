const express = require("express");
const { body } = require("express-validator");
const auth = require("../middleware/authMiddleware");
const restrictTo = require("../middleware/roleMiddleware");
const validate = require("../middleware/validateMiddleware");
const { createPickup, listPickups, updatePickupStatus } = require("../controllers/pickupController");

const router = express.Router();
router.use(auth);
router.get("/", listPickups);
router.post("/", [body("address").trim().notEmpty(), body("scheduledFor").isISO8601()], validate, createPickup);
router.patch("/:id/status", restrictTo("admin"), [body("status").isIn(["requested", "assigned", "picked_up", "completed", "cancelled"])], validate, updatePickupStatus);
module.exports = router;