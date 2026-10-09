const mongoose = require("mongoose");
const Application = require("../models/Application");
const Job = require("../models/Job");

const applyToJob = async (req, res) => {   // Student applies for a job
    try {const { jobId } = req.body;
        if (!jobId) {
            return res.status(400).json({
                success: false,
                message: "Job ID is required"
            });
        }
        if (!mongoose.isObjectIdOrHexString(jobId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid job ID"
            });
        }

        const job = await Job.findById(jobId);       // Check whether the job exists
        if (!job) {
            return res.status(404).json({
                success: false,
                message: "Job not found"
            });
        }
        if (job.status !== "open") {
            return res.status(400).json({
                success: false,
                message: "This job is closed"
            });
        }
        if (
            job.applicationDeadline &&
            new Date(job.applicationDeadline) < new Date()
        ) {
            return res.status(400).json({
                success: false,
                message: "Application deadline has passed"
            });
        }
        const existingApplication = await Application.findOne({
            student: req.user._id,
            job: jobId
        });

        if (existingApplication) {
            return res.status(409).json({
                success: false,
                message: "You have already applied for this job"
            });
        }

        const application = await Application.create({
            student: req.user._id,
            job: jobId
        });

        return res.status(201).json({
            success: true,
            message: "Application submitted successfully",
            application
        });

    } catch (error) {
        // Handles duplicate applications even if two requests arrive together
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "You have already applied for this job"
            });
        }

        console.error("Apply to job error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


// 2. Student gets their own applications
const getMyApplications = async (req, res) => {
    try {
        const applications = await Application.find({
            student: req.user._id
        })
            .populate("job")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: applications.length,
            applications
        });

    } catch (error) {
        console.error("Get my applications error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


// 3. Get a single application
const getApplicationById = async (req, res) => {
    try {
        const { applicationId } = req.params;

        if (!mongoose.isObjectIdOrHexString(applicationId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid application ID"
            });
        }

        const application = await Application.findById(applicationId)
            .populate("job");

        if (!application) {
            return res.status(404).json({
                success: false,
                message: "Application not found"
            });
        }

        // Only the applicant or the recruiter who owns the job can view it
        const isStudentOwner =
            req.user.role === "student" &&
            application.student.toString() === req.user._id.toString();

        const isRecruiterOwner =
            req.user.role === "recruiter" &&
            application.job &&
            application.job.recruiter.toString() === req.user._id.toString();

        if (!isStudentOwner && !isRecruiterOwner) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to view this application"
            });
        }

        return res.status(200).json({
            success: true,
            application
        });

    } catch (error) {
        console.error("Get application error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


// 4. Recruiter gets applicants for their job
const getApplicantsForJob = async (req, res) => {
    try {
        const { jobId } = req.params;

        if (!mongoose.isObjectIdOrHexString(jobId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid job ID"
            });
        }

        const job = await Job.findById(jobId);

        if (!job) {
            return res.status(404).json({
                success: false,
                message: "Job not found"
            });
        }

        // Recruiters can only view applicants for their own jobs
        if (job.recruiter.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "You can only view applicants for your own jobs"
            });
        }

        const applications = await Application.find({
            job: jobId
        })
            .populate("student", "name email")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            job: {
                id: job._id,
                title: job.title
            },
            count: applications.length,
            applications
        });

    } catch (error) {
        console.error("Get applicants error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


// 5. Recruiter updates application status
const updateApplicationStatus = async (req, res) => {
    try {
        const { applicationId } = req.params;
        const { status } = req.body;

        if (!mongoose.isObjectIdOrHexString(applicationId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid application ID"
            });
        }

        const allowedStatuses = [
            "pending",
            "shortlisted",
            "accepted",
            "rejected"
        ];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid status. Allowed statuses: pending, shortlisted, accepted, rejected"
            });
        }

        const application = await Application.findById(applicationId)
            .populate("job");

        if (!application) {
            return res.status(404).json({
                success: false,
                message: "Application not found"
            });
        }

        if (!application.job) {
            return res.status(404).json({
                success: false,
                message: "Associated job not found"
            });
        }

        
        if (
            application.job.recruiter.toString() !==
            req.user._id.toString()
        ) {         // Only the recruiter who owns the job can change the status
            return res.status(403).json({
                success: false,
                message: "You can only update applications for your own jobs"
            });
        }

        application.status = status;

        await application.save();

        return res.status(200).json({
            success: true,
            message: "Application status updated successfully",
            application
        });

    } catch (error) {
        console.error("Update application status error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


module.exports = {
    applyToJob,
    getMyApplications,
    getApplicationById,
    getApplicantsForJob,
    updateApplicationStatus
};