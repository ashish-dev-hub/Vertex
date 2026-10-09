const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
    {
        recruiter: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        title: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            required: true,
            trim: true
        },

        skills: {
            type: [String],
            default: []
        },

        experience: {
            type: String,
            trim: true
        },

        location: {
            type: String,
            trim: true
        },

        workMode: {
            type: String,
            enum: ["remote", "onsite", "hybrid"],
            required: true
        },

        jobType: {
            type: String,
            enum: ["internship", "full-time", "part-time"],
            required: true
        },

        salaryMin: {
            type: Number
        },

        salaryMax: {
            type: Number
        },

        applicationDeadline: {
            type: Date
        },

        status: {
            type: String,
            enum: ["open", "closed"],
            default: "open"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Job", jobSchema);