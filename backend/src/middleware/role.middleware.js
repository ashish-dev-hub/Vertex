const authorizeRoles = (...allowedRoles) => {return (req, res, next) => {
       
        if (!req.user) {
            return res.status(401).json({
                success: false,                // user authenticated hona chaiye
                message: "Authentication required"
            });
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({       // users ka role check karo
                success: false,
                message: "You are not authorized to access this resource"
            });
        }
        next();
    };
};

module.exports = authorizeRoles;