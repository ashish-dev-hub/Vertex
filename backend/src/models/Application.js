const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
    {
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        job: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Job",
            required: true
        },

        status: {
            type: String,
            enum: [
                "pending",
                "shortlisted",
                "accepted",
                "rejected"
            ],
            default: "pending"
        },

        fitScore: {
            type: Number
        },

        suitable: {
            type: Boolean
        },

        predictedSalary: {
            type: Number
        },

        candidateSkills: {
            type: [String],
            default: []
        },

        finalMatchScore: {
            type: Number
        },

        finalMatchLabel: {
            type: String
        }
    },
    {
        timestamps: true
    }
);

applicationSchema.index(
    { student: 1, job: 1 },      
    { unique: true }
);

module.exports = mongoose.model(
    "Application",
    applicationSchema
);