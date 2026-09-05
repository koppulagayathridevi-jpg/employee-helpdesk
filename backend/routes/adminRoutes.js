const express = require("express");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const {
    getDashboardStats,
    getAdminTickets,
    getAdminUsers,
    getAdminUserById,
    updateUserStatus,
    getDepartments,
    createDepartment,
    updateDepartment,
    deleteDepartment,
    getAdminReports
} = require("../controllers/adminController");

const router = express.Router();

// =====================================
// ADMIN DASHBOARD
// =====================================
router.get(
    "/dashboard",
    authMiddleware,
    adminMiddleware,
    getDashboardStats
);

// =====================================
// ADMIN - GET ALL TICKETS
// =====================================
router.get(
    "/tickets",
    authMiddleware,
    adminMiddleware,
    getAdminTickets
);

// =====================================
// ADMIN - USER MANAGEMENT
// =====================================

router.get(
    "/users",
    authMiddleware,
    adminMiddleware,
    getAdminUsers
);

router.get(
    "/users/:id",
    authMiddleware,
    adminMiddleware,
    getAdminUserById
);

router.patch(
    "/users/:id/status",
    authMiddleware,
    adminMiddleware,
    updateUserStatus
);

// ==========================================
// DEPARTMENT MANAGEMENT
// ==========================================

router.get(
    "/departments",
    authMiddleware,
    adminMiddleware,
    getDepartments
);

router.post(
    "/departments",
    authMiddleware,
    adminMiddleware,
    createDepartment
);

router.put(
    "/departments/:id",
    authMiddleware,
    adminMiddleware,
    updateDepartment
);

router.delete(
    "/departments/:id",
    authMiddleware,
    adminMiddleware,
    deleteDepartment
);


router.get(
    "/reports",
    authMiddleware,
    adminMiddleware,
    getAdminReports
);
module.exports = router;