const axios = require("axios");

const DEFAULT_ML_REGRESSION_URL = "https://vertex-3p0r.onrender.com/regression";

const calculateFallbackRegression = (inputData) => {
    const yearsExp = Number(inputData.years_experience || 0);
    const cgpa = Number(inputData.student_cgpa || 7.5);
    const projects = Number(inputData.student_num_projects || 0);
    const internships = Number(inputData.student_internships || 0);

    let salary = 4.0 + (yearsExp * 2.5) + (cgpa >= 8 ? 2.0 : 1.0) + (projects * 0.7) + (internships * 1.0);
    salary = Math.min(30.0, Math.max(2.5, salary));
    const salaryScore = Math.min(1.0, Math.max(0.0, (salary - 2) / (30 - 2)));

    return {
        predicted_salary_lpa: Math.round(salary * 100) / 100,
        salary_score: Math.round(salaryScore * 10000) / 10000
    };
};

const getRegressionResult = async (inputData) => {
    const mlApiUrl = process.env.ML_REGRESSION_URL || DEFAULT_ML_REGRESSION_URL;

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
        console.warn(`[ML Regression] Remote call to ${mlApiUrl} failed: ${error.message}. Returning synthesis fallback.`);
        return calculateFallbackRegression(inputData);
    }
};

module.exports = {
    getRegressionResult
};