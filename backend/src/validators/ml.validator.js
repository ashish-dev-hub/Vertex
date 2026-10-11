const validateFinalMatchInput = (req, res, next) => {
    const data = req.body;

    const requiredFields = [
        "candidate_skills",
        "education",
        "years_experience",
        "candidate_location",
        "candidate_preferred_work_mode",
        "student_year_of_study",
        "student_cgpa",
        "student_num_projects",
        "student_certifications",
        "student_internships",
        "student_github_repos",
        "student_hackathons_participated",
        "student_coding_platform_rating",
        "student_experience_level",
        "student_interests",
        "job_title",
        "required_experience",
        "job_location",
        "work_mode",
        "company_size",
        "industry",
        "job_duration_months"
    ];

    const missingFields = requiredFields.filter((field) => {
        return (
            data[field] === undefined ||
            data[field] === null ||
            data[field] === ""
        );
    });

    if (missingFields.length > 0) {
        return res.status(400).json({
            success: false,
            message: "Required ML input fields are missing",
            missingFields
        });
    }

    const numericFields = [
        "years_experience",
        "student_year_of_study",
        "student_cgpa",
        "student_num_projects",
        "student_internships",
        "student_github_repos",
        "student_hackathons_participated",
        "student_coding_platform_rating",
        "required_experience",
        "job_duration_months"
    ];

    const invalidNumericFields = numericFields.filter((field) => {
        return (
            typeof data[field] !== "number" ||
            !Number.isFinite(data[field])
        );
    });

    if (invalidNumericFields.length > 0) {
        return res.status(400).json({
            success: false,
            message: "Some numeric fields have invalid values",
            invalidFields: invalidNumericFields
        });
    }

    const nonNegativeFields = [
        "years_experience",
        "student_year_of_study",
        "student_num_projects",
        "student_internships",
        "student_github_repos",
        "student_hackathons_participated",
        "student_coding_platform_rating",
        "required_experience"
    ];

    const negativeFields = nonNegativeFields.filter((field) => {
        return data[field] < 0;
    });

    if (negativeFields.length > 0) {
        return res.status(400).json({
            success: false,
            message: "These fields cannot be negative",
            invalidFields: negativeFields
        });
    }

    if (data.skill_coverage !== undefined && data.skill_coverage !== null) {
        if (typeof data.skill_coverage !== "number" || !Number.isFinite(data.skill_coverage) || data.skill_coverage < 0) {
            return res.status(400).json({
                success: false,
                message: "skill_coverage must be a non-negative number",
                invalidFields: ["skill_coverage"]
            });
        }
    }

    if (data.student_cgpa <= 0) {
        return res.status(400).json({
            success: false,
            message: "student_cgpa must be greater than 0"
        });
    }

    if (data.job_duration_months <= 0) {
        return res.status(400).json({
            success: false,
            message: "job_duration_months must be greater than 0"
        });
    }

    const stringFields = [
        "education",
        "candidate_location",
        "candidate_preferred_work_mode",
        "student_experience_level",
        "job_title",
        "job_location",
        "work_mode",
        "company_size",
        "industry"
    ];

    const invalidStringFields = stringFields.filter((field) => {
        return (
            typeof data[field] !== "string" ||
            data[field].trim() === ""
        );
    });

    if (invalidStringFields.length > 0) {
        return res.status(400).json({
            success: false,
            message: "These fields must be non-empty strings",
            invalidFields: invalidStringFields
        });
    }

    const invalidFlexibleFields = [];

    // candidate_skills: string or array of strings
    if (data.candidate_skills !== undefined && data.candidate_skills !== null) {
        const val = data.candidate_skills;
        const isValid = typeof val === "string" || (Array.isArray(val) && val.every((item) => typeof item === "string"));
        if (!isValid) {
            invalidFlexibleFields.push("candidate_skills");
        }
    }

    // student_certifications: number (>= 0), string, or array of strings/numbers
    if (data.student_certifications !== undefined && data.student_certifications !== null) {
        const val = data.student_certifications;
        const isValid =
            (typeof val === "number" && Number.isFinite(val) && val >= 0) ||
            typeof val === "string" ||
            (Array.isArray(val) && val.every((item) => typeof item === "string" || typeof item === "number"));
        if (!isValid) {
            invalidFlexibleFields.push("student_certifications");
        }
    }

    // student_interests: string, number, or array of strings/numbers
    if (data.student_interests !== undefined && data.student_interests !== null) {
        const val = data.student_interests;
        const isValid =
            typeof val === "string" ||
            (typeof val === "number" && Number.isFinite(val) && val >= 0) ||
            (Array.isArray(val) && val.every((item) => typeof item === "string" || typeof item === "number"));
        if (!isValid) {
            invalidFlexibleFields.push("student_interests");
        }
    }

    if (invalidFlexibleFields.length > 0) {
        return res.status(400).json({
            success: false,
            message: "These fields have invalid types or formats",
            invalidFields: invalidFlexibleFields
        });
    }

    next();
};

module.exports = {
    validateFinalMatchInput
};