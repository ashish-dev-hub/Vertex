const { getFinalMatchResult } = require("../services/ml.service");

const getFinalMatch = async (req, res) => {
    try {
        // Receive ML input data from the frontend
        const inputData = req.body;

        // Send input data to the ML API
        const result = await getFinalMatchResult(inputData);

        // Return ML result to the frontend
        return res.status(200).json({
            success: true,
            message: "Final match calculated successfully",
            data: result
        });

    } catch (error) {
        console.error("Final Match API error:", error.message);

        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Failed to calculate final match",
            ...(error.details ? { details: error.details } : {})
        });
    }
};

module.exports = {
    getFinalMatch
};