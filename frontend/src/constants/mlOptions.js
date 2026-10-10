/**
 * VERTEX - Frontend API Specification Dropdown Options + Constants
 * Updated handoff for React frontend • 11 October 2026
 *
 * Exact values for dropdowns supplied by the project.
 * Do not add extra options unless the ML team confirms the model supports them.
 * Send selected option exactly as shown (same spelling, spaces, and hyphens).
 */

export const DROPDOWN_OPTIONS = {
  education: [
    "MCA",
    "B.Tech",
    "M.Tech",
    "BCA",
    "B.Sc"
  ],

  candidate_preferred_work_mode: [
    "On-site",
    "Hybrid",
    "Remote"
  ],

  job_title: [
    "Machine Learning Intern",
    "Data Analyst Intern",
    "Python Developer Intern",
    "AI Intern",
    "Backend Developer Intern",
    "Frontend Developer Intern",
    "Data Science Intern",
    "Software Engineer Intern"
  ],

  job_location: [
    "Gurugram",
    "Remote",
    "Hyderabad",
    "Mumbai",
    "Delhi",
    "Ghaziabad",
    "Noida",
    "Bangalore",
    "Chennai",
    "Pune"
  ],

  work_mode: [
    "Hybrid",
    "Remote",
    "On-site"
  ],

  company_size: [
    "Medium",
    "Large",
    "MNC",
    "Startup",
    "Small"
  ],

  industry: [
    "E-commerce",
    "Consulting",
    "Product / SaaS",
    "EdTech",
    "IT Services",
    "FinTech",
    "HealthTech",
    "Manufacturing / Auto"
  ],

  student_experience_level: [
    "Beginner",
    "Intermediate",
    "Advanced",
    "Unknown"
  ]
};

// Common skill suggestions to assist typing
export const COMMON_SKILLS_SUGGESTIONS = [
  "Python",
  "Machine Learning",
  "Deep Learning",
  "SQL",
  "Pandas",
  "NumPy",
  "Scikit-learn",
  "TensorFlow",
  "PyTorch",
  "NLP",
  "Data Analysis",
  "Statistics",
  "JavaScript",
  "React",
  "Node.js",
  "Docker",
  "Git",
  "FastAPI",
  "Flask"
];

// Exact sample request bodies from PDF specification for quick testing / demonstration
export const SAMPLE_PAYLOADS = {
  classification: {
    education: "B.Tech",
    years_experience: 0,
    candidate_location: "Ghaziabad",
    candidate_preferred_work_mode: "Hybrid",
    student_year_of_study: 2,
    student_cgpa: 8.2,
    student_num_projects: 3,
    student_certifications: 2,
    student_internships: 1,
    student_github_repos: 5,
    student_hackathons_participated: 2,
    student_coding_platform_rating: 1200,
    student_interests: "AI, Machine Learning",
    job_title: "Data Science Intern",
    required_experience: 0,
    job_location: "Noida",
    work_mode: "Hybrid",
    company_size: "Medium",
    job_duration_months: 6,
    industry: "Product / SaaS",
    student_experience_level: "Beginner"
  },

  regression: {
    education: "B.Tech",
    years_experience: 1,
    candidate_preferred_work_mode: "Hybrid",
    job_title: "Machine Learning Intern",
    required_experience: 1,
    job_location: "Noida",
    work_mode: "Hybrid",
    company_size: "Startup",
    job_duration_months: 6,
    student_year_of_study: 2,
    student_cgpa: 8.2,
    student_num_projects: 3,
    student_internships: 1,
    student_github_repos: 5,
    student_hackathons_participated: 2,
    candidate_location: "Ghaziabad",
    industry: "Product / SaaS"
  },

  recommendation: {
    skills: "Python, Machine Learning, SQL",
    top_n: 5
  },

  finalMatch: {
    candidate_skills: "Python, SQL, Machine Learning, Pandas, NumPy",
    education: "B.Tech",
    years_experience: 1,
    candidate_location: "Ghaziabad",
    candidate_preferred_work_mode: "Hybrid",
    student_year_of_study: 2,
    student_cgpa: 8.2,
    student_num_projects: 3,
    student_certifications: 2,
    student_internships: 1,
    student_github_repos: 5,
    student_hackathons_participated: 2,
    student_coding_platform_rating: 1200,
    student_experience_level: "Beginner",
    student_interests: "AI, Machine Learning",
    job_title: "Data Science Intern",
    required_experience: 0,
    job_location: "Noida",
    work_mode: "Hybrid",
    company_size: "Startup",
    industry: "Product / SaaS",
    job_duration_months: 6
  }
};
