const User = require("../models/User");

// =====================================
// GET CURRENT PROFILE
// =====================================
const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.status(200).json({
            message: "Profile fetched successfully",
            user
        });

    } catch (error) {
        console.error("Get profile error:", error);

        res.status(500).json({
            message: "Server error while fetching profile"
        });
    }
};


// =====================================
// UPDATE CURRENT PROFILE
// =====================================
const updateProfile = async (req, res) => {
    try {
        const {
            name,
            department,
            phone
        } = req.body;

        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        // Update only allowed fields
        if (name !== undefined) {
            user.name = name.trim();
        }

        if (department !== undefined) {
            user.department = department.trim();
        }

        if (phone !== undefined) {
            user.phone = phone.trim();
        }

        await user.save();

        res.status(200).json({
            message: "Profile updated successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                employeeId: user.employeeId,
                department: user.department,
                phone: user.phone,
                role: user.role,
                isActive: user.isActive
            }
        });

    } catch (error) {
        console.error("Update profile error:", error);

        res.status(500).json({
            message: "Server error while updating profile"
        });
    }
};

const getSupportAgents = async (req, res) => {
    try {
        const agents = await User.find({
            role: "supportAgent",
            isActive: true
        }).select(
            "name email employeeId department role"
        );

        res.status(200).json({
            message: "Support agents fetched successfully",
            count: agents.length,
            agents
        });
    } catch (error) {
        console.error("Get support agents error:", error);

        res.status(500).json({
            message: "Server error while fetching support agents"
        });
    }
};

module.exports = {
    getProfile,
    updateProfile,
    getSupportAgents
};