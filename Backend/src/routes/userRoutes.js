const express = require("express");
const auth = require("../middlewares/auth.middleware");
const { getProfile, updateProfile, getAllUsers, getUser } = require("../controllers/userController");
const restrictTo = require("../middlewares/role.middleware");

const router = express.Router();
router.use(auth);

// Get current user profile; for all authenticated users
router.get("/me", getProfile);

// Update current user profile; for all authenticated users
router.patch("/me", updateProfile);

// Get all users; this is for admins
router.get("/", restrictTo("admin"), getAllUsers);

// Get user by ID; for admins
router.get("/:id", restrictTo("admin"), getUser);

module.exports = router;