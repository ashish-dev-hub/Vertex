const mongoose = require("mongoose");

const studentProfileSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true
        },

        phone: {
            type: String,
            trim: true
        },

        college: {
            type: String,
            trim: true
        },

        degree: {
            type: String,
            trim: true
        },

        branch: {
            type: String,
            trim: true
        },

        graduationYear: {
            type: Number
        },

        skills: {
            type: [String],
            default: []
        },

        preferredRoles: {
            type: [String],
            default: []
        },

        preferredLocation: {
            type: String,
            trim: true
        },

        workMode: {
            type: String,
            enum: ["remote", "onsite", "hybrid"]
        },

        experience: {
            type: String,
            trim: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "StudentProfile",
    studentProfileSchema
);