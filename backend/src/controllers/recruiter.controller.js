const RecruiterProfile = require("../models/RecruiterProfile");

const createRecruiterProfile = async (req, res) => { // Create recruiter profile
    try { const userId = req.user._id;

const existingProfile = await RecruiterProfile.findOne({user: userId});    // Check if profile already exists
        if (existingProfile) {   
            return res.status(409).json({
                success: false,
                message: "Recruiter profile already exists"
            });
        }

const {companyName,companyDescription,industry,companyWebsite,companyLocation,phone} = req.body;

const profile = await RecruiterProfile.create({       // Create profile
            user: userId,
            companyName,
            companyDescription,
            industry,
            companyWebsite,
            companyLocation,
            phone
        });

        res.status(201).json({
            success: true,
            message: "Recruiter profile created successfully",
            profile
        });

    } catch (error) {
        console.error("Create recruiter profile error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to create recruiter profile"
        });
    }
};

const getRecruiterProfile = async (req, res) => {      // Get recruiter profile
    try {const userId = req.user._id;
        const profile = await RecruiterProfile.findOne({user: userId});
    if (!profile) {
            return res.status(404).json({
                success: false,
                message: "Recruiter profile not found"
            });
        }
        res.status(200).json({
            success: true,
            profile
        });

    } catch (error) {
        console.error("Get recruiter profile error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to get recruiter profile"
        });
    }
};

const updateRecruiterProfile = async (req, res) => {          // Update recruiter profile
    try {const userId = req.user._id;
        const profile = await RecruiterProfile.findOne({
            user: userId
        });
    if (!profile) {
            return res.status(404).json({
                success: false,
                message: "Recruiter profile not found"
            });
        }

const {companyName,companyDescription,industry,companyWebsite,companyLocation,phone} = req.body;
        if (companyName !== undefined) {
            profile.companyName = companyName;
        }
        if (companyDescription !== undefined) {
            profile.companyDescription = companyDescription;
        }
        if (industry !== undefined) {
            profile.industry = industry;
        }
        if (companyWebsite !== undefined) {
            profile.companyWebsite = companyWebsite;
        }
        if (companyLocation !== undefined) {
            profile.companyLocation = companyLocation;
        }
        if (phone !== undefined) {
            profile.phone = phone;
        }
        await profile.save();
        res.status(200).json({
            success: true,
            message: "Recruiter profile updated successfully",
            profile
        });

    } catch (error) {
        console.error("Update recruiter profile error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update recruiter profile"
        });
    }
};

module.exports = {
    createRecruiterProfile,
    getRecruiterProfile,
    updateRecruiterProfile
};