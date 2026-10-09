const express = require("express");
const router = express.Router();

const { applyToJob, getMyApplications, getApplicationById, getApplicantsForJob, updateApplicationStatus } = require("../controllers/application.controller");

const protect = require("../middleware/auth.middleware");
const authorizeRoles = require("../middleware/role.middleware");

router.post("/", protect, authorizeRoles("student"), applyToJob);

router.get("/my", protect, authorizeRoles("student"), getMyApplications);

router.get("/job/:jobId", protect, authorizeRoles("recruiter"), getApplicantsForJob);

router.patch("/:applicationId/status", protect, authorizeRoles("recruiter"), updateApplicationStatus);

router.get("/:applicationId", protect, getApplicationById);

module.exports = router;