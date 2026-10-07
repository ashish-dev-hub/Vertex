const express = require("express");
const protect = require("../middleware/auth.middleware");
const authorizeRoles = require("../middleware/role.middleware");

const router = express.Router();

router.get("/student",protect,authorizeRoles("student"),
    (req, res) => {res.status(200).json({
            success: true,
            message: "Student route accessed successfully",
            user: req.user
        });
    }
);

router.get("/recruiter",protect,authorizeRoles("recruiter"),
    (req, res) => {res.status(200).json({
            success: true,
            message: "Recruiter route accessed successfully",
            user: req.user
        });
    }
);

router.get("/both",protect,authorizeRoles("student", "recruiter"),
        (req, res) => {res.status(200).json({
            success: true,
            message: "Both student and recruiter can access this route",
            user: req.user
        });
    }
);

module.exports = router;