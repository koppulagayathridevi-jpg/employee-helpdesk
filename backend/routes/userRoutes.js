const express = require("express");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const {
    getProfile,
    updateProfile,
    getSupportAgents
} = require("../controllers/userController");

const router = express.Router();

// =====================================
// GET CURRENT USER
// =====================================
router.get(
    "/me",
    authMiddleware,
    getProfile
);

// =====================================
// UPDATE CURRENT PROFILE
// =====================================
router.put(
    "/profile",
    authMiddleware,
    updateProfile
);

router.get(
    "/support-agents",
    authMiddleware,
    roleMiddleware("supportAgent", "admin"),
    getSupportAgents
);

module.exports = router;