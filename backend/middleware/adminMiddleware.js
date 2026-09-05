const adminMiddleware = (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                message: "Authentication required."
            });
        }

        // Remove accidental spaces from role
        const userRole = req.user.role?.trim();

        console.log("========== ADMIN DEBUG ==========");
        console.log("User Email:", req.user.email);
        console.log("Original Role:", JSON.stringify(req.user.role));
        console.log("Trimmed Role:", JSON.stringify(userRole));
        console.log("================================");

        if (userRole !== "admin") {
            return res.status(403).json({
                message: "Access denied. Admins only."
            });
        }

        next();

    } catch (error) {
        console.error("Admin middleware error:", error);

        return res.status(500).json({
            message: "Server error."
        });
    }
};

module.exports = adminMiddleware;