const mongoose = require("mongoose");
const Job = require("../models/Job");

const validateJobData = (data) => {
    const {
        title,
        description,
        skills,
        workMode,
        jobType,
        salaryMin,
        salaryMax,
        applicationDeadline
    } = data;

    if (title !== undefined && (typeof title !== "string" || !title.trim())) {
        return "Job title cannot be empty";
    }

    if (description !== undefined && (typeof description !== "string" || !description.trim())) {
        return "Job description cannot be empty";
    }

    if (skills !== undefined && (!Array.isArray(skills) || skills.some(skill => typeof skill !== "string"))) {
        return "Skills must be an array of strings";
    }

    if (workMode !== undefined && !["remote", "onsite", "hybrid"].includes(workMode)) {
        return "Invalid work mode";
    }

    if (jobType !== undefined && !["internship", "full-time", "part-time"].includes(jobType)) {
        return "Invalid job type";
    }

    if (salaryMin !== undefined && (!Number.isFinite(Number(salaryMin)) || Number(salaryMin) < 0)) {
        return "Minimum salary must be a non-negative number";
    }

    if (salaryMax !== undefined && (!Number.isFinite(Number(salaryMax)) || Number(salaryMax) < 0)) {
        return "Maximum salary must be a non-negative number";
    }

    if (
        salaryMin !== undefined &&
        salaryMax !== undefined &&
        Number(salaryMin) > Number(salaryMax)
    ) {
        return "Minimum salary cannot exceed maximum salary";
    }

    if (
        applicationDeadline !== undefined &&
        applicationDeadline !== null &&
        applicationDeadline !== ""
    ) {
        if (Number.isNaN(Date.parse(applicationDeadline))) {
            return "Invalid application deadline";
        }
    }

    return null;
};

const validateRequiredJobFields = (data) => {
    const { title, description, workMode, jobType } = data;

    if (typeof title !== "string" || !title.trim()) {
        return "Job title is required";
    }

    if (typeof description !== "string" || !description.trim()) {
        return "Job description is required";
    }

    if (!workMode) {
        return "Work mode is required";
    }

    if (!jobType) {
        return "Job type is required";
    }

    return null;
};

// Create Job
const createJob = async (req, res) => {
    try {
        const validationError = validateJobData(req.body);

        if (validationError) {
            return res.status(400).json({
                success: false,
                message: validationError
            });
        }

        const requiredFieldsError = validateRequiredJobFields(req.body);

        if (requiredFieldsError) {
            return res.status(400).json({
                success: false,
                message: requiredFieldsError
            });
        }

        const recruiterId = req.user._id;

        const {
            title,
            description,
            skills,
            experience,
            location,
            workMode,
            jobType,
            salaryMin,
            salaryMax,
            applicationDeadline
        } = req.body;

        const job = await Job.create({
            recruiter: recruiterId,
            title: title.trim(),
            description: description.trim(),
            skills,
            experience,
            location,
            workMode,
            jobType,
            salaryMin,
            salaryMax,
            applicationDeadline
        });

        return res.status(201).json({
            success: true,
            message: "Job created successfully",
            job
        });

    } catch (error) {
        console.error("Create job error:", error);

        if (error.name === "ValidationError") {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }

        return res.status(500).json({
            success: false,
            message: "Failed to create job"
        });
    }
};

// Get All Jobs
const getAllJobs = async (req, res) => {
    try {
        const jobs = await Job.find()
            .populate("recruiter", "name email")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: jobs.length,
            jobs
        });

    } catch (error) {
        console.error("Get all jobs error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch jobs"
        });
    }
};

// Get Job By ID
const getJobById = async (req, res) => {
    try {
        const { jobId } = req.params;

        if (!mongoose.isValidObjectId(jobId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid job ID"
            });
        }

        const job = await Job.findById(jobId)
            .populate("recruiter", "name email");

        if (!job) {
            return res.status(404).json({
                success: false,
                message: "Job not found"
            });
        }

        return res.status(200).json({
            success: true,
            job
        });

    } catch (error) {
        console.error("Get job error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch job"
        });
    }
};


const getMyJobs = async (req, res) => {
    try {                                       // Get Recruiter's Own Jobs
        const recruiterId = req.user._id;

        const jobs = await Job.find({ recruiter: recruiterId })
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: jobs.length,
            jobs
        });

    } catch (error) {
        console.error("Get recruiter jobs error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch your jobs"
        });
    }
};


const updateJob = async (req, res) => {
    try {                                        // Update Job
        const { jobId } = req.params;
        const recruiterId = req.user._id;

        if (!mongoose.isValidObjectId(jobId)) {
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

        if (job.recruiter.toString() !== recruiterId.toString()) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to update this job"
            });
        }

        const validationError = validateJobData(req.body);

        if (validationError) {
            return res.status(400).json({
                success: false,
                message: validationError
            });
        }

        const nextSalaryMin = req.body.salaryMin !== undefined
            ? Number(req.body.salaryMin)
            : job.salaryMin;

        const nextSalaryMax = req.body.salaryMax !== undefined
            ? Number(req.body.salaryMax)
            : job.salaryMax;

        if (
            nextSalaryMin != null &&
            nextSalaryMax != null &&
            nextSalaryMin > nextSalaryMax
        ) {
            return res.status(400).json({
                success: false,
                message: "Minimum salary cannot exceed maximum salary"
            });
        }

        const {
            title,
            description,
            skills,
            experience,
            location,
            workMode,
            jobType,
            salaryMin,
            salaryMax,
            applicationDeadline
        } = req.body;

        if (title !== undefined) job.title = title.trim();
        if (description !== undefined) job.description = description.trim();
        if (skills !== undefined) job.skills = skills;
        if (experience !== undefined) job.experience = experience;
        if (location !== undefined) job.location = location;
        if (workMode !== undefined) job.workMode = workMode;
        if (jobType !== undefined) job.jobType = jobType;
        if (salaryMin !== undefined) job.salaryMin = salaryMin;
        if (salaryMax !== undefined) job.salaryMax = salaryMax;

        if (applicationDeadline !== undefined) {
            job.applicationDeadline = applicationDeadline;
        }

        await job.save();

        return res.status(200).json({
            success: true,
            message: "Job updated successfully",
            job
        });

    } catch (error) {
        console.error("Update job error:", error);

        if (error.name === "ValidationError") {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }

        return res.status(500).json({
            success: false,
            message: "Failed to update job"
        });
    }
};

const deleteJob = async (req, res) => {
    try {                                  // Delete Job
        const { jobId } = req.params;
        const recruiterId = req.user._id;

        if (!mongoose.isValidObjectId(jobId)) {
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

        if (job.recruiter.toString() !== recruiterId.toString()) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to delete this job"
            });
        }

        await Job.findByIdAndDelete(jobId);

        return res.status(200).json({
            success: true,
            message: "Job deleted successfully"
        });

    } catch (error) {
        console.error("Delete job error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to delete job"
        });
    }
};

const updateJobStatus = async (req, res) => {
    try {                         // Update Job Status
        const { jobId } = req.params;
        const recruiterId = req.user._id;
        const { status } = req.body;

        if (!mongoose.isValidObjectId(jobId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid job ID"
            });
        }

        if (!["open", "closed"].includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Status must be either open or closed"
            });
        }

        const job = await Job.findById(jobId);

        if (!job) {
            return res.status(404).json({
                success: false,
                message: "Job not found"
            });
        }

        if (job.recruiter.toString() !== recruiterId.toString()) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to change this job status"
            });
        }

        job.status = status;

        await job.save();

        return res.status(200).json({
            success: true,
            message: `Job ${status} successfully`,
            job
        });

    } catch (error) {
        console.error("Update job status error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to update job status"
        });
    }
};

module.exports = {
    createJob,
    getAllJobs,
    getJobById,
    getMyJobs,
    updateJob,
    deleteJob,
    updateJobStatus
};