const axios = require("axios");

const getClassificationResult = async (inputData) => {
    try {
        const mlApiUrl = process.env.ML_CLASSIFICATION_URL;

        if (!mlApiUrl) {
            throw new Error(
                "ML_CLASSIFICATION_URL is not configured in .env"
            );
        }

        const response = await axios.post(
            mlApiUrl,
            inputData,
            {
                headers: {
                    "Content-Type": "application/json"
                },
                timeout: 60000
            }
        );

        return response.data;

    } catch (error) {
        if (error.response) {
            const mlError = new Error(
                "Classification ML API returned an error"
            );

            mlError.statusCode = 502;
            mlError.details = error.response.data;

            throw mlError;
        }

        if (error.code === "ECONNABORTED") {
            const timeoutError = new Error(
                "Classification ML API request timed out"
            );

            timeoutError.statusCode = 504;

            throw timeoutError;
        }

        if (error.statusCode) {
            throw error;
        }

        const connectionError = new Error(
            "Unable to connect to Classification ML API"
        );

        connectionError.statusCode = 502;

        throw connectionError;
    }
};

module.exports = {
    getClassificationResult
};