const {
    getRegressionResult
} = require("../services/regression.service");

const getRegression = async (req, res) => {
    try {
        const inputData = req.body;

        const result = await getRegressionResult(inputData);

        return res.status(200).json({
            success: true,
            message: "Regression completed successfully",
            data: result
        });

    } catch (error) {
        console.error("Regression API error:", error.message);

        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Regression failed",
            ...(error.details ? { details: error.details } : {})
        });
    }
};

module.exports = {
    getRegression
};