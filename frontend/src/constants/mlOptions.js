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

/**
 * Intelligently maps an arbitrary job title or role (e.g. "ML engineer", "React Dev", "SDE")
 * to the exact 8 job title categories supported by the trained ML models.
 */
export const matchJobTitle = (value, fallback = "Machine Learning Intern") => {
  if (!value) return fallback;
  const str = String(value).trim();
  const lower = str.toLowerCase();

  // 1. Exact match (case-insensitive)
  const exact = DROPDOWN_OPTIONS.job_title.find(
    (opt) => opt.toLowerCase() === lower
  );
  if (exact) return exact;

  // 2. Direct inclusion (option includes input, or input includes option)
  const direct = DROPDOWN_OPTIONS.job_title.find(
    (opt) => opt.toLowerCase().includes(lower) || lower.includes(opt.toLowerCase())
  );
  if (direct) return direct;

  // 3. Domain & Keyword heuristics with regex word boundaries
  // Machine Learning / ML (prioritize over generic AI)
  if (
    /\bml\b/i.test(lower) ||
    /machine\s*learning/i.test(lower) ||
    /deep\s*learning/i.test(lower) ||
    /computer\s*vision/i.test(lower) ||
    /\bnlp\b/i.test(lower) ||
    /neural/i.test(lower) ||
    /mlops/i.test(lower)
  ) {
    return "Machine Learning Intern";
  }

  // Data Science
  if (
    /data\s*scien/i.test(lower) ||
    /\bds\b/i.test(lower)
  ) {
    return "Data Science Intern";
  }

  // Data Analyst / Analytics
  if (
    /data\s*analy/i.test(lower) ||
    /business\s*analy/i.test(lower) ||
    /\bbi\b/i.test(lower) ||
    /analytics/i.test(lower) ||
    /power\s*bi/i.test(lower) ||
    /tableau/i.test(lower)
  ) {
    return "Data Analyst Intern";
  }

  // AI / GenAI / LLM
  if (
    /\bai\b/i.test(lower) ||
    /artificial\s*intelligence/i.test(lower) ||
    /genai/i.test(lower) ||
    /generative\s*ai/i.test(lower) ||
    /\bllm\b/i.test(lower)
  ) {
    return "AI Intern";
  }

  // Backend Developer
  if (
    /backend/i.test(lower) ||
    /back-end/i.test(lower) ||
    /back\s+end/i.test(lower) ||
    /node/i.test(lower) ||
    /django/i.test(lower) ||
    /fastapi/i.test(lower) ||
    /flask/i.test(lower) ||
    /spring/i.test(lower) ||
    /golang/i.test(lower) ||
    /\bapi\b/i.test(lower) ||
    /database/i.test(lower)
  ) {
    return "Backend Developer Intern";
  }

  // Frontend Developer
  if (
    /frontend/i.test(lower) ||
    /front-end/i.test(lower) ||
    /front\s+end/i.test(lower) ||
    /react/i.test(lower) ||
    /vue/i.test(lower) ||
    /angular/i.test(lower) ||
    /nextjs/i.test(lower) ||
    /\bui\b/i.test(lower) ||
    /\bux\b/i.test(lower) ||
    /web\s*dev/i.test(lower) ||
    /html/i.test(lower) ||
    /css/i.test(lower)
  ) {
    return "Frontend Developer Intern";
  }

  // Python Developer
  if (/python/i.test(lower)) {
    return "Python Developer Intern";
  }

  // Software Engineer / SDE / Fullstack
  if (
    /software/i.test(lower) ||
    /\bsde\b/i.test(lower) ||
    /\bswe\b/i.test(lower) ||
    /full\s*stack/i.test(lower) ||
    /fullstack/i.test(lower) ||
    /developer/i.test(lower) ||
    /engineer/i.test(lower) ||
    /coder/i.test(lower) ||
    /programmer/i.test(lower)
  ) {
    return "Software Engineer Intern";
  }

  return fallback;
};

/**
 * Safely matches a given value to one of the options in a dropdown list.
 * Supports exact match, inclusion match, and specialized job_title matching.
 */
export const matchDropdown = (options, value, fallback) => {
  if (!value) return fallback || (options && options[0]) || "";
  if (options === DROPDOWN_OPTIONS.job_title) {
    return matchJobTitle(value, fallback || DROPDOWN_OPTIONS.job_title[0]);
  }
  const exact = options.find((o) => o.toLowerCase() === String(value).toLowerCase());
  if (exact) return exact;
  const partial = options.find(
    (o) =>
      o.toLowerCase().includes(String(value).toLowerCase()) ||
      String(value).toLowerCase().includes(o.toLowerCase())
  );
  return partial || fallback || options[0];
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
    student_experience_level: "Beginner",
    skill_coverage: 0.8
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
    industry: "Product / SaaS",
    skill_coverage: 0.8,
    skill_overlap: 2
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
    job_duration_months: 6,
    skill_coverage: 0.8
  }
};
