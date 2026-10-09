const express = require("express");
const protect = require("../middleware/auth.middleware");
const authorizeRoles = require("../middleware/role.middleware");

const {
    createRecruiterProfile,
    getRecruiterProfile,
    updateRecruiterProfile,
    getRecruiterDashboard
} = require("../controllers/recruiter.controller");

const router = express.Router();

router.post("/profile", protect, authorizeRoles("recruiter"), createRecruiterProfile);
router.get("/profile", protect, authorizeRoles("recruiter"), getRecruiterProfile);
router.put("/profile", protect, authorizeRoles("recruiter"), updateRecruiterProfile);
router.get("/dashboard", protect, authorizeRoles("recruiter"), getRecruiterDashboard);

module.exports = router;