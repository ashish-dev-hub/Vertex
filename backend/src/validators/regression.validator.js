const validateRegressionInput = (req, res, next) => {
    const data = req.body;

    if (!data || typeof data !== "object" || Array.isArray(data)) {
        return res.status(400).json({
            success: false,
            message: "Request body must be a JSON object"
        });
    }

    // Required fields from RegressionInput schema
    const requiredFields = [
        "education",
        "years_experience",
        "candidate_preferred_work_mode",
        "job_title",
        "required_experience",
        "job_location",
        "work_mode",
        "company_size",
        "job_duration_months",
        "student_year_of_study",
        "student_cgpa",
        "student_num_projects",
        "student_internships",
        "student_github_repos",
        "student_hackathons_participated"
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
            message: "Required regression fields are missing",
            missingFields
        });
    }

    // Numeric fields
    const numericFields = [
        "years_experience",
        "required_experience",
        "job_duration_months",
        "student_year_of_study",
        "student_cgpa",
        "student_num_projects",
        "student_internships",
        "student_github_repos",
        "student_hackathons_participated"
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
        "required_experience",
        "student_year_of_study",
        "student_num_projects",
        "student_internships",
        "student_github_repos",
        "student_hackathons_participated"
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

    // Integer fields from the Python schema
    const integerFields = [
        "years_experience",
        "required_experience"
    ];

    const invalidIntegerFields = integerFields.filter((field) => {
        return !Number.isInteger(data[field]);
    });

    if (invalidIntegerFields.length > 0) {
        return res.status(400).json({
            success: false,
            message: "These fields must be integers",
            invalidFields: invalidIntegerFields
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

    // Optional string fields
    const optionalStringFields = [
        "candidate_location",
        "industry",
        "student_career_label",
        "student_experience_level"
    ];

    const invalidOptionalStrings = optionalStringFields.filter((field) => {
        return (
            data[field] !== undefined &&
            data[field] !== null &&
            typeof data[field] !== "string"
        );
    });

    if (invalidOptionalStrings.length > 0) {
        return res.status(400).json({
            success: false,
            message: "Optional string fields must contain strings",
            invalidFields: invalidOptionalStrings
        });
    }

    // Optional numeric fields
    const optionalNumericFields = [
        "skill_overlap",
        "skill_coverage",
        "experience_gap",
        "project_internship_score",
        "technical_activity_score"
    ];

    const invalidOptionalNumbers = optionalNumericFields.filter((field) => {
        return (
            data[field] !== undefined &&
            data[field] !== null &&
            (
                typeof data[field] !== "number" ||
                !Number.isFinite(data[field])
            )
        );
    });

    if (invalidOptionalNumbers.length > 0) {
        return res.status(400).json({
            success: false,
            message: "Optional numeric fields must contain valid numbers",
            invalidFields: invalidOptionalNumbers
        });
    }

    if (
        data.skill_coverage !== undefined &&
        data.skill_coverage !== null &&
        data.skill_coverage < 0
    ) {
        return res.status(400).json({
            success: false,
            message: "skill_coverage cannot be negative"
        });
    }

    // Optional numeric study field
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

    next();
};

module.exports = {
    validateRegressionInput
};