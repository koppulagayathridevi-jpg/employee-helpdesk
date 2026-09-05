const Ticket = require("../models/Ticket");
const User = require("../models/User");
const Department = require("../models/Department");

// ===============================
// ADMIN DASHBOARD STATISTICS
// ===============================
const getDashboardStats = async (req, res) => {
    try {
        // Total tickets
        const totalTickets = await Ticket.countDocuments();

        // Ticket status counts
        const openTickets = await Ticket.countDocuments({
            status: "Open"
        });

        const assignedTickets = await Ticket.countDocuments({
            status: "Assigned"
        });

        const inProgressTickets = await Ticket.countDocuments({
            status: "In Progress"
        });

        const waitingTickets = await Ticket.countDocuments({
            status: "Waiting for Employee"
        });

        const resolvedTickets = await Ticket.countDocuments({
            status: "Resolved"
        });

        const closedTickets = await Ticket.countDocuments({
            status: "Closed"
        });

        // Critical tickets
        const criticalTickets = await Ticket.countDocuments({
            priority: "Critical"
        });

        // Overdue tickets
        // We will implement proper SLA/deadline logic later.
        // const overdueTickets = 0;
        const overdueTickets = await Ticket.countDocuments({
    slaDeadline: {
        $lt: new Date()
    },
    status: {
        $nin: ["Resolved", "Closed"]
    }
});

        res.status(200).json({
            success: true,
            statistics: {
                totalTickets,
                openTickets,
                assignedTickets,
                inProgressTickets,
                waitingTickets,
                resolvedTickets,
                closedTickets,
                criticalTickets,
                overdueTickets
            }
        });

    } catch (error) {
        console.error("Admin dashboard error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to load admin dashboard statistics."
        });
    }
};



// =====================================
// ADMIN - GET ALL TICKETS
// =====================================
const getAdminTickets = async (req, res) => {
    try {
        const {
            search,
            status,
            priority,
            department,
            category,
            assignedTo
        } = req.query;

        const filter = {};

        // ==============================
        // STATUS FILTER
        // ==============================
        if (status && status !== "All") {
            filter.status = status;
        }

        // ==============================
        // PRIORITY FILTER
        // ==============================
        if (priority && priority !== "All") {
            filter.priority = priority;
        }

        // ==============================
        // DEPARTMENT FILTER
        // ==============================
        if (department && department !== "All") {
            filter.department = department;
        }

        // ==============================
        // CATEGORY FILTER
        // ==============================
        if (category && category !== "All") {
            filter.category = category;
        }

        // ==============================
        // ASSIGNED AGENT FILTER
        // ==============================
        if (assignedTo && assignedTo !== "All") {
            filter.assignedTo = assignedTo;
        }

        // ==============================
        // SEARCH FILTER
        // ==============================
        if (search && search.trim()) {
            const searchValue = search.trim();

            const users = await User.find({
                $or: [
                    {
                        name: {
                            $regex: searchValue,
                            $options: "i"
                        }
                    },
                    {
                        email: {
                            $regex: searchValue,
                            $options: "i"
                        }
                    },
                    {
                        employeeId: {
                            $regex: searchValue,
                            $options: "i"
                        }
                    }
                ]
            }).select("_id");

            const userIds = users.map(user => user._id);

            filter.$or = [
                {
                    title: {
                        $regex: searchValue,
                        $options: "i"
                    }
                },
                {
                    description: {
                        $regex: searchValue,
                        $options: "i"
                    }
                },
                {
                    category: {
                        $regex: searchValue,
                        $options: "i"
                    }
                },
                {
                    createdBy: {
                        $in: userIds
                    }
                },
                {
                    assignedTo: {
                        $in: userIds
                    }
                }
            ];
        }

        // ==============================
        // FETCH TICKETS
        // ==============================
        const tickets = await Ticket.find(filter)
            .populate(
                "createdBy",
                "name email employeeId department"
            )
            .populate(
                "assignedTo",
                "name email employeeId department"
            )
            .sort({
                createdAt: -1
            });

        res.status(200).json({
            success: true,
            count: tickets.length,
            filters: {
                search: search || "",
                status: status || "All",
                priority: priority || "All",
                department: department || "All",
                category: category || "All",
                assignedTo: assignedTo || "All"
            },
            tickets
        });

    } catch (error) {
        console.error(
            "Admin tickets error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to fetch admin tickets."
        });
    }
};
// =====================================
// ADMIN - GET ALL USERS
// =====================================
const getAdminUsers = async (req, res) => {
    try {
        const {
            search,
            role,
            department
        } = req.query;

        const filter = {};

        // Search by name, email or employee ID
        if (search && search.trim()) {
            filter.$or = [
                {
                    name: {
                        $regex: search.trim(),
                        $options: "i"
                    }
                },
                {
                    email: {
                        $regex: search.trim(),
                        $options: "i"
                    }
                },
                {
                    employeeId: {
                        $regex: search.trim(),
                        $options: "i"
                    }
                }
            ];
        }

        // Role filter
        if (role && role !== "All") {
            filter.role = role;
        }

        // Department filter
        if (department && department !== "All") {
            filter.department = department;
        }

        const users = await User.find(filter)
            .select("-password")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: users.length,
            users
        });

    } catch (error) {
        console.error("Admin users error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch users."
        });
    }
};

// =====================================
// ADMIN - GET USER BY ID
// =====================================
const getAdminUserById = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findById(id)
            .select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        res.status(200).json({
            success: true,
            user
        });

    } catch (error) {
        console.error("Admin user details error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch user details."
        });
    }
};

// =====================================
// ADMIN - UPDATE USER STATUS
// =====================================
const updateUserStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { isActive } = req.body;

        if (typeof isActive !== "boolean") {
            return res.status(400).json({
                success: false,
                message: "isActive must be true or false."
            });
        }

        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        // Prevent admin from deactivating themselves
        if (
            user._id.toString() === req.user._id.toString() &&
            isActive === false
        ) {
            return res.status(400).json({
                success: false,
                message: "You cannot deactivate your own account."
            });
        }

        user.isActive = isActive;

        await user.save();

        res.status(200).json({
            success: true,
            message: isActive
                ? "User activated successfully."
                : "User deactivated successfully.",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                department: user.department,
                isActive: user.isActive
            }
        });

    } catch (error) {
        console.error("Update user status error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to update user status."
        });
    }
};

// ==========================================
// GET ALL DEPARTMENTS
// ==========================================

const getDepartments = async (req, res) => {
    try {
        const departments = await Department.find()
            .sort({ name: 1 });

        const departmentsWithCounts = await Promise.all(
            departments.map(async (department) => {

                const userCount = await User.countDocuments({
                    department: department.name
                });

                const ticketCount = await Ticket.countDocuments({
                    department: department.name
                });

                return {
                    _id: department._id,
                    name: department.name,
                    description: department.description,
                    isActive: department.isActive,
                    userCount,
                    ticketCount,
                    createdAt: department.createdAt
                };
            })
        );

        res.status(200).json({
            success: true,
            count: departmentsWithCounts.length,
            departments: departmentsWithCounts
        });

    } catch (error) {

        console.error("Get departments error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch departments."
        });
    }
};


// ==========================================
// CREATE DEPARTMENT
// ==========================================

const createDepartment = async (req, res) => {
    try {

        const { name, description } = req.body;

        if (!name || !name.trim()) {
            return res.status(400).json({
                success: false,
                message: "Department name is required."
            });
        }

        const existingDepartment = await Department.findOne({
            name: name.trim()
        });

        if (existingDepartment) {
            return res.status(400).json({
                success: false,
                message: "Department already exists."
            });
        }

        const department = await Department.create({
            name: name.trim(),
            description: description ? description.trim() : ""
        });

        res.status(201).json({
            success: true,
            message: "Department created successfully.",
            department
        });

    } catch (error) {

        console.error("Create department error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to create department."
        });
    }
};


// ==========================================
// UPDATE DEPARTMENT
// ==========================================

const updateDepartment = async (req, res) => {
    try {

        const { id } = req.params;
        const { name, description, isActive } = req.body;

        const department = await Department.findById(id);

        if (!department) {
            return res.status(404).json({
                success: false,
                message: "Department not found."
            });
        }

        if (name && name.trim() !== department.name) {

            const existingDepartment = await Department.findOne({
                name: name.trim(),
                _id: { $ne: id }
            });

            if (existingDepartment) {
                return res.status(400).json({
                    success: false,
                    message: "Another department with this name already exists."
                });
            }

            department.name = name.trim();
        }

        if (description !== undefined) {
            department.description = description.trim();
        }

        if (typeof isActive === "boolean") {
            department.isActive = isActive;
        }

        await department.save();

        res.status(200).json({
            success: true,
            message: "Department updated successfully.",
            department
        });

    } catch (error) {

        console.error("Update department error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to update department."
        });
    }
};


// ==========================================
// DELETE / DEACTIVATE DEPARTMENT
// ==========================================

const deleteDepartment = async (req, res) => {
    try {

        const { id } = req.params;

        const department = await Department.findById(id);

        if (!department) {
            return res.status(404).json({
                success: false,
                message: "Department not found."
            });
        }

        department.isActive = false;

        await department.save();

        res.status(200).json({
            success: true,
            message: "Department deactivated successfully."
        });

    } catch (error) {

        console.error("Delete department error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to deactivate department."
        });
    }
};


// ==========================================
// ADMIN REPORTS & ANALYTICS
// ==========================================

const getAdminReports = async (req, res) => {
    try {
        // -----------------------------
        // Tickets by Status
        // -----------------------------
        const ticketsByStatus = await Ticket.aggregate([
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { count: -1 }
            }
        ]);

        // -----------------------------
        // Tickets by Priority
        // -----------------------------
        const ticketsByPriority = await Ticket.aggregate([
            {
                $group: {
                    _id: "$priority",
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { count: -1 }
            }
        ]);

        // -----------------------------
        // Tickets by Department
        // -----------------------------
        const ticketsByDepartment = await Ticket.aggregate([
            {
                $group: {
                    _id: "$department",
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { count: -1 }
            }
        ]);

        // -----------------------------
        // Tickets by Category
        // -----------------------------
        const ticketsByCategory = await Ticket.aggregate([
            {
                $group: {
                    _id: "$category",
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { count: -1 }
            }
        ]);

        // -----------------------------
        // Average Resolution Time
        // -----------------------------
        const resolutionStats = await Ticket.aggregate([
            {
                $match: {
                    resolvedAt: { $ne: null },
                    createdAt: { $ne: null }
                }
            },
            {
                $project: {
                    resolutionTimeMs: {
                        $subtract: ["$resolvedAt", "$createdAt"]
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    averageResolutionTimeMs: {
                        $avg: "$resolutionTimeMs"
                    },
                    resolvedTicketCount: {
                        $sum: 1
                    }
                }
            }
        ]);

        let averageResolutionTimeHours = 0;
        let resolvedTicketCount = 0;

        if (resolutionStats.length > 0) {
            averageResolutionTimeHours =
                resolutionStats[0].averageResolutionTimeMs /
                (1000 * 60 * 60);

            resolvedTicketCount =
                resolutionStats[0].resolvedTicketCount;
        }

        // -----------------------------
        // Agent Performance
        // -----------------------------
        const agentPerformanceData = await Ticket.aggregate([
            {
                $match: {
                    assignedTo: { $ne: null }
                }
            },
            {
                $group: {
                    _id: "$assignedTo",

                    assignedTickets: {
                        $sum: 1
                    },

                    resolvedTickets: {
                        $sum: {
                            $cond: [
                                {
                                    $in: [
                                        "$status",
                                        ["Resolved", "Closed"]
                                    ]
                                },
                                1,
                                0
                            ]
                        }
                    },

                    openTickets: {
                        $sum: {
                            $cond: [
                                {
                                    $in: [
                                        "$status",
                                        [
                                            "Assigned",
                                            "In Progress",
                                            "Waiting for Employee"
                                        ]
                                    ]
                                },
                                1,
                                0
                            ]
                        }
                    }
                }
            }
        ]);

        const agentPerformance = [];

        for (const agent of agentPerformanceData) {
            const user = await User.findById(agent._id)
                .select("name email employeeId department role");

            if (user) {
                agentPerformance.push({
                    agent: {
                        id: user._id,
                        name: user.name,
                        email: user.email,
                        employeeId: user.employeeId,
                        department: user.department,
                        role: user.role
                    },
                    assignedTickets: agent.assignedTickets,
                    resolvedTickets: agent.resolvedTickets,
                    openTickets: agent.openTickets
                });
            }
        }

        // -----------------------------
        // Response
        // -----------------------------
        res.status(200).json({
            success: true,

            ticketsByStatus,

            ticketsByPriority,

            ticketsByDepartment,

            ticketsByCategory,

            resolutionMetrics: {
                resolvedTicketCount,
                averageResolutionTimeHours:
                    Number(averageResolutionTimeHours.toFixed(2))
            },

            agentPerformance
        });

    } catch (error) {
        console.error("Admin reports error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to generate admin reports."
        });
    }
};


module.exports = {
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
};