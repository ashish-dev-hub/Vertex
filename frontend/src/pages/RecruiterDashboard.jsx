 
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  BriefcaseBusiness,
  LayoutDashboard,
  PlusCircle,
  Users,
  UserCircle,
  LogOut,
  MapPin,
  IndianRupee,
  Clock,
  Eye,
  Edit,
  Trash2,
  RefreshCw,
  AlertCircle,
  X,
  Save,
  Hand,
  Sparkles,
} from "lucide-react";

import {
  getJobs,
  getJobById,
  updateJob,
  updateJobStatus,
  deleteJob,
} from "../api/jobs";

const inputClass =
  "w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

const RecruiterDashboard = () => {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedJob, setSelectedJob] = useState(null);
  const [editJobId, setEditJobId] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    skills: "",
    experience: "",
    location: "",
    workMode: "remote",
    jobType: "internship",
    salaryMin: "",
    salaryMax: "",
    applicationDeadline: "",
  });

  // GET: Fetch all recruiter jobs
  const loadJobs = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getJobs();
      const data = response.data;

      const jobList = Array.isArray(data)
        ? data
        : Array.isArray(data.jobs)
        ? data.jobs
        : Array.isArray(data.data)
        ? data.data
        : [];

      setJobs(jobList);
    } catch (err) {
      console.error("GET jobs error:", err);

      setError(
        err.response?.data?.message ||
          err.message ||
          "Jobs load nahi ho paayi."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, []);

  const totalApplicants = jobs.reduce(
    (total, job) =>
      total +
      Number(job.applicantsCount || job.applicants?.length || 0),
    0
  );

  const openJobs = jobs.filter(
    (job) => job.status === "open"
  ).length;

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // GET by ID: Fetch a single job
  const handleViewJob = async (jobId) => {
    try {
      setDetailsLoading(true);
      setError("");
      setSelectedJob(null);
      setEditJobId(null);

      const response = await getJobById(jobId);
      const data = response.data;

      setSelectedJob(data.job || data.data || data);
    } catch (err) {
      console.error("GET job by ID error:", err);

      setError(
        err.response?.data?.message ||
          err.message ||
          "Job details load nahi hui."
      );
    } finally {
      setDetailsLoading(false);
    }
  };

  // GET by ID: Fetch job details before editing
  const handleEditJob = async (jobId) => {
    try {
      setDetailsLoading(true);
      setError("");
      setSelectedJob(null);
      setEditJobId(null);

      const response = await getJobById(jobId);
      const data = response.data;
      const job = data.job || data.data || data;

      setEditJobId(job._id || jobId);

      setForm({
        title: job.title || "",
        description: job.description || "",
        skills: Array.isArray(job.skills)
          ? job.skills.join(", ")
          : "",
        experience: job.experience || "",
        location: job.location || "",
        workMode: job.workMode || "remote",
        jobType: job.jobType || "internship",
        salaryMin: job.salaryMin ?? "",
        salaryMax: job.salaryMax ?? "",
        applicationDeadline: job.applicationDeadline
          ? String(job.applicationDeadline).slice(0, 10)
          : "",
      });
    } catch (err) {
      console.error("GET job for editing error:", err);

      setError(
        err.response?.data?.message ||
          err.message ||
          "Job edit details load nahi hui."
      );
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // PUT: Update job details
  const handleUpdateJob = async (event) => {
    event.preventDefault();

    if (!editJobId) return;

    try {
      setSaving(true);
      setError("");

      const jobData = {
        title: form.title.trim(),
        description: form.description.trim(),
        skills: form.skills
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean),
        experience: form.experience.trim(),
        location: form.location.trim(),
        workMode: form.workMode,
        jobType: form.jobType,
        salaryMin:
          form.salaryMin === ""
            ? undefined
            : Number(form.salaryMin),
        salaryMax:
          form.salaryMax === ""
            ? undefined
            : Number(form.salaryMax),
        applicationDeadline:
          form.applicationDeadline || undefined,
      };

      await updateJob(editJobId, jobData);

      setEditJobId(null);

      await loadJobs();
    } catch (err) {
      console.error("PUT update job error:", err);

      setError(
        err.response?.data?.message ||
          err.message ||
          "Job update nahi hui."
      );
    } finally {
      setSaving(false);
    }
  };

  // PATCH: Change job status from open to closed or vice versa
  const handleStatusChange = async (job) => {
    try {
      setError("");

      const newStatus =
        job.status === "open" ? "closed" : "open";

      await updateJobStatus(job._id, newStatus);

      setJobs((previous) =>
        previous.map((item) =>
          item._id === job._id
            ? { ...item, status: newStatus }
            : item
        )
      );

      if (selectedJob?._id === job._id) {
        setSelectedJob((previous) =>
          previous
            ? { ...previous, status: newStatus }
            : previous
        );
      }
    } catch (err) {
      console.error("PATCH job status error:", err);

      setError(
        err.response?.data?.message ||
          err.message ||
          "Job status update nahi hua."
      );
    }
  };

  // DELETE: Remove a job
  const handleDeleteJob = async (jobId) => {
    const confirmed = window.confirm(
      "Kya aap sach mein ye job delete karna chahte hain?"
    );

    if (!confirmed) return;

    try {
      setError("");

      await deleteJob(jobId);

      setJobs((previous) =>
        previous.filter((job) => job._id !== jobId)
      );

      if (selectedJob?._id === jobId) {
        setSelectedJob(null);
      }

      if (editJobId === jobId) {
        setEditJobId(null);
      }
    } catch (err) {
      console.error("DELETE job error:", err);

      setError(
        err.response?.data?.message ||
          err.message ||
          "Job delete nahi hui."
      );
    }
  };

  const closePanels = () => {
    setSelectedJob(null);
    setEditJobId(null);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navbar */}
      <nav className="sticky top-0 z-40 border-b border-slate-200 bg-white">
        <div className="flex h-16 items-center justify-between px-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600">
              <BriefcaseBusiness
                size={20}
                className="text-white"
              />
            </div>

            <span className="text-xl font-bold text-slate-900">
              InternMatch{" "}
              <span className="text-blue-600">AI</span>
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-slate-800">
                Recruiter
              </p>
              <p className="text-xs text-slate-500">
                Recruiter Panel
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
              <UserCircle
                size={24}
                className="text-blue-600"
              />
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden min-h-[calc(100vh-64px)] w-64 border-r border-slate-200 bg-white md:block">
          <div className="flex h-full flex-col p-4">
            <div className="space-y-2">
              <a
                href="#dashboard"
                className="flex items-center gap-3 rounded-lg bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-600"
              >
                <LayoutDashboard size={19} />
                Dashboard
              </a>

              <Link
                to="/recruiter/post-job"
                className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-blue-600"
              >
                <PlusCircle size={19} />
                Post Job
              </Link>

              <a
                href="#jobs"
                className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-blue-600"
              >
                <BriefcaseBusiness size={19} />
                My Jobs
              </a>

              <a
                href="#applicants"
                className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-blue-600"
              >
                <Users size={19} />
                Applicants
              </a>

              <Link
                to="/ml/recruiter"
                className="flex items-center gap-3 rounded-lg bg-blue-50/80 px-4 py-3 text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
              >
                <Sparkles size={19} className="text-blue-600" />
                Vertex ML Models
              </Link>
            </div>

            <button
              onClick={handleLogout}
              className="mt-auto flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-red-500 transition hover:bg-red-50"
            >
              <LogOut size={19} />
              Logout
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main
          id="dashboard"
          className="min-w-0 flex-1 p-4 sm:p-8"
        >
          <div className="mx-auto max-w-7xl">
            {/* Dashboard Header */}
            <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <p className="mb-1 text-sm font-medium text-blue-600">
                  Recruiter Panel
                </p>

                <h1 className="flex flex-wrap items-center gap-2 text-2xl font-bold text-slate-900 sm:text-3xl">
                  Welcome back, Recruiter
                  <Hand
                    size={27}
                    className="text-yellow-500"
                  />
                </h1>

                <p className="mt-2 text-slate-500">
                  Manage your jobs and review potential
                  candidates.
                </p>
              </div>

              <Link
                to="/recruiter/post-job"
                className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
              >
                <PlusCircle size={19} />
                Post New Job
              </Link>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                <AlertCircle
                  size={20}
                  className="shrink-0"
                />

                <div className="flex-1">
                  <p className="font-semibold">
                    Something went wrong
                  </p>
                  <p className="mt-1">{error}</p>
                </div>

                <button
                  onClick={() => setError("")}
                  aria-label="Dismiss error"
                  className="rounded p-1 hover:bg-red-100"
                >
                  <X size={16} />
                </button>
              </div>
            )}

            {/* Stats */}
            <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50">
                  <BriefcaseBusiness
                    size={22}
                    className="text-blue-600"
                  />
                </div>
                <p className="text-sm text-slate-500">
                  Total Jobs
                </p>
                <p className="mt-1 text-2xl font-bold text-slate-900">
                  {loading ? "..." : jobs.length}
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-purple-50">
                  <Users
                    size={22}
                    className="text-purple-600"
                  />
                </div>
                <p className="text-sm text-slate-500">
                  Total Applicants
                </p>
                <p className="mt-1 text-2xl font-bold text-slate-900">
                  {loading ? "..." : totalApplicants}
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-green-50">
                  <BriefcaseBusiness
                    size={22}
                    className="text-green-600"
                  />
                </div>
                <p className="text-sm text-slate-500">
                  Open Jobs
                </p>
                <p className="mt-1 text-2xl font-bold text-slate-900">
                  {loading ? "..." : openJobs}
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-orange-50">
                  <Users
                    size={22}
                    className="text-orange-600"
                  />
                </div>
                <p className="text-sm text-slate-500">
                  Shortlisted
                </p>
                <p className="mt-1 text-2xl font-bold text-slate-900">
                  0
                </p>
              </div>
            </div>

            {/* Loading Details */}
            {detailsLoading && (
              <div className="mb-6 rounded-xl border border-slate-200 bg-white p-6 text-slate-600">
                <RefreshCw
                  size={20}
                  className="mr-2 inline animate-spin"
                />
                Loading job details...
              </div>
            )}

            {/* View Job Details */}
            {selectedJob && (
              <section className="mb-8 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-blue-600">
                      Job Details — GET by ID
                    </p>
                    <h2 className="mt-1 text-xl font-bold text-slate-900">
                      {selectedJob.title}
                    </h2>
                  </div>

                  <button
                    onClick={closePanels}
                    className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
                    aria-label="Close details"
                  >
                    <X size={20} />
                  </button>
                </div>

                <p className="whitespace-pre-wrap text-slate-600">
                  {selectedJob.description ||
                    "No description provided."}
                </p>

                <div className="mt-4 grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
                  <p>
                    <strong>Location:</strong>{" "}
                    {selectedJob.location || "Not specified"}
                  </p>
                  <p>
                    <strong>Work Mode:</strong>{" "}
                    {selectedJob.workMode || "Not specified"}
                  </p>
                  <p>
                    <strong>Job Type:</strong>{" "}
                    {selectedJob.jobType || "Not specified"}
                  </p>
                  <p>
                    <strong>Experience:</strong>{" "}
                    {selectedJob.experience || "Not specified"}
                  </p>
                  <p>
                    <strong>Salary:</strong>{" "}
                    {selectedJob.salaryMin ?? "—"} –{" "}
                    {selectedJob.salaryMax ?? "—"}
                  </p>
                  <p>
                    <strong>Status:</strong>{" "}
                    {selectedJob.status || "open"}
                  </p>
                  <p className="sm:col-span-2">
                    <strong>Skills:</strong>{" "}
                    {Array.isArray(selectedJob.skills)
                      ? selectedJob.skills.join(", ")
                      : "Not specified"}
                  </p>
                </div>
              </section>
            )}

            {/* Edit Job Form */}
            {editJobId && (
              <section className="mb-8 rounded-xl border border-blue-200 bg-white p-5 shadow-sm sm:p-6">
                <div className="mb-5 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-blue-600">
                      PUT — Update Job
                    </p>
                    <h2 className="text-xl font-bold text-slate-900">
                      Edit Job
                    </h2>
                  </div>

                  <button
                    onClick={closePanels}
                    className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
                    aria-label="Cancel editing"
                  >
                    <X size={20} />
                  </button>
                </div>

                <form
                  onSubmit={handleUpdateJob}
                  className="space-y-4"
                >
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="block">
                      <span className="mb-1.5 block text-sm font-medium text-slate-700">
                        Job Title
                      </span>
                      <input
                        required
                        name="title"
                        value={form.title}
                        onChange={handleFormChange}
                        className={inputClass}
                      />
                    </label>

                    <label className="block">
                      <span className="mb-1.5 block text-sm font-medium text-slate-700">
                        Location
                      </span>
                      <input
                        required
                        name="location"
                        value={form.location}
                        onChange={handleFormChange}
                        className={inputClass}
                      />
                    </label>

                    <label className="block">
                      <span className="mb-1.5 block text-sm font-medium text-slate-700">
                        Job Type
                      </span>
                      <select
                        name="jobType"
                        value={form.jobType}
                        onChange={handleFormChange}
                        className={inputClass}
                      >
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
                    </label>

                    <label className="block">
                      <span className="mb-1.5 block text-sm font-medium text-slate-700">
                        Work Mode
                      </span>
                      <select
                        name="workMode"
                        value={form.workMode}
                        onChange={handleFormChange}
                        className={inputClass}
                      >
                        <option value="remote">Remote</option>
                        <option value="onsite">Onsite</option>
                        <option value="hybrid">Hybrid</option>
                      </select>
                    </label>

                    <label className="block">
                      <span className="mb-1.5 block text-sm font-medium text-slate-700">
                        Minimum Salary
                      </span>
                      <input
                        type="number"
                        min="0"
                        name="salaryMin"
                        value={form.salaryMin}
                        onChange={handleFormChange}
                        className={inputClass}
                      />
                    </label>

                    <label className="block">
                      <span className="mb-1.5 block text-sm font-medium text-slate-700">
                        Maximum Salary
                      </span>
                      <input
                        type="number"
                        min="0"
                        name="salaryMax"
                        value={form.salaryMax}
                        onChange={handleFormChange}
                        className={inputClass}
                      />
                    </label>

                    <label className="block">
                      <span className="mb-1.5 block text-sm font-medium text-slate-700">
                        Experience
                      </span>
                      <input
                        name="experience"
                        value={form.experience}
                        onChange={handleFormChange}
                        placeholder="Fresher / 0-1 years"
                        className={inputClass}
                      />
                    </label>

                    <label className="block">
                      <span className="mb-1.5 block text-sm font-medium text-slate-700">
                        Application Deadline
                      </span>
                      <input
                        type="date"
                        name="applicationDeadline"
                        value={form.applicationDeadline}
                        onChange={handleFormChange}
                        className={inputClass}
                      />
                    </label>
                  </div>

                  <label className="block">
                    <span className="mb-1.5 block text-sm font-medium text-slate-700">
                      Skills (comma separated)
                    </span>
                    <input
                      name="skills"
                      value={form.skills}
                      onChange={handleFormChange}
                      placeholder="React, JavaScript, Node.js"
                      className={inputClass}
                    />
                  </label>

                  <label className="block">
                    <span className="mb-1.5 block text-sm font-medium text-slate-700">
                      Description
                    </span>
                    <textarea
                      required
                      rows={4}
                      name="description"
                      value={form.description}
                      onChange={handleFormChange}
                      className={inputClass}
                    />
                  </label>

                  <div className="flex flex-wrap gap-3">
                    <button
                      type="submit"
                      disabled={saving}
                      className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
                    >
                      <Save size={17} />
                      {saving ? "Saving..." : "Save Changes"}
                    </button>

                    <button
                      type="button"
                      onClick={closePanels}
                      className="rounded-lg border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </section>
            )}

            {/* My Jobs */}
            <section
              id="jobs"
              className="rounded-xl border border-slate-200 bg-white shadow-sm"
            >
              <div className="flex flex-col justify-between gap-3 border-b border-slate-200 p-5 sm:flex-row sm:items-center sm:p-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    My Jobs
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Manage the internships and jobs you have posted.
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={loadJobs}
                    disabled={loading}
                    className="flex items-center justify-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                  >
                    <RefreshCw size={16} />
                    Refresh
                  </button>

                  <Link
                    to="/recruiter/post-job"
                    className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                  >
                    <PlusCircle size={17} />
                    Add Job
                  </Link>
                </div>
              </div>

              {loading ? (
                <div className="p-12 text-center text-slate-500">
                  <RefreshCw
                    size={30}
                    className="mx-auto animate-spin text-blue-600"
                  />
                  <p className="mt-4">Loading your jobs...</p>
                </div>
              ) : jobs.length === 0 ? (
                <div className="p-10 text-center">
                  <BriefcaseBusiness
                    size={45}
                    className="mx-auto text-slate-300"
                  />
                  <h3 className="mt-4 text-lg font-semibold text-slate-800">
                    No jobs posted yet
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Agar jobs pehle se post ki hain, Refresh
                    dabao aur backend GET /api/jobs response check karo.
                  </p>
                  <Link
                    to="/recruiter/post-job"
                    className="mt-5 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
                  >
                    <PlusCircle size={18} />
                    Post Job
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-slate-200">
                  {jobs.map((job) => (
                    <div
                      key={job._id}
                      className="p-5 transition hover:bg-slate-50 sm:p-6"
                    >
                      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex min-w-0 gap-4">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-blue-50">
                            <BriefcaseBusiness
                              size={23}
                              className="text-blue-600"
                            />
                          </div>

                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="font-semibold text-slate-900">
                                {job.title || "Untitled job"}
                              </h3>

                              <span
                                className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                                  job.status === "open"
                                    ? "bg-green-100 text-green-700"
                                    : "bg-slate-100 text-slate-600"
                                }`}
                              >
                                {job.status || "open"}
                              </span>
                            </div>

                            <p className="mt-1 text-sm text-slate-600">
                              {job.jobType || "Job"} ·{" "}
                              {job.workMode || "Work mode not specified"}
                            </p>

                            <div className="mt-3 flex flex-wrap gap-4 text-sm text-slate-500">
                              <span className="flex items-center gap-1.5">
                                <MapPin size={15} />
                                {job.location || "Not specified"}
                              </span>

                              <span className="flex items-center gap-1.5">
                                <IndianRupee size={15} />
                                {job.salaryMin != null ||
                                job.salaryMax != null
                                  ? `${job.salaryMin ?? "—"} – ${job.salaryMax ?? "—"}`
                                  : "Not specified"}
                              </span>

                              <span className="flex items-center gap-1.5">
                                <Clock size={15} />
                                {job.experience ||
                                  "Experience not specified"}
                              </span>
                            </div>

                            {Array.isArray(job.skills) &&
                              job.skills.length > 0 && (
                                <div className="mt-3 flex flex-wrap gap-2">
                                  {job.skills.map((skill, index) => (
                                    <span
                                      key={`${skill}-${index}`}
                                      className="rounded-md bg-blue-50 px-2 py-1 text-xs text-blue-700"
                                    >
                                      {skill}
                                    </span>
                                  ))}
                                </div>
                              )}
                          </div>
                        </div>

                        {/* Job Actions */}
                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            onClick={() => handleViewJob(job._id)}
                            className="flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                          >
                            <Eye size={16} />
                            View
                          </button>

                          <button
                            onClick={() => handleEditJob(job._id)}
                            className="flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                          >
                            <Edit size={16} />
                            Edit
                          </button>

                          <button
                            onClick={() => handleStatusChange(job)}
                            className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                          >
                            {job.status === "open"
                              ? "Close Job"
                              : "Reopen"}
                          </button>

                          <button
                            onClick={() => handleDeleteJob(job._id)}
                            className="flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                          >
                            <Trash2 size={16} />
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* AI Insights */}
            <section
              id="applicants"
              className="mt-8 rounded-xl border border-blue-100 bg-blue-50 p-6"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-blue-600">
                  <Users size={21} className="text-white" />
                </div>

                <div>
                  <h2 className="font-bold text-slate-900">
                    AI Candidate Insights
                  </h2>
                  <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-600">
                    Candidate-role fit scores and applicant
                    insights can be displayed here after the ML
                    model is connected.
                  </p>
                  <p className="mt-3 text-xs font-medium text-blue-700">
                    ML integration can be added separately.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
};

export default RecruiterDashboard;