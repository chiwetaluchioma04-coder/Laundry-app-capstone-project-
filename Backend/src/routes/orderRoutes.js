const express = require("express");
const { body } = require("express-validator");
const auth = require("../middleware/authMiddleware");
const restrictTo = require("../middleware/roleMiddleware");
const validate = require("../middleware/validateMiddleware");
const { createOrder, listOrders, updateOrderStatus } = require("../controllers/orderController");

const router = express.Router();
router.use(auth);
router.get("/", listOrders);
router.post("/", [body("pickup").isMongoId(), body("items").isArray({ min: 1 }), body("items.*.service").isMongoId(), body("items.*.quantity").isInt({ min: 1 })], validate, createOrder);
router.patch("/:id/status", restrictTo("admin"), [body("status").isIn(["pending", "processing", "ready", "delivered", "cancelled"])], validate, updateOrderStatus);
module.exports = router;