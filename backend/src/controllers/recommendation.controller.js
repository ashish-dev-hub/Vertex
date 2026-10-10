const {
    getRecommendationResult
} = require("../services/recommendation.service");

const getRecommendation = async (req, res) => {
    try {
        const inputData = req.body;

        const result = await getRecommendationResult(inputData);

        return res.status(200).json({
            success: true,
            message: "Recommendations fetched successfully",
            data: result
        });

    } catch (error) {
        console.error("Recommendation API error:", error.message);

        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Failed to fetch recommendations",
            ...(error.details ? { details: error.details } : {})
        });
    }
};

module.exports = {
    getRecommendation
};