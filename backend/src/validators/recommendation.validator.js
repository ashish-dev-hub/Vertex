const validateRecommendationInput = (req, res, next) => {
    const data = req.body;

    if (!data || typeof data !== "object" || Array.isArray(data)) {
        return res.status(400).json({
            success: false,
            message: "Request body must be a JSON object"
        });
    }

    // Validate skills
    if (
        typeof data.skills !== "string" ||
        data.skills.trim() === ""
    ) {
        return res.status(400).json({
            success: false,
            message: "skills must be a non-empty string"
        });
    }

    // Validate top_n
    if (
        data.top_n !== undefined &&
        (
            !Number.isInteger(data.top_n) ||
            data.top_n <= 0
        )
    ) {
        return res.status(400).json({
            success: false,
            message: "top_n must be a positive integer"
        });
    }

    next();
};

module.exports = {
    validateRecommendationInput
};