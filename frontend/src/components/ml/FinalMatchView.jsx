import React, { useState } from "react";
import {
  Sparkles,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Send,
  Code,
  FileCheck,
  User,
  Briefcase,
  Layers,
  PieChart,
  Percent,
  IndianRupee,
  ShieldCheck
} from "lucide-react";
import { getFinalMatch, extractData, parseApiError } from "../../api/ml";
import {
  DROPDOWN_OPTIONS,
  COMMON_SKILLS_SUGGESTIONS,
  SAMPLE_PAYLOADS
} from "../../constants/mlOptions";
import FormSelect from "./FormSelect";
import TagMultiSelect from "./TagMultiSelect";
import NumericField from "./NumericField";
import StatusBanner from "./StatusBanner";

const initialForm = {
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

  // Optional fields
  candidate_id: "cand_001",
  student_weekly_study_hours: "",
  student_career_label: "",
  required_skills: ""
};

const FinalMatchView = () => {
  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiStatus, setApiStatus] = useState(null);
  const [result, setResult] = useState(null);
  const [rawResponse, setRawResponse] = useState(null);
  const [showRawJson, setShowRawJson] = useState(false);

  const handleFieldChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleLoadSample = () => {
    setFormData({ ...initialForm, ...SAMPLE_PAYLOADS.finalMatch });
    setErrors({});
    setApiStatus(null);
  };

  const handleReset = () => {
    setFormData({
      candidate_skills: "",
      education: "Unknown",
      years_experience: 0,
      candidate_location: "Unknown",
      candidate_preferred_work_mode: "Unknown",
      student_year_of_study: 1,
      student_cgpa: 8.0,
      student_num_projects: 0,
      student_certifications: 0,
      student_internships: 0,
      student_github_repos: 0,
      student_hackathons_participated: 0,
      student_coding_platform_rating: 0,
      student_experience_level: "Unknown",
      student_interests: "Unknown",
      job_title: "",
      required_experience: 0,
      job_location: "Unknown",
      work_mode: "Unknown",
      company_size: "Unknown",
      industry: "Unknown",
      job_duration_months: 6,
      candidate_id: "",
      student_weekly_study_hours: "",
      student_career_label: "",
      required_skills: ""
    });
    setResult(null);
    setRawResponse(null);
    setApiStatus(null);
    setErrors({});
  };

  const validate = () => {
    const errs = {};
    if (!formData.candidate_skills || !formData.candidate_skills.trim()) {
      errs.candidate_skills = "Candidate skills are required";
    }
    if (!formData.job_title || !formData.job_title.trim()) {
      errs.job_title = "Job title is required";
    }

    if (formData.years_experience === "" || Number(formData.years_experience) < 0) {
      errs.years_experience = "Must be integer ≥ 0";
    }
    if (formData.student_year_of_study === "" || Number(formData.student_year_of_study) < 0) {
      errs.student_year_of_study = "Must be ≥ 0";
    }
    if (formData.student_cgpa === "" || Number(formData.student_cgpa) <= 0) {
      errs.student_cgpa = "CGPA must be > 0";
    }
    if (formData.student_num_projects === "" || Number(formData.student_num_projects) < 0) {
      errs.student_num_projects = "Must be ≥ 0";
    }
    if (formData.student_github_repos === "" || Number(formData.student_github_repos) < 0) {
      errs.student_github_repos = "Must be ≥ 0";
    }
    if (formData.student_hackathons_participated === "" || Number(formData.student_hackathons_participated) < 0) {
      errs.student_hackathons_participated = "Must be ≥ 0";
    }
    if (formData.job_duration_months === "" || Number(formData.job_duration_months) <= 0) {
      errs.job_duration_months = "Duration must be > 0";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!validate()) {
      setApiStatus({
        status: "validation",
        message: "Check required fields and formats.",
        details: "Please fill all required final match inputs."
      });
      return;
    }

    setLoading(true);
    setApiStatus(null);

    const payload = {
      candidate_skills: formData.candidate_skills,
      education: formData.education || "Unknown",
      years_experience: Number(formData.years_experience),
      candidate_location: formData.candidate_location || "Unknown",
      candidate_preferred_work_mode: formData.candidate_preferred_work_mode || "Unknown",
      student_year_of_study: Number(formData.student_year_of_study),
      student_cgpa: Number(formData.student_cgpa),
      student_num_projects: Number(formData.student_num_projects),
      student_certifications: String(
        formData.student_certifications !== "" &&
          formData.student_certifications !== undefined
          ? formData.student_certifications
          : "0"
      ),
      student_internships: Number(formData.student_internships || 0),
      student_github_repos: Number(formData.student_github_repos),
      student_hackathons_participated: Number(formData.student_hackathons_participated),
      student_coding_platform_rating: Number(formData.student_coding_platform_rating || 0),
      student_experience_level: formData.student_experience_level || "Unknown",
      student_interests: formData.student_interests || "Unknown",
      job_title: formData.job_title,
      required_experience: Number(formData.required_experience || 0),
      job_location: formData.job_location || "Unknown",
      work_mode: formData.work_mode || "Unknown",
      company_size: formData.company_size || "Unknown",
      industry: formData.industry || "Unknown",
      job_duration_months: Number(formData.job_duration_months || 6)
    };

    if (formData.candidate_id) payload.candidate_id = formData.candidate_id;
    if (formData.student_career_label) payload.student_career_label = formData.student_career_label;
    if (formData.required_skills) payload.required_skills = formData.required_skills;
    if (formData.student_weekly_study_hours !== "") {
      payload.student_weekly_study_hours = Number(formData.student_weekly_study_hours);
    }

    try {
      const response = await getFinalMatch(payload);
      setRawResponse(response);
      const data = extractData(response);
      setResult(data);
      setApiStatus({
        status: "success",
        message: "Prediction completed.",
        details: "Comprehensive Final Match synthesis completed successfully."
      });
    } catch (err) {
      const parsed = parseApiError(err);
      setApiStatus(parsed);
    } finally {
      setLoading(false);
    }
  };

  const getMatchBadgeStyle = (label) => {
    if (!label) return "bg-slate-100 text-slate-800 border-slate-200";
    const lower = label.toLowerCase();
    if (lower.includes("strong") || lower.includes("high") || lower.includes("excellent")) {
      return "bg-emerald-100 text-emerald-800 border-emerald-200";
    }
    if (lower.includes("good") || lower.includes("moderate")) {
      return "bg-blue-100 text-blue-800 border-blue-200";
    }
    return "bg-amber-100 text-amber-800 border-amber-200";
  };

  return (
    <div className="space-y-8">
      {/* Header banner */}
      <div className="rounded-2xl border border-slate-200/80 bg-gradient-to-r from-cyan-500/10 via-blue-500/5 to-transparent p-6 shadow-xs">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              Final Match
            </h2>
            <p className="mt-1 text-sm text-slate-600 max-w-2xl">
              Synthesizes overall match percentage, component scores (suitability, salary, skill),
              skill overlap percentage, and compensation feasibility.
            </p>
          </div>

          <div className="flex items-center gap-2.5 self-start sm:self-auto">
            <button
              type="button"
              onClick={handleLoadSample}
              className="inline-flex items-center gap-1.5 rounded-xl border border-cyan-200 bg-white px-3.5 py-2 text-xs font-semibold text-cyan-900 shadow-xs hover:bg-cyan-50 hover:border-cyan-300 transition"
            >
              <Sparkles size={14} className="text-amber-500" />
              Load Example Data
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 shadow-xs hover:bg-slate-50 transition"
            >
              <RotateCcw size={13} />
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Status banner */}
      <StatusBanner
        status={apiStatus?.status}
        message={apiStatus?.message}
        details={apiStatus?.details}
        fieldErrors={apiStatus?.fieldErrors}
        onRetry={handleSubmit}
        onDismiss={() => setApiStatus(null)}
      />

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Container */}
        <form
          onSubmit={handleSubmit}
          className="lg:col-span-7 space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          {/* Section 1: Candidate Qualifications */}
          <div>
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-50 text-cyan-700">
                <User size={16} />
              </div>
              <h3 className="text-base font-bold text-slate-800">
                1. Candidate Profile & Technical Credentials
              </h3>
            </div>

            <div className="mt-4 space-y-4">
              <TagMultiSelect
                label="Candidate Skills"
                name="candidate_skills"
                value={formData.candidate_skills}
                onChange={handleFieldChange}
                required
                placeholder="Python, SQL, Machine Learning, Pandas..."
                suggestions={COMMON_SKILLS_SUGGESTIONS}
                error={errors.candidate_skills}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormSelect
                  label="Education"
                  name="education"
                  value={formData.education}
                  options={DROPDOWN_OPTIONS.education}
                  onChange={handleFieldChange}
                  allowUnknown
                  helperText="Default: Unknown"
                />

                <NumericField
                  label="Years of Experience"
                  name="years_experience"
                  value={formData.years_experience}
                  onChange={handleFieldChange}
                  required
                  min={0}
                  unit="Years"
                  error={errors.years_experience}
                />

                <FormSelect
                  label="Preferred Work Mode"
                  name="candidate_preferred_work_mode"
                  value={formData.candidate_preferred_work_mode}
                  options={DROPDOWN_OPTIONS.candidate_preferred_work_mode}
                  onChange={handleFieldChange}
                  allowUnknown
                  helperText="Default: Unknown"
                />

                <div className="space-y-1.5">
                  <label
                    htmlFor="fm_candidate_location"
                    className="text-xs font-semibold uppercase tracking-wider text-slate-700"
                  >
                    Candidate Location
                  </label>
                  <input
                    id="fm_candidate_location"
                    type="text"
                    value={formData.candidate_location}
                    onChange={(e) =>
                      handleFieldChange("candidate_location", e.target.value)
                    }
                    placeholder="e.g. Ghaziabad (Default Unknown)"
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-medium text-slate-800 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 outline-none"
                  />
                </div>

                <NumericField
                  label="Year of Study"
                  name="student_year_of_study"
                  value={formData.student_year_of_study}
                  onChange={handleFieldChange}
                  required
                  min={0}
                  error={errors.student_year_of_study}
                />

                <NumericField
                  label="Student CGPA"
                  name="student_cgpa"
                  value={formData.student_cgpa}
                  onChange={handleFieldChange}
                  required
                  min={0.1}
                  max={10}
                  step={0.1}
                  helperText="Must be > 0"
                  error={errors.student_cgpa}
                />

                <NumericField
                  label="Number of Projects"
                  name="student_num_projects"
                  value={formData.student_num_projects}
                  onChange={handleFieldChange}
                  required
                  min={0}
                  error={errors.student_num_projects}
                />

                <NumericField
                  label="Certifications Count"
                  name="student_certifications"
                  value={formData.student_certifications}
                  onChange={handleFieldChange}
                  required
                  min={0}
                  error={errors.student_certifications}
                />

                <NumericField
                  label="Internships Completed"
                  name="student_internships"
                  value={formData.student_internships}
                  onChange={handleFieldChange}
                  min={0}
                  helperText="Default: 0"
                />

                <NumericField
                  label="GitHub Repositories"
                  name="student_github_repos"
                  value={formData.student_github_repos}
                  onChange={handleFieldChange}
                  required
                  min={0}
                  error={errors.student_github_repos}
                />

                <NumericField
                  label="Hackathons Participated"
                  name="student_hackathons_participated"
                  value={formData.student_hackathons_participated}
                  onChange={handleFieldChange}
                  required
                  min={0}
                  error={errors.student_hackathons_participated}
                />

                <NumericField
                  label="Coding Platform Rating"
                  name="student_coding_platform_rating"
                  value={formData.student_coding_platform_rating}
                  onChange={handleFieldChange}
                  min={0}
                  helperText="Default: 0"
                />

                <FormSelect
                  label="Experience Level"
                  name="student_experience_level"
                  value={formData.student_experience_level}
                  options={DROPDOWN_OPTIONS.student_experience_level}
                  onChange={handleFieldChange}
                  allowUnknown
                  helperText="Default: Unknown"
                />

                <div className="space-y-1.5">
                  <label
                    htmlFor="fm_candidate_id"
                    className="text-xs font-semibold uppercase tracking-wider text-slate-700"
                  >
                    Candidate ID
                    <span className="ml-1 text-[11px] font-normal text-slate-400">
                      (Optional)
                    </span>
                  </label>
                  <input
                    id="fm_candidate_id"
                    type="text"
                    value={formData.candidate_id}
                    onChange={(e) =>
                      handleFieldChange("candidate_id", e.target.value)
                    }
                    placeholder="e.g. cand_001"
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-medium text-slate-800 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 outline-none"
                  />
                </div>
              </div>

              <TagMultiSelect
                label="Student Interests"
                name="student_interests"
                value={formData.student_interests}
                onChange={handleFieldChange}
                placeholder="AI, Machine Learning..."
                suggestions={["AI", "Machine Learning", "Data Science", "Backend", "Frontend", "Cloud"]}
                helperText="Default: Unknown"
              />
            </div>
          </div>

          {/* Section 2: Target Job Details */}
          <div className="pt-2">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                <Briefcase size={16} />
              </div>
              <h3 className="text-base font-bold text-slate-800">
                2. Target Job Role & Company Environment
              </h3>
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormSelect
                label="Job Title"
                name="job_title"
                value={formData.job_title}
                options={DROPDOWN_OPTIONS.job_title}
                onChange={handleFieldChange}
                required
                error={errors.job_title}
              />

              <NumericField
                label="Required Experience"
                name="required_experience"
                value={formData.required_experience}
                onChange={handleFieldChange}
                min={0}
                unit="Years"
                helperText="Default: 0"
              />

              <FormSelect
                label="Job Location"
                name="job_location"
                value={formData.job_location}
                options={DROPDOWN_OPTIONS.job_location}
                onChange={handleFieldChange}
                allowUnknown
                helperText="Default: Unknown"
              />

              <FormSelect
                label="Work Mode"
                name="work_mode"
                value={formData.work_mode}
                options={DROPDOWN_OPTIONS.work_mode}
                onChange={handleFieldChange}
                allowUnknown
                helperText="Default: Unknown"
              />

              <FormSelect
                label="Company Size"
                name="company_size"
                value={formData.company_size}
                options={DROPDOWN_OPTIONS.company_size}
                onChange={handleFieldChange}
                allowUnknown
                helperText="Default: Unknown"
              />

              <FormSelect
                label="Industry"
                name="industry"
                value={formData.industry}
                options={DROPDOWN_OPTIONS.industry}
                onChange={handleFieldChange}
                allowUnknown
                helperText="Default: Unknown"
              />

              <NumericField
                label="Job Duration (Months)"
                name="job_duration_months"
                value={formData.job_duration_months}
                onChange={handleFieldChange}
                min={1}
                unit="Mo"
                helperText="Default: 6 (Must be > 0)"
                error={errors.job_duration_months}
              />
            </div>
          </div>

          {/* Submit action */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500">
              * Indicates mandatory model input
            </span>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl bg-cyan-700 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-cyan-700/20 hover:bg-cyan-800 disabled:opacity-50 transition"
            >
              {loading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Synthesizing Final Match...</span>
                </>
              ) : (
                <>
                  <Send size={15} />
                  <span>Calculate Final Match</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Results Container */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <FileCheck className="text-cyan-700" size={18} />
                <h3 className="font-bold text-slate-900">Final Match Evaluation</h3>
              </div>
            </div>

            {loading && (
              <div className="py-14 text-center">
                <div className="mx-auto h-10 w-10 animate-spin rounded-full border-3 border-cyan-700 border-t-transparent" />
                <p className="mt-4 text-sm font-semibold text-slate-700">
                  Calculating overall match...
                </p>
              </div>
            )}

            {!loading && !result && (
              <div className="py-12 text-center text-slate-400">
                <ShieldCheck className="mx-auto h-12 w-12 text-slate-300" strokeWidth={1.5} />
                <p className="mt-3 text-sm font-medium text-slate-600">
                  No final match evaluation yet
                </p>
                <p className="mt-1 text-xs text-slate-400 max-w-xs mx-auto">
                  Click "Load Example Data" and submit to see complete candidate synthesis.
                </p>
              </div>
            )}

            {!loading && result && (
              <div className="mt-6 space-y-6 animate-fadeIn">
                {/* Rule from Page 6:
                    - "Show final_match_percentage as the primary overall match percentage and match_label as a badge."
                    - "Show skill_overlap_percentage and suitable (Suitable / Not suitable)." */}
                <div className="rounded-2xl border border-cyan-100 bg-gradient-to-br from-cyan-50/70 via-blue-50/30 to-white p-6 text-center">
                  {/* Match label badge */}
                  <div className="flex items-center justify-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-bold border ${getMatchBadgeStyle(
                        result.match_label
                      )}`}
                    >
                      {result.match_label || "Evaluated Match"}
                    </span>

                    {result.suitable !== undefined && (
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold border ${
                          result.suitable
                            ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                            : "bg-rose-50 text-rose-800 border-rose-200"
                        }`}
                      >
                        {result.suitable ? (
                          <>
                            <CheckCircle2 size={13} className="text-emerald-600" />
                            Suitable
                          </>
                        ) : (
                          <>
                            <XCircle size={13} className="text-rose-600" />
                            Not suitable
                          </>
                        )}
                      </span>
                    )}
                  </div>

                  {/* Primary overall match percentage */}
                  <div className="mt-5">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Overall Match Percentage
                    </span>
                    <div className="mt-1 text-4xl sm:text-5xl font-extrabold text-cyan-800 tracking-tight">
                      {typeof result.final_match_percentage === "number"
                        ? `${result.final_match_percentage.toFixed(2)}%`
                        : `${result.final_match_percentage}%`}
                    </div>

                    <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-slate-200">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-600 to-blue-600 transition-all duration-700"
                        style={{
                          width: `${Math.min(
                            100,
                            Math.max(
                              0,
                              Number(result.final_match_percentage) || 0
                            )
                          )}%`
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Secondary Metrics: Skill Overlap & Predicted Salary */}
                <div className="grid grid-cols-2 gap-3">
                  {/* Skill Overlap Percentage */}
                  <div className="rounded-xl border border-slate-200/80 bg-white p-4">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      <Percent size={13} className="text-blue-600" />
                      <span>Skill Overlap</span>
                    </div>
                    <div className="mt-2 text-xl font-bold text-slate-800">
                      {typeof result.skill_overlap_percentage === "number"
                        ? `${result.skill_overlap_percentage}%`
                        : `${result.skill_overlap_percentage ?? "0%"}`}
                    </div>
                  </div>

                  {/* Rule from Page 6: "If predicted_salary_lpa is null, show 'Not available'." */}
                  <div className="rounded-xl border border-slate-200/80 bg-white p-4">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      <IndianRupee size={13} className="text-emerald-600" />
                      <span>Salary Est.</span>
                    </div>
                    <div className="mt-2 text-xl font-bold text-slate-800">
                      {result.predicted_salary_lpa !== null &&
                      result.predicted_salary_lpa !== undefined
                        ? `${result.predicted_salary_lpa} LPA`
                        : "Not available"}
                    </div>
                  </div>
                </div>

                {/* Rule from Page 6:
                    "Show scores.suitability, scores.salary, and scores.skill as component scores without inventing undocumented meanings." */}
                {result.scores && (
                  <div className="rounded-xl border border-slate-200/80 bg-white p-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-3">
                      Component Scores
                    </span>

                    <div className="space-y-3">
                      <div>
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-slate-600">Suitability Score</span>
                          <span className="font-mono font-bold text-slate-800">
                            {result.scores.suitability !== undefined
                              ? String(result.scores.suitability)
                              : "N/A"}
                          </span>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                          <div
                            className="h-full bg-blue-500 rounded-full"
                            style={{
                              width: `${Math.min(
                                100,
                                Math.max(
                                  0,
                                  (Number(result.scores.suitability) || 0) * 100
                                )
                              )}%`
                            }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-slate-600">Salary Score</span>
                          <span className="font-mono font-bold text-slate-800">
                            {result.scores.salary !== undefined
                              ? String(result.scores.salary)
                              : "N/A"}
                          </span>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                          <div
                            className="h-full bg-emerald-500 rounded-full"
                            style={{
                              width: `${Math.min(
                                100,
                                Math.max(
                                  0,
                                  (Number(result.scores.salary) || 0) * 100
                                )
                              )}%`
                            }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-slate-600">Skill Score</span>
                          <span className="font-mono font-bold text-slate-800">
                            {result.scores.skill !== undefined
                              ? String(result.scores.skill)
                              : "N/A"}
                          </span>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                          <div
                            className="h-full bg-purple-500 rounded-full"
                            style={{
                              width: `${Math.min(
                                100,
                                Math.max(
                                  0,
                                  (Number(result.scores.skill) || 0) * 100
                                )
                              )}%`
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Raw Model Score */}
                <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/70 p-3 text-xs">
                  <span className="text-slate-500">Raw final_match:</span>
                  <span className="font-mono font-semibold text-slate-700">
                    {result.final_match !== undefined
                      ? String(result.final_match)
                      : "N/A"}
                  </span>
                </div>


              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinalMatchView;
