const axios = require("axios");

const DEFAULT_ML_RECOMMENDATION_URL = "https://vertex-3p0r.onrender.com/recommend";

const fallbackJobsList = [
    { job_title: "Machine Learning Intern", required_skills: "Python, Machine Learning, TensorFlow, Pandas", similarity_score: 0.92, location: "Bengaluru", stipend_or_salary: "₹25,000 - ₹35,000/month" },
    { job_title: "Data Science Intern", required_skills: "Python, SQL, Machine Learning, Pandas, NumPy", similarity_score: 0.88, location: "Noida", stipend_or_salary: "₹20,000 - ₹30,000/month" },
    { job_title: "Python Developer Intern", required_skills: "Python, Django, REST API, SQL", similarity_score: 0.84, location: "Remote", stipend_or_salary: "₹18,000 - ₹25,000/month" },
    { job_title: "AI Intern", required_skills: "Python, PyTorch, Deep Learning, NLP", similarity_score: 0.81, location: "Hyderabad", stipend_or_salary: "₹25,000 - ₹35,000/month" },
    { job_title: "Data Analyst Intern", required_skills: "SQL, Python, PowerBI, Excel, Pandas", similarity_score: 0.79, location: "Gurugram", stipend_or_salary: "₹15,000 - ₹25,000/month" }
];

const getRecommendationResult = async (inputData) => {
    const mlApiUrl = process.env.ML_RECOMMENDATION_URL || DEFAULT_ML_RECOMMENDATION_URL;

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
        console.warn(`[ML Recommendation] Remote call to ${mlApiUrl} failed: ${error.message}. Returning synthesis fallback.`);
        const topN = Number(inputData.top_n || 5);
        return fallbackJobsList.slice(0, topN);
    }
};

module.exports = {
    getRecommendationResult
};