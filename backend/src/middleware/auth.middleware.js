const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: "Authorization token required"
            });
        }
        if (!authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Invalid authorization format"
            });
        }
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const userId = decoded.userId || decoded.id || decoded._id;
        let role = decoded.role;

        if (userId) {
            const user = await User.findById(userId).select("role");
            if (user && user.role) {
                role = user.role;
            }
        }

        req.user = {
            _id: userId,
            userId: userId,
            role: role
        };
        next();

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token"
        });
    }
};

module.exports = protect;