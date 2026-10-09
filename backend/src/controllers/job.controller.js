const Job = require("../models/Job");

const createJob = async (req, res) => {
    try {
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
        });

        res.status(201).json({
            success: true,
            message: "Job created successfully",
            job
        });

    } catch (error) {
        console.error("Create job error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to create job"
        });
    }
};

const getAllJobs = async (req, res) => {
    try {
        const jobs = await Job.find()
            .populate("recruiter", "name email")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: jobs.length,
            jobs
        });

    } catch (error) {
        console.error("Get all jobs error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch jobs"
        });
    }
};

const getJobById = async (req, res) => {
    try {
        const { jobId } = req.params;

        const job = await Job.findById(jobId)
            .populate("recruiter", "name email");

        if (!job) {
            return res.status(404).json({
                success: false,
                message: "Job not found"
            });
        }

        res.status(200).json({
            success: true,
            job
        });

    } catch (error) {
        console.error("Get job error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch job"
        });
    }
};

const updateJob = async (req, res) => {
    try {
        const { jobId } = req.params;
        const recruiterId = req.user._id;

        const job = await Job.findById(jobId);

        if (!job) {
            return res.status(404).json({
                success: false,
                message: "Job not found"
            });
        }

      
        if (job.recruiter.toString() !== recruiterId.toString()) {
            return res.status(403).json({           // Check ownership
                success: false,
                message: "You are not authorized to update this job"
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

        if (title !== undefined) {
            job.title = title;
        }

        if (description !== undefined) {
            job.description = description;
        }

        if (skills !== undefined) {
            job.skills = skills;
        }

        if (experience !== undefined) {
            job.experience = experience;
        }

        if (location !== undefined) {
            job.location = location;
        }

        if (workMode !== undefined) {
            job.workMode = workMode;
        }

        if (jobType !== undefined) {
            job.jobType = jobType;
        }

        if (salaryMin !== undefined) {
            job.salaryMin = salaryMin;
        }

        if (salaryMax !== undefined) {
            job.salaryMax = salaryMax;
        }

        if (applicationDeadline !== undefined) {
            job.applicationDeadline = applicationDeadline;
        }

        await job.save();

        res.status(200).json({
            success: true,
            message: "Job updated successfully",
            job
        });

    } catch (error) {
        console.error("Update job error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to update job"
        });
    }
};

const deleteJob = async (req, res) => {
    try {
        const { jobId } = req.params;
        const recruiterId = req.user._id;

        const job = await Job.findById(jobId);
                                                  
        if (!job) {
            return res.status(404).json({
                success: false,
                message: "Job not found"
            });
        }
       
        if (job.recruiter.toString() !== recruiterId.toString()) {
            return res.status(403).json({
                success: false,                      // Check ownership
                message: "You are not authorized to delete this job"
            });
        }

        await Job.findByIdAndDelete(jobId);

        res.status(200).json({
            success: true,
            message: "Job deleted successfully"
        });

    } catch (error) {
        console.error("Delete job error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to delete job"
        });
    }
};

const updateJobStatus = async (req, res) => {
    try {
        const { jobId } = req.params;
        const recruiterId = req.user._id;
        const { status } = req.body;

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
            return res.status(403).json({          // Check ownership
                success: false,
                message: "You are not authorized to change this job status"
            });
        }

        job.status = status;

        await job.save();

        res.status(200).json({
            success: true,
            message: `Job ${status} successfully`,
            job
        });

    } catch (error) {
        console.error("Update job status error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to update job status"
        });
    }
};


module.exports = {
    createJob,
    getAllJobs,
    getJobById,
    updateJob,
    deleteJob,
    updateJobStatus
};