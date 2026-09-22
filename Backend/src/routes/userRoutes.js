const express = require("express");
const auth = require("../middleware/authMiddleware");
const { getProfile, updateProfile } = require("../controllers/userController");

const router = express.Router();
router.use(auth);
router.get("/me", getProfile);
router.patch("/me", updateProfile);
module.exports = router;