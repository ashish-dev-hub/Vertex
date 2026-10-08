const mongoose = require("mongoose");

const recruiterProfileSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true
        },

        companyName: {
            type: String,
            required: true,
            trim: true
        },

        companyDescription: {
            type: String,
            trim: true
        },

        industry: {
            type: String,
            trim: true
        },

        companyWebsite: {
            type: String,
            trim: true
        },

        companyLocation: {
            type: String,
            trim: true
        },

        phone: {
            type: String,
            trim: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "RecruiterProfile",
    recruiterProfileSchema
);