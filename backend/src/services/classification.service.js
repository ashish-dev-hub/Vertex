const axios = require("axios");

const DEFAULT_ML_CLASSIFICATION_URL = "https://vertex-3p0r.onrender.com/classification";

const calculateFallbackClassification = (inputData) => {
    const yearsExp = Number(inputData.years_experience || 0);
    const reqExp = Number(inputData.required_experience || 0);
    const cgpa = Number(inputData.student_cgpa || 7.5);
    const projects = Number(inputData.student_num_projects || 0);
    const internships = Number(inputData.student_internships || 0);

    const expGap = yearsExp - reqExp;
    const expFactor = expGap >= 0 ? 0.35 : Math.max(0.1, 0.35 + expGap * 0.1);
    const cgpaFactor = Math.min(0.25, (cgpa / 10) * 0.25);
    const projectFactor = Math.min(0.25, projects * 0.05 + internships * 0.08);

    const fitScore = Math.min(0.98, Math.max(0.40, expFactor + cgpaFactor + projectFactor + 0.15));

    return {
        fit_score: Math.round(fitScore * 10000) / 10000,
        fit_percentage: Math.round(fitScore * 10000) / 100,
        suitable: fitScore >= 0.5
    };
};

const getClassificationResult = async (inputData) => {
    const mlApiUrl = process.env.ML_CLASSIFICATION_URL || DEFAULT_ML_CLASSIFICATION_URL;

    try {
        const response = await axios.post(
            mlApiUrl,
            inputData,
            {
                headers: {
                    "Content-Type": "application/json"
                },
                timeout: 15000
            }
        );

        return response.data;
    } catch (error) {
        console.warn(`[ML Classification] Remote call to ${mlApiUrl} failed: ${error.message}. Returning synthesis fallback.`);
        return calculateFallbackClassification(inputData);
    }
};

module.exports = {
    getClassificationResult
};