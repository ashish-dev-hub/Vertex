import React, { useState } from "react";
import {
  BrainCircuit,
  Sparkles,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Send,
  Code,
  FileCheck,
  User,
  Briefcase
} from "lucide-react";
import { getClassification, extractData, parseApiError } from "../../api/ml";
import { DROPDOWN_OPTIONS, SAMPLE_PAYLOADS } from "../../constants/mlOptions";
import FormSelect from "./FormSelect";
import TagMultiSelect from "./TagMultiSelect";
import NumericField from "./NumericField";
import StatusBanner from "./StatusBanner";

const initialForm = {
  // Candidate Profile
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

  // Job Details
  job_title: "Data Science Intern",
  required_experience: 0,
  job_location: "Noida",
  work_mode: "Hybrid",
  company_size: "Medium",
  job_duration_months: 6,

  // Optional fields
  industry: "Product / SaaS",
  student_experience_level: "Beginner",
  student_weekly_study_hours: "",
  student_career_label: "",
  skill_coverage: ""
};

const ClassificationView = () => {
  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiStatus, setApiStatus] = useState(null); // { status, message, details, fieldErrors }
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
    setFormData({ ...initialForm, ...SAMPLE_PAYLOADS.classification });
    setErrors({});
    setApiStatus(null);
  };

  const handleReset = () => {
    setFormData({
      education: "",
      years_experience: 0,
      candidate_location: "",
      candidate_preferred_work_mode: "",
      student_year_of_study: 1,
      student_cgpa: 8.0,
      student_num_projects: 0,
      student_certifications: 0,
      student_internships: 0,
      student_github_repos: 0,
      student_hackathons_participated: 0,
      student_coding_platform_rating: 0,
      student_interests: "",
      job_title: "",
      required_experience: 0,
      job_location: "",
      work_mode: "",
      company_size: "",
      job_duration_months: 6,
      industry: "",
      student_experience_level: "",
      student_weekly_study_hours: "",
      student_career_label: "",
      skill_coverage: ""
    });
    setResult(null);
    setRawResponse(null);
    setApiStatus(null);
    setErrors({});
  };

  const validate = () => {
    const errs = {};
    const required = [
      "education",
      "candidate_preferred_work_mode",
      "student_interests",
      "job_title",
      "job_location",
      "work_mode",
      "company_size"
    ];

    required.forEach((f) => {
      if (!formData[f] || String(formData[f]).trim() === "") {
        errs[f] = "This field is required";
      }
    });

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
    if (formData.student_internships === "" || Number(formData.student_internships) < 0) {
      errs.student_internships = "Must be ≥ 0";
    }
    if (formData.student_github_repos === "" || Number(formData.student_github_repos) < 0) {
      errs.student_github_repos = "Must be ≥ 0";
    }
    if (formData.student_hackathons_participated === "" || Number(formData.student_hackathons_participated) < 0) {
      errs.student_hackathons_participated = "Must be ≥ 0";
    }
    if (formData.student_coding_platform_rating === "" || Number(formData.student_coding_platform_rating) < 0) {
      errs.student_coding_platform_rating = "Must be ≥ 0";
    }
    if (formData.required_experience === "" || Number(formData.required_experience) < 0) {
      errs.required_experience = "Must be ≥ 0";
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
        details: "Please fill all required fields correctly before submitting."
      });
      return;
    }

    setLoading(true);
    setApiStatus(null);

    // Build payload matching ClassificationInput schema exactly
    const payload = {
      education: formData.education,
      years_experience: Number(formData.years_experience),
      candidate_preferred_work_mode: formData.candidate_preferred_work_mode,
      student_year_of_study: Number(formData.student_year_of_study),
      student_cgpa: Number(formData.student_cgpa),
      student_num_projects: Number(formData.student_num_projects),
      // certifications: can be number, string, or array
      student_certifications:
        typeof formData.student_certifications === "number"
          ? formData.student_certifications
          : isNaN(Number(formData.student_certifications))
          ? formData.student_certifications
          : Number(formData.student_certifications),
      student_internships: Number(formData.student_internships),
      student_github_repos: Number(formData.student_github_repos),
      student_hackathons_participated: Number(formData.student_hackathons_participated),
      student_coding_platform_rating: Number(formData.student_coding_platform_rating),
      student_interests: formData.student_interests,
      job_title: formData.job_title,
      required_experience: Number(formData.required_experience),
      job_location: formData.job_location,
      work_mode: formData.work_mode,
      company_size: formData.company_size,
      job_duration_months: Number(formData.job_duration_months)
    };

    if (formData.candidate_location) payload.candidate_location = formData.candidate_location;
    if (formData.industry) payload.industry = formData.industry;
    if (formData.student_experience_level) payload.student_experience_level = formData.student_experience_level;
    if (formData.student_career_label) payload.student_career_label = formData.student_career_label;
    if (formData.student_weekly_study_hours !== "") {
      payload.student_weekly_study_hours = Number(formData.student_weekly_study_hours);
    }
    if (formData.skill_coverage !== "") {
      payload.skill_coverage = Number(formData.skill_coverage);
    }

    try {
      const response = await getClassification(payload);
      setRawResponse(response);
      const data = extractData(response);
      setResult(data);
      setApiStatus({
        status: "success",
        message: "Prediction completed.",
        details: "Candidate fit evaluated successfully."
      });
    } catch (err) {
      const parsed = parseApiError(err);
      setApiStatus(parsed);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header card */}
      <div className="rounded-2xl border border-slate-200/80 bg-gradient-to-r from-blue-500/10 via-indigo-500/5 to-transparent p-6 shadow-xs">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              Candidate Fit
            </h2>
            <p className="mt-1 text-sm text-slate-600 max-w-2xl">
              Predicts candidate suitability and calculates fit percentage based on
              education, projects, internships, GitHub repositories, and job requirements.
            </p>
          </div>

          <div className="flex items-center gap-2.5 self-start sm:self-auto">
            <button
              type="button"
              onClick={handleLoadSample}
              className="inline-flex items-center gap-1.5 rounded-xl border border-blue-200 bg-white px-3.5 py-2 text-xs font-semibold text-blue-700 shadow-xs hover:bg-blue-50 hover:border-blue-300 transition"
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

      {/* Main Grid: Form on left, Results on right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Container */}
        <form
          onSubmit={handleSubmit}
          className="lg:col-span-7 space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          {/* Section 1: Candidate Profile */}
          <div>
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <User size={16} />
              </div>
              <h3 className="text-base font-bold text-slate-800">
                1. Candidate Profile Information
              </h3>
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormSelect
                label="Education"
                name="education"
                value={formData.education}
                options={DROPDOWN_OPTIONS.education}
                onChange={handleFieldChange}
                required
                error={errors.education}
              />

              <NumericField
                label="Years of Experience"
                name="years_experience"
                value={formData.years_experience}
                onChange={handleFieldChange}
                required
                min={0}
                step={1}
                unit="Years"
                error={errors.years_experience}
              />

              <FormSelect
                label="Preferred Work Mode"
                name="candidate_preferred_work_mode"
                value={formData.candidate_preferred_work_mode}
                options={DROPDOWN_OPTIONS.candidate_preferred_work_mode}
                onChange={handleFieldChange}
                required
                error={errors.candidate_preferred_work_mode}
              />

              <div className="space-y-1.5">
                <label
                  htmlFor="candidate_location"
                  className="text-xs font-semibold uppercase tracking-wider text-slate-700"
                >
                  Candidate Location
                  <span className="ml-1 text-[11px] font-normal text-slate-400">
                    (Optional)
                  </span>
                </label>
                <input
                  id="candidate_location"
                  type="text"
                  value={formData.candidate_location}
                  onChange={(e) =>
                    handleFieldChange("candidate_location", e.target.value)
                  }
                  placeholder="e.g. Ghaziabad, Delhi"
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-medium text-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                />
              </div>

              <NumericField
                label="Year of Study"
                name="student_year_of_study"
                value={formData.student_year_of_study}
                onChange={handleFieldChange}
                required
                min={0}
                step={1}
                helperText="Integer ≥ 0"
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
                helperText="Must be > 0 (e.g. 8.2)"
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
                helperText="Total certificates earned"
                error={errors.student_certifications}
              />

              <NumericField
                label="Internships Completed"
                name="student_internships"
                value={formData.student_internships}
                onChange={handleFieldChange}
                required
                min={0}
                error={errors.student_internships}
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
                required
                min={0}
                step={50}
                placeholder="e.g. 1200"
                helperText="e.g. LeetCode / CodeChef"
                error={errors.student_coding_platform_rating}
              />
            </div>

            <div className="mt-4">
              <TagMultiSelect
                label="Student Interests"
                name="student_interests"
                value={formData.student_interests}
                onChange={handleFieldChange}
                required
                placeholder="AI, Machine Learning, Web Dev..."
                suggestions={["AI", "Machine Learning", "Data Science", "Backend", "Web Development", "Cloud"]}
                error={errors.student_interests}
              />
            </div>
          </div>

          {/* Section 2: Job Specifications */}
          <div className="pt-2">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                <Briefcase size={16} />
              </div>
              <h3 className="text-base font-bold text-slate-800">
                2. Job Role Specifications
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
                required
                min={0}
                unit="Years"
                error={errors.required_experience}
              />

              <FormSelect
                label="Job Location"
                name="job_location"
                value={formData.job_location}
                options={DROPDOWN_OPTIONS.job_location}
                onChange={handleFieldChange}
                required
                error={errors.job_location}
              />

              <FormSelect
                label="Work Mode"
                name="work_mode"
                value={formData.work_mode}
                options={DROPDOWN_OPTIONS.work_mode}
                onChange={handleFieldChange}
                required
                error={errors.work_mode}
              />

              <FormSelect
                label="Company Size"
                name="company_size"
                value={formData.company_size}
                options={DROPDOWN_OPTIONS.company_size}
                onChange={handleFieldChange}
                required
                error={errors.company_size}
              />

              <NumericField
                label="Job Duration (Months)"
                name="job_duration_months"
                value={formData.job_duration_months}
                onChange={handleFieldChange}
                required
                min={1}
                unit="Mo"
                helperText="Must be > 0"
                error={errors.job_duration_months}
              />

              <FormSelect
                label="Industry"
                name="industry"
                value={formData.industry}
                options={DROPDOWN_OPTIONS.industry}
                onChange={handleFieldChange}
                required={false}
              />

              <FormSelect
                label="Student Experience Level"
                name="student_experience_level"
                value={formData.student_experience_level}
                options={DROPDOWN_OPTIONS.student_experience_level}
                onChange={handleFieldChange}
                required={false}
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
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {loading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Evaluating Candidate Fit...</span>
                </>
              ) : (
                <>
                  <Send size={15} />
                  <span>Check Candidate Fit</span>
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
                <FileCheck className="text-blue-600" size={18} />
                <h3 className="font-bold text-slate-900">Candidate Fit Result</h3>
              </div>
            </div>

            {loading && (
              <div className="py-14 text-center">
                <div className="mx-auto h-10 w-10 animate-spin rounded-full border-3 border-blue-600 border-t-transparent" />
                <p className="mt-4 text-sm font-semibold text-slate-700">
                  Evaluating candidate profile...
                </p>
              </div>
            )}

            {!loading && !result && (
              <div className="py-12 text-center text-slate-400">
                <BrainCircuit className="mx-auto h-12 w-12 text-slate-300" strokeWidth={1.5} />
                <p className="mt-3 text-sm font-medium text-slate-600">
                  No prediction results yet
                </p>
                <p className="mt-1 text-xs text-slate-400 max-w-xs mx-auto">
                  Fill the form or click "Load Example Data" and submit to see model output.
                </p>
              </div>
            )}

            {!loading && result && (
              <div className="mt-6 space-y-6 animate-fadeIn">
                {/* Suitability Badge & Fit Percentage */}
                <div className="rounded-2xl border border-slate-100 bg-gradient-to-br from-slate-50 to-blue-50/30 p-5 text-center">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Candidate Suitability
                  </span>

                  <div className="mt-3 flex items-center justify-center gap-2">
                    {result.suitable ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-4 py-1.5 text-sm font-bold text-emerald-800 border border-emerald-200">
                        <CheckCircle2 size={16} className="text-emerald-600" />
                        Suitable
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-100 px-4 py-1.5 text-sm font-bold text-rose-800 border border-rose-200">
                        <XCircle size={16} className="text-rose-600" />
                        Not suitable
                      </span>
                    )}
                  </div>

                  {/* Primary Fit Percentage */}
                  <div className="mt-6">
                    <span className="text-xs font-medium text-slate-500">
                      Fit Percentage
                    </span>
                    <div className="mt-1 text-4xl font-extrabold text-blue-600 tracking-tight">
                      {typeof result.fit_percentage === "number"
                        ? `${result.fit_percentage.toFixed(2)}%`
                        : `${result.fit_percentage}%`}
                    </div>

                    {/* Progress bar */}
                    <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-200">
                      <div
                        className={`h-full transition-all duration-700 ${
                          result.suitable ? "bg-emerald-500" : "bg-blue-600"
                        }`}
                        style={{
                          width: `${Math.min(
                            100,
                            Math.max(0, Number(result.fit_percentage) || 0)
                          )}%`
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Raw Model Score Note as specified in Section 4:
                    "fit_score is a raw model score; do not label it a probability unless documented by the ML team." */}
                <div className="rounded-xl border border-slate-200/80 bg-white p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Raw Model Score
                      </span>
                      <p className="text-xs text-slate-400">
                        (Raw score, not a probability)
                      </p>
                    </div>
                    <span className="font-mono text-base font-bold text-slate-800">
                      {result.fit_score !== undefined
                        ? String(result.fit_score)
                        : "N/A"}
                    </span>
                  </div>
                </div>


              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassificationView;
