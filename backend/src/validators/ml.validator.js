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

    const arrayOrStringFields = [
        "candidate_skills",
        "student_certifications",
        "student_interests"
    ];

    const invalidArrayOrStringFields = arrayOrStringFields.filter((field) => {
        const value = data[field];

        return !(
            typeof value === "string" ||
            (
                Array.isArray(value) &&
                value.every((item) => typeof item === "string")
            )
        );
    });

    if (invalidArrayOrStringFields.length > 0) {
        return res.status(400).json({
            success: false,
            message: "These fields must be strings or arrays of strings",
            invalidFields: invalidArrayOrStringFields
        });
    }

    next();
};

module.exports = {
    validateFinalMatchInput
};