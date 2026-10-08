const StudentProfile = require("../models/StudentProfile");

const createStudentProfile = async (req, res) => {
    try {const userId = req.user._id;
        const existingProfile = await StudentProfile.findOne({user: userId});
        if (existingProfile) {
            return res.status(409).json({
                success: false,
                message: "Student profile already exists"
            });
        }

const profile = await StudentProfile.create({
            user: userId,
            phone: req.body.phone,
            college: req.body.college,
            degree: req.body.degree,
            branch: req.body.branch,
            graduationYear: req.body.graduationYear,
            skills: req.body.skills,
            preferredRoles: req.body.preferredRoles,
            preferredLocation: req.body.preferredLocation,
            workMode: req.body.workMode,
            experience: req.body.experience
        });
        res.status(201).json({
            success: true,
            message: "Student profile created successfully",
            profile
        });

    } catch (error) {
        console.error("Create student profile error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to create student profile"
        });
    }
};

const getStudentProfile = async (req, res) => {
    try {const userId = req.user._id;
        const profile = await StudentProfile.findOne({
            user: userId
        }).populate("user", "name email role");

        if (!profile) {
            return res.status(404).json({
                success: false,
                message: "Student profile not found"
            });
        }

        res.status(200).json({
            success: true,
            profile
        });

    } catch (error) {
        console.error("Get student profile error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to get student profile"
        });
    }
};

const updateStudentProfile = async (req, res) => {
    try {const userId = req.user._id;
        const profile = await StudentProfile.findOneAndUpdate(
            { user: userId },
            { $set: {
                    phone: req.body.phone,
                    college: req.body.college,
                    degree: req.body.degree,
                    branch: req.body.branch,
                    graduationYear: req.body.graduationYear,
                    skills: req.body.skills,
                    preferredRoles: req.body.preferredRoles,
                    preferredLocation: req.body.preferredLocation,
                    workMode: req.body.workMode,
                    experience: req.body.experience
                }
            },
            {  new: true,
               runValidators: true
            }
        );

        if (!profile) {
            return res.status(404).json({
                success: false,
                message: "Student profile not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Student profile updated successfully",
            profile
        });

    } catch (error) {
        console.error("Update student profile error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update student profile"
        });
    }
};

module.exports = {
    createStudentProfile,
    getStudentProfile,
    updateStudentProfile
};