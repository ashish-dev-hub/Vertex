const axios = require("axios");

const DEFAULT_ML_FINAL_MATCH_URL = "https://vertex-3p0r.onrender.com/final-match";

const calculateFallbackFinalMatch = (inputData) => {
    const candidateSkillsStr = typeof inputData.candidate_skills === "string" 
        ? inputData.candidate_skills 
        : (Array.isArray(inputData.candidate_skills) ? inputData.candidate_skills.join(", ") : "");
    const candidateSkills = candidateSkillsStr.toLowerCase().split(/[,;|\n]+/).map(s => s.trim()).filter(Boolean);
    const jobTitle = inputData.job_title || "Internship Role";
    const requiredSkillsStr = inputData.required_skills ? String(inputData.required_skills) : jobTitle;
    const requiredSkills = requiredSkillsStr.toLowerCase().split(/[,;|\n]+/).map(s => s.trim()).filter(Boolean);

    let matchingSkills = 0;
    if (requiredSkills.length > 0) {
        matchingSkills = candidateSkills.filter(cs => requiredSkills.some(rs => cs.includes(rs) || rs.includes(cs))).length;
    } else {
        matchingSkills = Math.min(candidateSkills.length, 3);
    }
    const skillScore = requiredSkills.length > 0 
        ? Math.min(1.0, Math.max(0.2, (matchingSkills / Math.max(requiredSkills.length, 1))))
        : Math.min(1.0, 0.4 + candidateSkills.length * 0.1);

    const yearsExp = Number(inputData.years_experience || 0);
    const reqExp = Number(inputData.required_experience || 0);
    const expGap = yearsExp - reqExp;
    const expFactor = expGap >= 0 ? 0.35 : Math.max(0.1, 0.35 + expGap * 0.1);

    const cgpa = Number(inputData.student_cgpa || 7.5);
    const cgpaFactor = Math.min(0.25, (cgpa / 10) * 0.25);

    const projects = Number(inputData.student_num_projects || 0);
    const internships = Number(inputData.student_internships || 0);
    const projectFactor = Math.min(0.25, (projects * 0.05 + internships * 0.1));

    const githubRepos = Number(inputData.student_github_repos || 0);
    const hackathons = Number(inputData.student_hackathons_participated || 0);
    const activityFactor = Math.min(0.15, (githubRepos * 0.02 + hackathons * 0.05));

    const suitabilityScore = Math.min(0.98, Math.max(0.35, expFactor + cgpaFactor + projectFactor + activityFactor));

    let salaryLpa = 4.5 + (yearsExp * 2.5) + (cgpa >= 8 ? 2.0 : 1.0) + (projects * 0.8) + (matchingSkills * 0.5);
    salaryLpa = Math.min(28.0, Math.max(3.0, salaryLpa));
    const salaryFit = Math.min(1.0, Math.max(0.0, (salaryLpa - 2) / (30 - 2)));

    const finalScore = (0.50 * suitabilityScore) + (0.30 * skillScore) + (0.20 * salaryFit);
    const finalPercentage = Math.round(finalScore * 10000) / 100;

    let matchLabel = "Weak match";
    if (finalScore >= 0.75) matchLabel = "Strong match";
    else if (finalScore >= 0.55) matchLabel = "Good match";
    else if (finalScore >= 0.40) matchLabel = "Moderate match";

    const isSuitable = suitabilityScore >= 0.5;

    return {
        candidate_id: inputData.candidate_id || null,
        job_title: jobTitle,
        final_match: Math.round(finalScore * 10000) / 10000,
        final_match_percentage: finalPercentage,
        match_label: matchLabel,
        skill_overlap_percentage: Math.round(skillScore * 10000) / 10000,
        suitable: isSuitable,
        predicted_salary_lpa: isSuitable ? Math.round(salaryLpa * 100) / 100 : null,
        scores: {
            suitability: Math.round(suitabilityScore * 10000) / 10000,
            salary: Math.round(salaryFit * 10000) / 10000,
            skill: Math.round(skillScore * 10000) / 10000
        }
    };
};

const getFinalMatchResult = async (inputData) => {
    const mlApiUrl = process.env.ML_FINAL_MATCH_URL || DEFAULT_ML_FINAL_MATCH_URL;

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
        console.warn(`[ML Final Match] Remote call to ${mlApiUrl} failed: ${error.message}. Returning synthesis fallback.`);
        return calculateFallbackFinalMatch(inputData);
    }
};

module.exports = {
    getFinalMatchResult
};