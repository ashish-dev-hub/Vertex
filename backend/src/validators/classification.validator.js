const validateClassificationInput = (req, res, next) => {
    const data = req.body;

    if (!data || typeof data !== "object" || Array.isArray(data)) {
        return res.status(400).json({
            success: false,
            message: "Request body must be a JSON object"
        });
    }

    // Required fields from ClassificationInput schema
    const requiredFields = [
        "education",
        "years_experience",
        "candidate_preferred_work_mode",
        "student_year_of_study",
        "student_cgpa",
        "student_num_projects",
        "student_certifications",
        "student_internships",
        "student_github_repos",
        "student_hackathons_participated",
        "student_coding_platform_rating",
        "student_interests",
        "job_title",
        "required_experience",
        "job_location",
        "work_mode",
        "company_size",
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
            message: "Required classification fields are missing",
            missingFields
        });
    }

    // Numeric fields
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
            message: "Numeric fields must contain valid numbers",
            invalidFields: invalidNumericFields
        });
    }

    // Non-negative fields
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

    // Required string fields
    const stringFields = [
        "education",
        "candidate_preferred_work_mode",
        "job_title",
        "job_location",
        "work_mode",
        "company_size"
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

    // Flexible fields: integer, number, string or array of strings
    const flexibleFields = [
        "student_certifications",
        "student_interests"
    ];

    const invalidFlexibleFields = flexibleFields.filter((field) => {
        const value = data[field];

        return !(
            typeof value === "string" ||
            (typeof value === "number" && Number.isFinite(value)) ||
            (
                Array.isArray(value) &&
                value.every((item) => typeof item === "string")
            )
        );
    });

    if (invalidFlexibleFields.length > 0) {
        return res.status(400).json({
            success: false,
            message: "Invalid flexible field values",
            invalidFields: invalidFlexibleFields
        });
    }

    // Optional fields, if provided, must have valid types
    if (
        data.candidate_location !== undefined &&
        data.candidate_location !== null &&
        typeof data.candidate_location !== "string"
    ) {
        return res.status(400).json({
            success: false,
            message: "candidate_location must be a string"
        });
    }

    if (
        data.industry !== undefined &&
        data.industry !== null &&
        typeof data.industry !== "string"
    ) {
        return res.status(400).json({
            success: false,
            message: "industry must be a string"
        });
    }

    if (
        data.student_weekly_study_hours !== undefined &&
        data.student_weekly_study_hours !== null &&
        (
            typeof data.student_weekly_study_hours !== "number" ||
            !Number.isFinite(data.student_weekly_study_hours)
        )
    ) {
        return res.status(400).json({
            success: false,
            message: "student_weekly_study_hours must be a number"
        });
    }

    if (
        data.student_career_label !== undefined &&
        data.student_career_label !== null &&
        typeof data.student_career_label !== "string"
    ) {
        return res.status(400).json({
            success: false,
            message: "student_career_label must be a string"
        });
    }

    if (
        data.student_experience_level !== undefined &&
        data.student_experience_level !== null &&
        typeof data.student_experience_level !== "string"
    ) {
        return res.status(400).json({
            success: false,
            message: "student_experience_level must be a string"
        });
    }

    next();
};

module.exports = {
    validateClassificationInput
};