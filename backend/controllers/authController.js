

const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ===============================
// REGISTER USER
// ===============================
const registerUser = async (req, res) => {
    try {
        const {
            name,
            email,
            password,
            department,
            phone,
            role
        } = req.body;
        console.log("========== REGISTER DEBUG ==========");
console.log("Name:", name);
console.log("Email:", email);
console.log("Department:", department);
console.log("Role:", role);
console.log("====================================");

        // Check required fields
        if (
            !name ||
            !email ||
            !password ||
            !department
        ) {
            return res.status(400).json({
                message: "Please fill all required fields"
            });
        }

        // Check if email already exists
        const existingEmail = await User.findOne({
            email: email.toLowerCase().trim()
        });

        if (existingEmail) {
            return res.status(400).json({
                message: "Email already registered"
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await User.create({
            name: name.trim(),
            email: email.toLowerCase().trim(),
            password: hashedPassword,
            department: department.trim(),
            phone: phone || "",
            role: role || "employee"
        });

        // Response
        res.status(201).json({
            success: true,
            message: "Registration successful",

            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                department: user.department,
                phone: user.phone,
                role: user.role,
                profileImage: user.profileImage,
                isActive: user.isActive
            }
        });

    } catch (error) {
        console.error("Registration error:", error);

        // Duplicate key error
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: "Email already registered"
            });
        }

        res.status(500).json({
            success: false,
            message: "Server error during registration"
        });
    }
};


// ===============================
// LOGIN USER
// ===============================
const loginUser = async (req, res) => {
    try {
        const {
            email,
            password
        } = req.body;

        // Check required fields
        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        // Find user
        const user = await User.findOne({
            email: email.toLowerCase().trim()
        });

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        // Check account status
        if (!user.isActive) {
            return res.status(403).json({
                message: "Your account has been deactivated"
            });
        }

        // Compare password
        const isPasswordCorrect = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordCorrect) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        // Clean role
        const userRole = user.role?.trim() || "employee";

        // Create JWT token
        const token = jwt.sign(
            {
                id: user._id,
                role: userRole,
                email: user.email
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );

        // Send response
        res.status(200).json({
            success: true,
            message: "Login successful",

            token,

            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                department: user.department,
                phone: user.phone,
                role: userRole,
                profileImage: user.profileImage,
                isActive: user.isActive
            }
        });

    } catch (error) {
        console.error("Login error:", error);

        res.status(500).json({
            success: false,
            message: "Server error during login"
        });
    }
};


// ===============================
// EXPORT
// ===============================
module.exports = {
    registerUser,
    loginUser
};