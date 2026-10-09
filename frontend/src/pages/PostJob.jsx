 
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createJob } from "../api/jobs";

const initialForm = {
  title: "",
  description: "",
  skills: "",
  experience: "",
  location: "",
  workMode: "",
  jobType: "",
  salaryMin: "",
  salaryMax: "",
  applicationDeadline: "",
};

const PostJob = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState(initialForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    // Validate salary
    if (
      (formData.salaryMin !== "" &&
        Number(formData.salaryMin) < 0) ||
      (formData.salaryMax !== "" &&
        Number(formData.salaryMax) < 0)
    ) {
      setError("Salary cannot be negative.");
      return;
    }

    if (
      formData.salaryMin !== "" &&
      formData.salaryMax !== "" &&
      Number(formData.salaryMin) >
        Number(formData.salaryMax)
    ) {
      setError(
        "Minimum salary cannot be greater than maximum salary."
      );
      return;
    }

    // Validate deadline
    if (formData.applicationDeadline) {
      const deadline = new Date(
        formData.applicationDeadline + "T00:00:00"
      );

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (
        Number.isNaN(deadline.getTime()) ||
        deadline < today
      ) {
        setError(
          "Application deadline cannot be in the past."
        );
        return;
      }
    }

    setSaving(true);

    try {
      const jobData = {
        title: formData.title.trim(),
        description: formData.description.trim(),

        skills: formData.skills
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean),

        experience: formData.experience,
        location: formData.location.trim(),
        workMode: formData.workMode,
        jobType: formData.jobType,

        ...(formData.salaryMin !== "" && {
          salaryMin: Number(formData.salaryMin),
        }),

        ...(formData.salaryMax !== "" && {
          salaryMax: Number(formData.salaryMax),
        }),

        applicationDeadline:
          formData.applicationDeadline,
      };

      const response = await createJob(jobData);

      setSuccess(
        response.data?.message ||
          "Job posted successfully!"
      );

      setFormData({ ...initialForm });

      // Redirect after successful job creation
      navigate("/recruiter/dashboard", {
        replace: true,
        state: {
          message:
            response.data?.message ||
            "Job posted successfully!",
        },
      });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to post job. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100";

  const labelClass =
    "mb-2 block text-sm font-semibold text-slate-700";

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10 sm:px-8">
      <div className="mx-auto max-w-4xl">
        <button
          type="button"
          onClick={() =>
            navigate("/recruiter/dashboard")
          }
          className="mb-6 text-sm font-semibold text-blue-600 hover:text-blue-800"
        >
          ← Back to dashboard
        </button>

        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/50">
          <div className="bg-linear-to-r from-blue-700 to-indigo-700 px-6 py-8 text-white sm:px-10">
            <p className="text-sm font-semibold uppercase tracking-widest text-blue-100">
              Recruiter workspace
            </p>

            <h1 className="mt-2 text-3xl font-bold">
              Post a New Job
            </h1>

            <p className="mt-2 text-sm text-blue-100">
              Share an opportunity with talented students.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-6 p-6 sm:p-10"
          >
            {error && (
              <div
                role="alert"
                className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
              >
                {error}
              </div>
            )}

            {success && (
              <div
                role="status"
                className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700"
              >
                {success}
              </div>
            )}

            {/* Job Title */}
            <div>
              <label
                className={labelClass}
                htmlFor="title"
              >
                Job Title *
              </label>

              <input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Frontend Developer Intern"
                className={inputClass}
                required
              />
            </div>

            {/* Description */}
            <div>
              <label
                className={labelClass}
                htmlFor="description"
              >
                Job Description *
              </label>

              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the role, responsibilities and requirements..."
                rows={5}
                className={inputClass}
                required
              />
            </div>

            {/* Skills */}
            <div>
              <label
                className={labelClass}
                htmlFor="skills"
              >
                Required Skills *
              </label>

              <input
                id="skills"
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                placeholder="React, JavaScript, HTML, CSS"
                className={inputClass}
                required
              />

              <p className="mt-2 text-xs text-slate-500">
                Enter skills separated by commas.
              </p>
            </div>

            {/* Experience */}
            <div>
              <label
                className={labelClass}
                htmlFor="experience"
              >
                Experience *
              </label>

              <select
                id="experience"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                className={inputClass}
                required
              >
                <option value="">
                  Select experience
                </option>
                <option value="Fresher">Fresher</option>
                <option value="0-1 years">
                  0–1 years
                </option>
                <option value="1-2 years">
                  1–2 years
                </option>
                <option value="2+ years">
                  2+ years
                </option>
              </select>
            </div>

            {/* Location */}
            <div>
              <label
                className={labelClass}
                htmlFor="location"
              >
                Location *
              </label>

              <input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. Noida, Delhi"
                className={inputClass}
                required
              />
            </div>

            {/* Work Mode and Job Type */}
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label
                  className={labelClass}
                  htmlFor="workMode"
                >
                  Work Mode *
                </label>

                <select
                  id="workMode"
                  name="workMode"
                  value={formData.workMode}
                  onChange={handleChange}
                  className={inputClass}
                  required
                >
                  <option value="">
                    Select work mode
                  </option>
                  <option value="remote">Remote</option>
                  <option value="onsite">Onsite</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </div>

              <div>
                <label
                  className={labelClass}
                  htmlFor="jobType"
                >
                  Job Type *
                </label>

                <select
                  id="jobType"
                  name="jobType"
                  value={formData.jobType}
                  onChange={handleChange}
                  className={inputClass}
                  required
                >
                  <option value="">
                    Select job type
                  </option>
                  <option value="internship">
                    Internship
                  </option>
                  <option value="full-time">
                    Full-time
                  </option>
                  <option value="part-time">
                    Part-time
                  </option>
                </select>
              </div>
            </div>

            {/* Salary */}
            <div>
              <label className={labelClass}>
                Minimum / Maximum Salary or Stipend
              </label>

              <div className="grid gap-6 sm:grid-cols-2">
                <input
                  type="number"
                  name="salaryMin"
                  value={formData.salaryMin}
                  onChange={handleChange}
                  placeholder="Minimum amount"
                  min="0"
                  className={inputClass}
                />

                <input
                  type="number"
                  name="salaryMax"
                  value={formData.salaryMax}
                  onChange={handleChange}
                  placeholder="Maximum amount"
                  min="0"
                  className={inputClass}
                />
              </div>
            </div>

            {/* Application Deadline */}
            <div>
              <label
                className={labelClass}
                htmlFor="applicationDeadline"
              >
                Application Deadline *
              </label>

              <input
                id="applicationDeadline"
                type="date"
                name="applicationDeadline"
                value={formData.applicationDeadline}
                onChange={handleChange}
                min={(() => {
                  const today = new Date();
                  const year = today.getFullYear();
                  const month = String(
                    today.getMonth() + 1
                  ).padStart(2, "0");
                  const day = String(
                    today.getDate()
                  ).padStart(2, "0");

                  return `${year}-${month}-${day}`;
                })()}
                className={inputClass}
                required
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full rounded-xl bg-blue-600 px-6 py-4 font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving
                ? "Publishing job..."
                : "Publish Job"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PostJob;