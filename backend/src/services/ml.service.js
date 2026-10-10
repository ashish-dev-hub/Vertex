const axios = require("axios");

const getFinalMatchResult = async (inputData) => {
    try {
        const mlApiUrl = process.env.ML_FINAL_MATCH_URL;

        if (!mlApiUrl) {
            throw new Error(
                "ML_FINAL_MATCH_URL is not configured in .env"
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
                "ML API returned an error"
            );

            mlError.statusCode = 502;
            mlError.details = error.response.data;

            throw mlError;
        }

        if (error.code === "ECONNABORTED") {
            const timeoutError = new Error(
                "ML API request timed out"
            );

            timeoutError.statusCode = 504;

            throw timeoutError;
        }

        const connectionError = new Error(
            "Unable to connect to ML API"
        );

        connectionError.statusCode = 502;

        throw connectionError;
    }
};

module.exports = {
    getFinalMatchResult
};