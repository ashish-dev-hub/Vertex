const {
    getClassificationResult
} = require("../services/classification.service");

const getClassification = async (req, res) => {
    try {
        const inputData = req.body;

        const result = await getClassificationResult(inputData);

        return res.status(200).json({
            success: true,
            message: "Classification completed successfully",
            data: result
        });

    } catch (error) {
        console.error("Classification API error:", error.message);

        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Classification failed",
            ...(error.details ? { details: error.details } : {})
        });
    }
};

module.exports = {
    getClassification
};
