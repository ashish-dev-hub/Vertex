 
import React, { useEffect, useState, useMemo } from "react";
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
  CheckCircle2,
  XCircle,
  Clock3,
  Filter,
  Award,
  Star,
  ShieldCheck,
  Menu,
} from "lucide-react";

import {
  getMyJobs,
  getJobById,
  updateJob,
  updateJobStatus,
  deleteJob,
} from "../api/jobs";
import {
  getAllApplicants,
  updateApplicationStatus,
} from "../api/applications";
import { useToast } from "../context/ToastContext";
import RecruiterFinalMatchModal from "../components/recruiter/RecruiterFinalMatchModal";

const inputClass =
  "w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

const RecruiterDashboard = () => {
  const navigate = useNavigate();
  const { showSuccess, showError, confirm } = useToast();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedJob, setSelectedJob] = useState(null);
  const [editJobId, setEditJobId] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [applicants, setApplicants] = useState([]);
  const [applicantsLoading, setApplicantsLoading] = useState(false);
  const [applicantJobFilter, setApplicantJobFilter] = useState("all");
  const [applicantStatusFilter, setApplicantStatusFilter] = useState("all");
  const [updatingStatusId, setUpdatingStatusId] = useState(null);
  const [evaluatingApplicant, setEvaluatingApplicant] = useState(null);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

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

  // GET: Fetch this recruiter's own posted jobs
  const loadJobs = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getMyJobs();
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

  // GET: Fetch all applicants for recruiter
  const loadApplicants = async () => {
    try {
      setApplicantsLoading(true);
      const response = await getAllApplicants();
      const data = response.data;
      const appList = Array.isArray(data.applications)
        ? data.applications
        : Array.isArray(data)
        ? data
        : [];
      setApplicants(appList);
    } catch (err) {
      console.error("GET applicants error:", err);
      if (err.response?.status === 403) {
        showError(
          "Your account does not have Recruiter permissions to view all candidates. Please log in as a Recruiter.",
          "Access Denied"
        );
      } else if (err.response?.status === 401) {
        showWarning("Please log in to view candidate details.", "Session Expired");
      }
    } finally {
      setApplicantsLoading(false);
    }
  };

  const refreshAll = () => {
    loadJobs();
    loadApplicants();
  };

  useEffect(() => {
    loadJobs();
    loadApplicants();
  }, []);

  const totalApplicants = useMemo(() => {
    if (applicants.length > 0) return applicants.length;
    return jobs.reduce(
      (total, job) =>
        total +
        Number(job.applicantsCount || job.applicants?.length || 0),
      0
    );
  }, [applicants, jobs]);

  // Scope candidates by currently selected job filter
  const jobScopedApplicants = useMemo(() => {
    if (applicantJobFilter === "all") return applicants;
    return applicants.filter((app) => {
      const jId =
        app.job?._id ||
        (typeof app.job === "string" ? app.job : "") ||
        app.jobId ||
        "";
      return String(jId) === String(applicantJobFilter);
    });
  }, [applicants, applicantJobFilter]);

  const shortlistedCount = useMemo(() => {
    return jobScopedApplicants.filter(
      (a) => String(a.status).toLowerCase() === "shortlisted"
    ).length;
  }, [jobScopedApplicants]);

  const pendingCount = useMemo(() => {
    return jobScopedApplicants.filter((a) => {
      const st = String(a.status || "pending").toLowerCase();
      return st === "pending" || st === "applied";
    }).length;
  }, [jobScopedApplicants]);

  const acceptedCount = useMemo(() => {
    return jobScopedApplicants.filter(
      (a) => String(a.status).toLowerCase() === "accepted"
    ).length;
  }, [jobScopedApplicants]);

  const rejectedCount = useMemo(() => {
    return jobScopedApplicants.filter(
      (a) => String(a.status).toLowerCase() === "rejected"
    ).length;
  }, [jobScopedApplicants]);

  const filteredApplicants = useMemo(() => {
    return jobScopedApplicants.filter((app) => {
      const appStatus = String(app.status || "pending").toLowerCase();
      const matchesStatus =
        applicantStatusFilter === "all" ||
        (applicantStatusFilter === "pending" &&
          (appStatus === "pending" || appStatus === "applied")) ||
        appStatus === applicantStatusFilter;
      return matchesStatus;
    });
  }, [jobScopedApplicants, applicantStatusFilter]);

  const handleApplicantStatus = async (appId, newStatus, additionalData = {}) => {
    try {
      setUpdatingStatusId(appId);
      await updateApplicationStatus(appId, newStatus, additionalData);
      setApplicants((prev) =>
        prev.map((a) => (a._id === appId ? { ...a, status: newStatus, ...additionalData } : a))
      );
      showSuccess(`Application marked as ${newStatus}!`, "Status Updated");
    } catch (err) {
      showError(
        err.response?.data?.message || "Failed to update application status.",
        "Update Error"
      );
    } finally {
      setUpdatingStatusId(null);
    }
  };

  const openJobs = jobs.filter(
    (job) => job.status === "open"
  ).length;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
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
    const confirmed = await confirm({
      title: "Delete Job Listing?",
      message: "Are you sure you want to permanently delete this job post? This action cannot be undone.",
      confirmText: "Delete Job",
      cancelText: "Cancel",
      type: "danger"
    });

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

      showSuccess("Job listing deleted successfully.", "Job Deleted");
    } catch (err) {
      console.error("DELETE job error:", err);
      const errMsg =
        err.response?.data?.message ||
        err.message ||
        "Job delete nahi hui.";
      setError(errMsg);
      showError(errMsg, "Delete Failed");
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
          <div className="flex items-center gap-3">
            {/* Mobile Hamburger Menu Toggle */}
            <button
              type="button"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              aria-label="Toggle navigation menu"
              className="rounded-xl p-2 text-slate-600 hover:bg-slate-100 md:hidden transition cursor-pointer"
            >
              {showMobileMenu ? <X size={22} /> : <Menu size={22} />}
            </button>

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
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-slate-800">
                {localStorage.getItem("userName") || "Recruiter"}
              </p>
              <p className="text-xs text-slate-500">
                {localStorage.getItem("userEmail") || "Recruiter Panel"}
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

      {/* Mobile Drawer Navigation for Recruiter */}
      {showMobileMenu && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs animate-fadeIn"
            onClick={() => setShowMobileMenu(false)}
          />

          {/* Drawer content */}
          <div className="fixed inset-y-0 left-0 w-72 max-w-[85vw] bg-white p-5 shadow-2xl flex flex-col z-50 animate-fadeIn">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white font-bold">
                  <BriefcaseBusiness size={18} />
                </div>
                <span className="font-bold text-slate-900">InternMatch AI</span>
              </div>
              <button
                type="button"
                onClick={() => setShowMobileMenu(false)}
                className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Recruiter Navigation Links */}
            <div className="mt-4 flex flex-col space-y-1 overflow-y-auto">
              <a
                href="#dashboard"
                onClick={() => setShowMobileMenu(false)}
                className="flex items-center gap-3 rounded-lg bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-600"
              >
                <LayoutDashboard size={19} />
                Dashboard
              </a>

              <Link
                to="/recruiter/post-job"
                onClick={() => setShowMobileMenu(false)}
                className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-blue-600"
              >
                <PlusCircle size={19} />
                Post Job
              </Link>

              <a
                href="#jobs"
                onClick={() => setShowMobileMenu(false)}
                className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-blue-600"
              >
                <BriefcaseBusiness size={19} />
                My Jobs
              </a>

              <a
                href="#applicants"
                onClick={() => {
                  setApplicantStatusFilter("all");
                  setShowMobileMenu(false);
                }}
                className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-blue-600"
              >
                <Users size={19} />
                Applicants
                {totalApplicants > 0 && (
                  <span className="ml-auto rounded-full bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-600">
                    {totalApplicants}
                  </span>
                )}
              </a>

              <a
                href="#shortlisted"
                onClick={() => {
                  setApplicantStatusFilter("shortlisted");
                  setShowMobileMenu(false);
                }}
                className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-blue-600"
              >
                <Award size={19} className="text-amber-500" />
                Shortlisted Students
                {shortlistedCount > 0 && (
                  <span className="ml-auto rounded-full bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-700">
                    {shortlistedCount}
                  </span>
                )}
              </a>

              <Link
                to="/ml/recruiter"
                onClick={() => setShowMobileMenu(false)}
                className="flex items-center gap-3 rounded-lg bg-blue-50/80 px-4 py-3 text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
              >
                <Sparkles size={19} className="text-blue-600" />
                Vertex ML Models
              </Link>
            </div>

            <div className="mt-auto pt-4 border-t border-slate-100">
              <button
                onClick={() => {
                  setShowMobileMenu(false);
                  handleLogout();
                }}
                className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-red-500 transition hover:bg-red-50 cursor-pointer"
              >
                <LogOut size={19} />
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex min-h-[calc(100vh-64px)] items-start">
        {/* Sticky Fixed Sidebar */}
        <aside className="sticky top-16 z-30 hidden h-[calc(100vh-64px)] w-64 shrink-0 overflow-y-auto no-scrollbar border-r border-slate-200 bg-white md:block">
          <div className="flex h-full flex-col justify-between p-4">
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
                onClick={() => {
                  setApplicantStatusFilter("all");
                }}
                className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-blue-600"
              >
                <Users size={19} />
                Applicants
                {totalApplicants > 0 && (
                  <span className="ml-auto rounded-full bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-600">
                    {totalApplicants}
                  </span>
                )}
              </a>

              <a
                href="#shortlisted"
                onClick={() => {
                  setApplicantStatusFilter("shortlisted");
                }}
                className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-blue-600"
              >
                <Award size={19} className="text-amber-500" />
                Shortlisted Students
                {shortlistedCount > 0 && (
                  <span className="ml-auto rounded-full bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-700">
                    {shortlistedCount}
                  </span>
                )}
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

              <div
                onClick={() => {
                  setApplicantStatusFilter("shortlisted");
                  document.getElementById("applicants")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="cursor-pointer rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:border-orange-300 hover:shadow transition"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-orange-50">
                  <Award
                    size={22}
                    className="text-orange-600"
                  />
                </div>
                <p className="text-sm font-semibold text-orange-700">
                  Shortlisted Students
                </p>
                <p className="mt-1 text-2xl font-bold text-slate-900">
                  {applicantsLoading ? "..." : shortlistedCount}
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
                    onClick={refreshAll}
                    disabled={loading || applicantsLoading}
                    className="flex items-center justify-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 transition"
                  >
                    <RefreshCw
                      size={16}
                      className={loading || applicantsLoading ? "animate-spin text-blue-600" : ""}
                    />
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

                              <span className="inline-flex items-center gap-1.5 rounded-full border border-purple-200 bg-purple-50 px-2.5 py-1 text-xs font-semibold text-purple-700">
                                <Users size={13} />
                                {job.applicantsCount ?? 0}{" "}
                                {job.applicantsCount === 1
                                  ? "Applicant"
                                  : "Applicants"}
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
                            onClick={() => {
                              setApplicantJobFilter(String(job._id));
                              setApplicantStatusFilter("all");
                              document
                                .getElementById("applicants")
                                ?.scrollIntoView({ behavior: "smooth" });
                            }}
                            className="flex items-center gap-1.5 rounded-lg border border-purple-200 bg-purple-50 px-3 py-2 text-sm font-medium text-purple-700 hover:bg-purple-100 transition cursor-pointer"
                            title="View applicants for this job"
                          >
                            <Users size={16} />
                            Applicants ({job.applicantsCount ?? 0})
                          </button>

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

            {/* Live Applicants Section */}
            <div id="shortlisted" className="scroll-mt-24" />
            <section
              id="applicants"
              className="mt-8 rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden scroll-mt-24"
            >
              <div className="flex flex-col gap-4 border-b border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                <div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-purple-700">
                      {applicantStatusFilter === "shortlisted" ? (
                        <Award size={20} className="text-orange-600" />
                      ) : (
                        <Users size={20} />
                      )}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-slate-900">
                        {applicantStatusFilter === "shortlisted"
                          ? "Shortlisted Students"
                          : "Applicants & Candidates"}
                      </h2>
                      <p className="text-xs text-slate-500">
                        {applicantStatusFilter === "shortlisted"
                          ? "Candidate students you have shortlisted for further interviews and evaluation."
                          : "Real-time applications received for your posted jobs."}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Filter by Job */}
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-500">
                    Filter by Job:
                  </span>
                  <select
                    value={applicantJobFilter}
                    onChange={(e) => setApplicantJobFilter(e.target.value)}
                    className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 outline-none focus:border-purple-500"
                  >
                    <option value="all">
                      All Jobs ({applicants.length})
                    </option>
                    {jobs.map((j) => (
                      <option key={j._id} value={j._id}>
                        {j.title} ({j.applicantsCount ?? 0})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Status Filter Tabs */}
              <div className="flex flex-wrap items-center gap-2 bg-slate-50/70 px-5 py-3 border-b border-slate-100">
                <button
                  type="button"
                  onClick={() => setApplicantStatusFilter("all")}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition cursor-pointer ${
                    applicantStatusFilter === "all"
                      ? "bg-slate-900 text-white shadow-xs"
                      : "border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  All Candidates ({jobScopedApplicants.length})
                </button>

                <button
                  type="button"
                  onClick={() => setApplicantStatusFilter("shortlisted")}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition cursor-pointer ${
                    applicantStatusFilter === "shortlisted"
                      ? "bg-orange-600 text-white shadow-xs"
                      : "border border-orange-200 bg-orange-50 text-orange-800 hover:bg-orange-100/70"
                  }`}
                >
                  <Award size={14} />
                  Shortlisted Students ({shortlistedCount})
                </button>

                <button
                  type="button"
                  onClick={() => setApplicantStatusFilter("pending")}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition cursor-pointer ${
                    applicantStatusFilter === "pending"
                      ? "bg-blue-600 text-white shadow-xs"
                      : "border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  Under Review ({pendingCount})
                </button>

                <button
                  type="button"
                  onClick={() => setApplicantStatusFilter("accepted")}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition cursor-pointer ${
                    applicantStatusFilter === "accepted"
                      ? "bg-emerald-600 text-white shadow-xs"
                      : "border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  Accepted ({acceptedCount})
                </button>

                <button
                  type="button"
                  onClick={() => setApplicantStatusFilter("rejected")}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition cursor-pointer ${
                    applicantStatusFilter === "rejected"
                      ? "bg-rose-600 text-white shadow-xs"
                      : "border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  Not Selected ({rejectedCount})
                </button>
              </div>

              {/* Shortlisted banner if shortlisted tab is active */}
              {applicantStatusFilter === "shortlisted" && (
                <div className="bg-amber-50/80 border-b border-amber-100 px-5 py-2.5 text-xs text-amber-900 flex items-center justify-between">
                  <span className="flex items-center gap-1.5 font-semibold">
                    <Award size={15} className="text-amber-600" />
                    Viewing Shortlisted Students ({filteredApplicants.length})
                  </span>
                  <button
                    type="button"
                    onClick={() => setApplicantStatusFilter("all")}
                    className="text-amber-700 underline font-semibold hover:text-amber-900 cursor-pointer"
                  >
                    View All Applicants
                  </button>
                </div>
              )}

              {/* Applicants Content */}
              {applicantsLoading ? (
                <div className="p-12 text-center text-slate-500">
                  <RefreshCw
                    size={28}
                    className="mx-auto animate-spin text-purple-600"
                  />
                  <p className="mt-3 text-sm">Loading applicants...</p>
                </div>
              ) : filteredApplicants.length === 0 ? (
                <div className="p-12 text-center">
                  {applicantStatusFilter === "shortlisted" ? (
                    <Award size={44} className="mx-auto text-amber-300" />
                  ) : (
                    <Users size={44} className="mx-auto text-slate-300" />
                  )}
                  <h3 className="mt-3 text-base font-semibold text-slate-800">
                    {applicantStatusFilter === "shortlisted"
                      ? "No shortlisted students yet"
                      : "No applicants found"}
                  </h3>
                  <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
                    {applicantStatusFilter === "shortlisted"
                      ? "Review applicants in the 'All Candidates' or 'Under Review' tab and click 'Shortlist' to add students here."
                      : applicantJobFilter === "all"
                      ? "No candidates have applied to these jobs yet. Once a student submits an application, it will appear here instantly."
                      : "No candidates have applied for this specific job position yet."}
                  </p>
                  {applicantStatusFilter !== "all" && (
                    <button
                      type="button"
                      onClick={() => setApplicantStatusFilter("all")}
                      className="mt-3 text-xs font-bold text-blue-600 hover:underline cursor-pointer"
                    >
                      View All Candidates ({jobScopedApplicants.length})
                    </button>
                  )}
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {filteredApplicants.map((app) => {
                    const studentName =
                      app.student?.name || "Student Candidate";
                    const studentEmail =
                      app.student?.email || "candidate@internmatch.ai";
                    const jobTitle =
                      app.job?.title ||
                      jobs.find(
                        (j) =>
                          String(j._id) ===
                          String(
                            app.job?._id ||
                              (typeof app.job === "string" ? app.job : "") ||
                              app.jobId ||
                              ""
                          )
                      )?.title ||
                      "Job Role";

                    const status = String(app.status || "pending").toLowerCase();
                    const appliedDate = app.createdAt
                      ? new Date(app.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })
                      : "Recently";

                    let statusBadgeClass =
                      "bg-amber-50 text-amber-700 border-amber-200";
                    let statusLabel = "Under Review";
                    if (status === "shortlisted") {
                      statusBadgeClass =
                        "bg-blue-50 text-blue-700 border-blue-200";
                      statusLabel = "Shortlisted";
                    } else if (status === "accepted") {
                      statusBadgeClass =
                        "bg-emerald-50 text-emerald-700 border-emerald-200";
                      statusLabel = "Accepted";
                    } else if (status === "rejected") {
                      statusBadgeClass =
                        "bg-rose-50 text-rose-700 border-rose-200";
                      statusLabel = "Not Selected";
                    }

                    return (
                      <div
                        key={app._id}
                        className="p-5 transition hover:bg-slate-50/70 sm:p-6"
                      >
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                          <div className="flex items-start gap-3.5">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 font-bold text-white shadow-xs">
                              {studentName.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="flex flex-wrap items-center gap-2">
                                <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                                  {studentName}
                                </h4>
                                <span
                                  className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${statusBadgeClass}`}
                                >
                                  {statusLabel}
                                </span>

                                {app.finalMatchScore != null && (
                                  <span className="inline-flex items-center gap-1 rounded-full bg-cyan-50 border border-cyan-200 px-2 py-0.5 text-[11px] font-bold text-cyan-800">
                                    <ShieldCheck size={12} className="text-cyan-700" />
                                    Final Match: {app.finalMatchScore}% ({app.finalMatchLabel || "Evaluated"})
                                  </span>
                                )}

                                {app.fitScore != null && (
                                  <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 border border-blue-200 px-2 py-0.5 text-[11px] font-semibold text-blue-700">
                                    Candidate Fit: {app.fitScore}%
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-slate-500 mt-0.5">
                                {studentEmail} · Applied for{" "}
                                <span className="font-semibold text-slate-800">
                                  {jobTitle}
                                </span>
                              </p>
                              <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-400">
                                <span className="flex items-center gap-1">
                                  <Clock3 size={13} />
                                  Applied on {appliedDate}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex flex-wrap items-center gap-2 sm:self-center">
                            {/* Run Final Match Evaluation Button */}
                            <button
                              type="button"
                              onClick={() => setEvaluatingApplicant(app)}
                              className="flex items-center gap-1.5 rounded-lg border border-cyan-300 bg-cyan-50 px-3 py-1.5 text-xs font-bold text-cyan-800 hover:bg-cyan-100 shadow-2xs transition cursor-pointer"
                              title="Run AI Final Match Evaluation for this candidate"
                            >
                              <ShieldCheck size={14} className="text-cyan-700" />
                              Final Match AI
                            </button>
                            {status !== "shortlisted" && status !== "accepted" && (
                              <button
                                type="button"
                                disabled={updatingStatusId === app._id}
                                onClick={() =>
                                  handleApplicantStatus(app._id, "shortlisted")
                                }
                                className="flex items-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-100 disabled:opacity-50 transition cursor-pointer"
                              >
                                <CheckCircle2 size={14} />
                                Shortlist
                              </button>
                            )}

                            {status !== "accepted" && (
                              <button
                                type="button"
                                disabled={updatingStatusId === app._id}
                                onClick={() =>
                                  handleApplicantStatus(app._id, "accepted")
                                }
                                className="flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 disabled:opacity-50 transition cursor-pointer"
                              >
                                <CheckCircle2 size={14} />
                                Accept
                              </button>
                            )}

                            {status !== "rejected" && (
                              <button
                                type="button"
                                disabled={updatingStatusId === app._id}
                                onClick={() =>
                                  handleApplicantStatus(app._id, "rejected")
                                }
                                className="flex items-center gap-1.5 rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-100 disabled:opacity-50 transition cursor-pointer"
                              >
                                <XCircle size={14} />
                                Reject
                              </button>
                            )}

                            {status !== "pending" && (
                              <button
                                type="button"
                                disabled={updatingStatusId === app._id}
                                onClick={() =>
                                  handleApplicantStatus(app._id, "pending")
                                }
                                className="text-xs text-slate-400 hover:text-slate-600 underline ml-1 cursor-pointer"
                              >
                                Reset
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          </div>
        </main>
      </div>

      {/* Recruiter Final Match AI Evaluation Modal */}
      {evaluatingApplicant && (
        <RecruiterFinalMatchModal
          applicant={evaluatingApplicant}
          onClose={() => setEvaluatingApplicant(null)}
          onUpdateStatus={handleApplicantStatus}
        />
      )}
    </div>
  );
};

export default RecruiterDashboard;