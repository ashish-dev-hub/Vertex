import React, { useState } from "react";
import {
  TrendingUp,
  Sparkles,
  IndianRupee,
  RotateCcw,
  Send,
  Code,
  FileCheck,
  User,
  Briefcase
} from "lucide-react";
import { getRegression, extractData, parseApiError } from "../../api/ml";
import { DROPDOWN_OPTIONS, SAMPLE_PAYLOADS } from "../../constants/mlOptions";
import FormSelect from "./FormSelect";
import NumericField from "./NumericField";
import StatusBanner from "./StatusBanner";

const initialForm = {
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

  // Optional fields
  candidate_location: "Ghaziabad",
  industry: "Product / SaaS",
  student_experience_level: "Beginner",
  student_career_label: "",
  skill_overlap: "",
  skill_coverage: ""
};

const RegressionView = () => {
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
    setFormData({ ...initialForm, ...SAMPLE_PAYLOADS.regression });
    setErrors({});
    setApiStatus(null);
  };

  const handleReset = () => {
    setFormData({
      education: "",
      years_experience: 0,
      candidate_preferred_work_mode: "",
      job_title: "",
      required_experience: 0,
      job_location: "",
      work_mode: "",
      company_size: "",
      job_duration_months: 6,
      student_year_of_study: 1,
      student_cgpa: 8.0,
      student_num_projects: 0,
      student_internships: 0,
      student_github_repos: 0,
      student_hackathons_participated: 0,
      candidate_location: "",
      industry: "",
      student_experience_level: "",
      student_career_label: "",
      skill_overlap: "",
      skill_coverage: ""
    });
    setResult(null);
    setRawResponse(null);
    setApiStatus(null);
    setErrors({});
  };

  const validate = () => {
    const errs = {};
    const requiredDropdowns = [
      "education",
      "candidate_preferred_work_mode",
      "job_title",
      "job_location",
      "work_mode",
      "company_size"
    ];

    requiredDropdowns.forEach((f) => {
      if (!formData[f] || String(formData[f]).trim() === "") {
        errs[f] = "This field is required";
      }
    });

    if (formData.years_experience === "" || Number(formData.years_experience) < 0) {
      errs.years_experience = "Must be integer ≥ 0";
    }
    if (formData.required_experience === "" || Number(formData.required_experience) < 0) {
      errs.required_experience = "Must be integer ≥ 0";
    }
    if (formData.job_duration_months === "" || Number(formData.job_duration_months) <= 0) {
      errs.job_duration_months = "Duration must be > 0";
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

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!validate()) {
      setApiStatus({
        status: "validation",
        message: "Check required fields and formats.",
        details: "Please fill all required regression inputs before predicting."
      });
      return;
    }

    setLoading(true);
    setApiStatus(null);

    const payload = {
      education: formData.education,
      years_experience: Number(formData.years_experience),
      candidate_preferred_work_mode: formData.candidate_preferred_work_mode,
      job_title: formData.job_title,
      required_experience: Number(formData.required_experience),
      job_location: formData.job_location,
      work_mode: formData.work_mode,
      company_size: formData.company_size,
      job_duration_months: Number(formData.job_duration_months),
      student_year_of_study: Number(formData.student_year_of_study),
      student_cgpa: Number(formData.student_cgpa),
      student_num_projects: Number(formData.student_num_projects),
      student_internships: Number(formData.student_internships),
      student_github_repos: Number(formData.student_github_repos),
      student_hackathons_participated: Number(formData.student_hackathons_participated)
    };

    if (formData.candidate_location) payload.candidate_location = formData.candidate_location;
    if (formData.industry) payload.industry = formData.industry;
    if (formData.student_experience_level) payload.student_experience_level = formData.student_experience_level;
    if (formData.student_career_label) payload.student_career_label = formData.student_career_label;
    if (formData.skill_overlap !== "") payload.skill_overlap = Number(formData.skill_overlap);
    if (formData.skill_coverage !== "") payload.skill_coverage = Number(formData.skill_coverage);

    try {
      const response = await getRegression(payload);
      setRawResponse(response);
      const data = extractData(response);
      setResult(data);
      setApiStatus({
        status: "success",
        message: "Prediction completed.",
        details: "Expected compensation package estimated successfully."
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
      {/* Header banner */}
      <div className="rounded-2xl border border-slate-200/80 bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-transparent p-6 shadow-xs">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              Salary Prediction
            </h2>
            <p className="mt-1 text-sm text-slate-600 max-w-2xl">
              Estimates expected salary in LPA (Lakhs Per Annum) for candidates based on
              academic record, technical repos, projects, role, and company parameters.
            </p>
          </div>

          <div className="flex items-center gap-2.5 self-start sm:self-auto">
            <button
              type="button"
              onClick={handleLoadSample}
              className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-white px-3.5 py-2 text-xs font-semibold text-emerald-800 shadow-xs hover:bg-emerald-50 hover:border-emerald-300 transition"
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
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
                <User size={16} />
              </div>
              <h3 className="text-base font-bold text-slate-800">
                1. Candidate Profile & Technical Depth
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
                label="Candidate Experience"
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
                required
                error={errors.candidate_preferred_work_mode}
              />

              <div className="space-y-1.5">
                <label
                  htmlFor="reg_candidate_location"
                  className="text-xs font-semibold uppercase tracking-wider text-slate-700"
                >
                  Candidate Location
                  <span className="ml-1 text-[11px] font-normal text-slate-400">
                    (Optional)
                  </span>
                </label>
                <input
                  id="reg_candidate_location"
                  type="text"
                  value={formData.candidate_location}
                  onChange={(e) =>
                    handleFieldChange("candidate_location", e.target.value)
                  }
                  placeholder="e.g. Ghaziabad"
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-medium text-slate-800 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none"
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
            </div>
          </div>

          {/* Section 2: Job Characteristics */}
          <div className="pt-2">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-50 text-teal-700">
                <Briefcase size={16} />
              </div>
              <h3 className="text-base font-bold text-slate-800">
                2. Job Role & Market Factors
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
                label="Experience Level"
                name="student_experience_level"
                value={formData.student_experience_level}
                options={DROPDOWN_OPTIONS.student_experience_level}
                onChange={handleFieldChange}
                required={false}
              />
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500">
              * Indicates mandatory model input
            </span>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {loading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Estimating Salary...</span>
                </>
              ) : (
                <>
                  <Send size={15} />
                  <span>Predict Salary</span>
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
                <FileCheck className="text-emerald-600" size={18} />
                <h3 className="font-bold text-slate-900">Salary Prediction Result</h3>
              </div>
            </div>

            {loading && (
              <div className="py-14 text-center">
                <div className="mx-auto h-10 w-10 animate-spin rounded-full border-3 border-emerald-600 border-t-transparent" />
                <p className="mt-4 text-sm font-semibold text-slate-700">
                  Estimating expected package...
                </p>
              </div>
            )}

            {!loading && !result && (
              <div className="py-12 text-center text-slate-400">
                <TrendingUp className="mx-auto h-12 w-12 text-slate-300" strokeWidth={1.5} />
                <p className="mt-3 text-sm font-medium text-slate-600">
                  No prediction calculated yet
                </p>
                <p className="mt-1 text-xs text-slate-400 max-w-xs mx-auto">
                  Click "Load Example Data" and submit to see predicted compensation.
                </p>
              </div>
            )}

            {!loading && result && (
              <div className="mt-6 space-y-6 animate-fadeIn">
                {/* Rule from Page 4: "Show predicted_salary_lpa as 'Predicted salary: 8.79 LPA'" */}
                <div className="rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50/70 via-teal-50/30 to-white p-6 text-center">
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
                    <IndianRupee size={14} />
                    Estimated Compensation
                  </div>

                  <div className="mt-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Predicted Package
                    </p>
                    <div className="mt-1 text-3xl sm:text-4xl font-extrabold text-emerald-700 tracking-tight">
                      Predicted salary: {result.predicted_salary_lpa} LPA
                    </div>
                  </div>
                </div>

                {/* Rule from Page 4: "Do not label salary_score as accuracy unless the ML team documents its meaning." */}
                <div className="rounded-xl border border-slate-200/80 bg-white p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Salary Score
                      </span>
                      <p className="text-xs text-slate-400">
                        (Raw score, not accuracy)
                      </p>
                    </div>
                    <span className="font-mono text-base font-bold text-slate-800">
                      {result.salary_score !== undefined
                        ? String(result.salary_score)
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

export default RegressionView;
