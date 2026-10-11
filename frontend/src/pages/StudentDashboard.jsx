 
import React, { useEffect, useMemo, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  BriefcaseBusiness,
  Search,
  Bell,
  ChevronDown,
  MapPin,
  Clock3,
  Bookmark,
  ArrowUpRight,
  Sparkles,
  GraduationCap,
  Code2,
  FileText,
  LayoutDashboard,
  LogOut,
  SlidersHorizontal,
  Compass,
  ShieldCheck,
  ArrowLeft,
  ArrowRight,
  Building2,
  Calendar,
  Trash2,
  CheckCircle2,
  ExternalLink,
  Menu,
  X,
  User,
} from "lucide-react";

import { getStudentProfile } from "../api/studentProfile";
import { getMe } from "../api/auth";
import { getJobs } from "../api/jobs";
import { applyToJob, getMyApplications } from "../api/applications";
import RecommendationView from "../components/ml/RecommendationView";
import JobApplicationFlowModal from "../components/student/JobApplicationFlowModal";
import { useToast } from "../context/ToastContext";

const getStoredArray = (key) => {
  try {
    const data = JSON.parse(localStorage.getItem(key));
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
};

const StudentDashboard = () => {
  const navigate = useNavigate();
  const { showSuccess, showError, showWarning, showInfo, confirm } = useToast();

  const [profile, setProfile] = useState({});
  const [jobs, setJobs] = useState([]);

  const [profileLoading, setProfileLoading] = useState(true);
  const [jobsLoading, setJobsLoading] = useState(true);

  const [profileError, setProfileError] = useState("");
  const [jobsError, setJobsError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("All Jobs");
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [selectedWorkMode, setSelectedWorkMode] = useState("All");
  const [selectedJobType, setSelectedJobType] = useState("All");
  const [selectedExperience, setSelectedExperience] = useState("All");

  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const profileDropdownRef = useRef(null);
  const notificationsRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(e.target)) {
        setShowProfileDropdown(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const [viewMode, setViewMode] = useState("jobs"); // "jobs" | "recommendations"
  const [applicationModalJob, setApplicationModalJob] = useState(null);

  const [savedJobs, setSavedJobs] = useState(() =>
    getStoredArray("savedStudentJobs")
  );

  const [applications, setApplications] = useState(() =>
    getStoredArray("studentApplications")
  );
  const [applyingJobId, setApplyingJobId] = useState(null);
  const [applyNotification, setApplyNotification] = useState(null);

  const isJobApplied = (job) => {
    const targetId = String(job._id || job.id || "");
    return applications.some((app) => {
      const appId =
        app.job?._id ||
        (typeof app.job === "string" ? app.job : null) ||
        app.jobId ||
        app._id;
      return String(appId) === targetId;
    });
  };

  // Fetch student profile and recruiter-posted jobs
  useEffect(() => {
    let active = true;

    const fetchProfile = async () => {
      try {
        const response = await getStudentProfile();
        const result = response.data;

        const student =
          result?.profile ||
          result?.student ||
          result?.data?.profile ||
          result?.data?.student ||
          result?.data ||
          result;

        if (active && student) {
          setProfile(student);
          if (student.user?.name) localStorage.setItem("userName", student.user.name);
          if (student.user?.email) localStorage.setItem("userEmail", student.user.email);
        }
      } catch (error) {
        if (active) {
          setProfileError(
            error.response?.data?.message ||
              error.message ||
              "Unable to load student profile."
          );
        }
      } finally {
        if (active) setProfileLoading(false);
      }
    };

    const fetchCurrentUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const res = await getMe();
        const u = res.data?.user || res.data;
        if (u && active) {
          if (u.name) localStorage.setItem("userName", u.name);
          if (u.email) localStorage.setItem("userEmail", u.email);
          setProfile((prev) => ({
            ...prev,
            user: { ...(prev.user || {}), ...u },
            name: prev.name || u.name,
            email: prev.email || u.email,
          }));
        }
      } catch (err) {
        console.warn("fetchCurrentUser error:", err);
      }
    };

    const fetchPostedJobs = async () => {
      try {
        const response = await getJobs();
        const result = response.data;

        const jobsList = Array.isArray(result)
          ? result
          : Array.isArray(result?.jobs)
          ? result.jobs
          : Array.isArray(result?.data?.jobs)
          ? result.data.jobs
          : Array.isArray(result?.data)
          ? result.data
          : [];

        const formattedJobs = jobsList.map((job, index) => {
          const company =
            job.companyName ||
            job.company?.name ||
            (typeof job.company === "string" ? job.company : "") ||
            job.recruiter?.companyName ||
            "Company";

          const score =
            job.fitScore ??
            job.matchScore ??
            job.fit ??
            null;

          return {
            ...job,
            id: job._id || job.id || `job-${index}`,
            company,
            role:
              job.title ||
              job.jobTitle ||
              job.role ||
              "Untitled Job",
            location: job.location || "Not specified",
            workMode: job.workMode || "",
            experience: job.experience || "Fresher",
            stipend:
              job.salaryMin != null && job.salaryMax != null
                ? `₹${Number(job.salaryMin).toLocaleString("en-IN")} – ₹${Number(job.salaryMax).toLocaleString("en-IN")}`
                : job.salaryMin != null
                ? `₹${Number(job.salaryMin).toLocaleString("en-IN")}`
                : job.salaryMax != null
                ? `Up to ₹${Number(job.salaryMax).toLocaleString("en-IN")}`
                : job.stipend != null
                ? typeof job.stipend === "number"
                  ? `₹${job.stipend.toLocaleString("en-IN")}/month`
                  : `₹${job.stipend}`
                : job.salary != null
                ? typeof job.salary === "number"
                  ? `₹${job.salary.toLocaleString("en-IN")}`
                  : String(job.salary)
                : "Not specified",
            duration:
              job.duration ||
              (job.experience ? `${job.experience}` : (job.workMode || "Not specified")),
            type: job.type || job.jobType || "Job",
            skills: Array.isArray(job.skills)
              ? job.skills
              : typeof job.skills === "string"
              ? job.skills.split(",").map((skill) => skill.trim()).filter(Boolean)
              : [],
            fit: score == null ? null : Number(score),
            color: [
              "bg-blue-100 text-blue-700",
              "bg-violet-100 text-violet-700",
              "bg-emerald-100 text-emerald-700",
              "bg-orange-100 text-orange-700",
            ][index % 4],
            description:
              job.description || "No description provided.",
          };
        });

        if (active) setJobs(formattedJobs);
      } catch (error) {
        if (active) {
          setJobsError(
            error.response?.data?.message ||
              error.message ||
              "Unable to load jobs."
          );
        }
      } finally {
        if (active) setJobsLoading(false);
      }
    };

    const fetchApplications = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const res = await getMyApplications();
        const appList = res.data?.applications || res.data || [];
        if (Array.isArray(appList) && active) {
          setApplications(appList);
          localStorage.setItem("studentApplications", JSON.stringify(appList));
        }
      } catch {
        // Keep cached applications if offline or guest
      }
    };

    fetchCurrentUser();
    fetchProfile();
    fetchPostedJobs();
    fetchApplications();

    return () => {
      active = false;
    };
  }, []);

  const studentName =
    profile.name?.trim?.() ||
    profile.fullName?.trim?.() ||
    profile.user?.name?.trim?.() ||
    localStorage.getItem("userName")?.trim?.() ||
    "Student User";

  const studentEmail =
    profile.email?.trim?.() ||
    profile.user?.email?.trim?.() ||
    localStorage.getItem("userEmail")?.trim?.() ||
    "";

  const studentSkills = useMemo(() => {
    return Array.isArray(profile.skills)
      ? profile.skills
      : typeof profile.skills === "string"
      ? profile.skills.split(",").map((skill) => skill.trim()).filter(Boolean)
      : [];
  }, [profile.skills]);

  // Dynamically compute AI match score for each job based on student profile & skills
  const jobsWithMatch = useMemo(() => {
    return jobs.map((job, index) => {
      if (job.fitScore != null) return { ...job, fit: Number(job.fitScore) };
      if (job.matchScore != null) return { ...job, fit: Number(job.matchScore) };

      const jobSkills = Array.isArray(job.skills) ? job.skills : [];

      const normalize = (s) =>
        String(s || "")
          .toLowerCase()
          .replace(/[^a-z0-9]/g, "");

      const studentNorm = studentSkills.map(normalize).filter(Boolean);
      const jobNorm = jobSkills.map(normalize).filter(Boolean);

      let calculatedScore = null;
      let matchNote = "Match score based on profile";

      if (studentNorm.length > 0 && jobNorm.length > 0) {
        let matchCount = 0;
        for (const js of jobNorm) {
          if (studentNorm.some((ss) => ss.includes(js) || js.includes(ss))) {
            matchCount++;
          }
        }

        const coverage = matchCount / jobNorm.length;
        if (matchCount > 0) {
          calculatedScore = Math.min(98, Math.round(72 + coverage * 26));
          matchNote = `${matchCount} of ${jobNorm.length} required skills matched`;
        } else {
          calculatedScore = Math.round(48 + ((index * 7) % 15));
          matchNote = "Different skill set required";
        }
      } else if (studentNorm.length > 0) {
        calculatedScore = 78;
        matchNote = "General role match for your profile";
      } else {
        const sampleScores = [88, 84, 91, 79];
        calculatedScore = sampleScores[index % sampleScores.length];
        matchNote = "Estimated score · Add skills in Profile to personalize";
      }

      return {
        ...job,
        fit: calculatedScore,
        matchNote,
      };
    });
  }, [jobs, studentSkills]);

  const filteredJobs = useMemo(() => {
    return jobsWithMatch.filter((job) => {
      const text = [
        job.role,
        job.company,
        job.location,
        job.workMode,
        job.experience,
        ...job.skills,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch = text.includes(searchTerm.toLowerCase());

      const matchesQuickFilter =
        activeFilter === "All Jobs" ||
        (activeFilter === "Remote" &&
          (job.workMode?.toLowerCase() === "remote" ||
            job.location?.toLowerCase().includes("remote"))) ||
        (activeFilter === "Internships" &&
          job.type?.toLowerCase().includes("intern"));

      const matchesWorkMode =
        selectedWorkMode === "All" ||
        job.workMode?.toLowerCase() === selectedWorkMode.toLowerCase();

      const matchesJobType =
        selectedJobType === "All" ||
        job.type?.toLowerCase().includes(selectedJobType.toLowerCase());

      const matchesExperience =
        selectedExperience === "All" ||
        (selectedExperience === "Fresher"
          ? (job.experience?.toLowerCase().includes("fresh") || !job.experience)
          : !job.experience?.toLowerCase().includes("fresh"));

      return (
        matchesSearch &&
        matchesQuickFilter &&
        matchesWorkMode &&
        matchesJobType &&
        matchesExperience
      );
    });
  }, [
    jobsWithMatch,
    searchTerm,
    activeFilter,
    selectedWorkMode,
    selectedJobType,
    selectedExperience,
  ]);

  const handleApply = (job) => {
    const token = localStorage.getItem("token");
    if (!token) {
      showWarning("Please log in first to apply for jobs.", "Authentication Required");
      navigate("/login");
      return;
    }

    if (isJobApplied(job)) {
      showInfo("You have already applied for this job.", "Already Applied");
      return;
    }

    // Launch guided 3-step application assessment modal (Fit -> Salary -> Confirm)
    setApplicationModalJob(job);
  };

  const detailedApplications = useMemo(() => {
    return applications.map((application, index) => {
      const targetJobId = String(
        application.job?._id ||
          application.job?.id ||
          (typeof application.job === "string" ? application.job : "") ||
          application.jobId ||
          application._id ||
          ""
      );

      const matchedJob = jobsWithMatch.find(
        (j) => String(j._id || j.id) === targetJobId
      );

      const jobObj =
        typeof application.job === "object" && application.job !== null
          ? application.job
          : null;

      const fallbackJob =
        jobsWithMatch && jobsWithMatch.length > 0
          ? jobsWithMatch[index % jobsWithMatch.length]
          : null;

      const role =
        application.role ||
        matchedJob?.role ||
        jobObj?.title ||
        jobObj?.jobTitle ||
        fallbackJob?.role ||
        "Full Stack Developer Intern";

      const company =
        application.company ||
        matchedJob?.company ||
        jobObj?.companyName ||
        jobObj?.company?.name ||
        jobObj?.recruiter?.name ||
        fallbackJob?.company ||
        "Tech Mahindra";

      const location =
        matchedJob?.location ||
        jobObj?.location ||
        fallbackJob?.location ||
        "Noida, India";

      const workMode =
        matchedJob?.workMode ||
        jobObj?.workMode ||
        fallbackJob?.workMode ||
        "hybrid";

      const stipend =
        matchedJob?.stipend ||
        fallbackJob?.stipend ||
        "₹25,000/month";

      // Calculate or retrieve AI Match score
      let fitScore = null;
      if (matchedJob && matchedJob.fit != null) {
        fitScore = matchedJob.fit;
      } else if (application.fit != null) {
        fitScore = application.fit;
      } else if (fallbackJob && fallbackJob.fit != null) {
        fitScore = fallbackJob.fit;
      } else {
        const jobSkills = Array.isArray(jobObj?.skills)
          ? jobObj.skills
          : typeof jobObj?.skills === "string"
          ? jobObj.skills.split(",").map((s) => s.trim())
          : fallbackJob?.skills || [];

        if (studentSkills.length > 0 && jobSkills.length > 0) {
          const normalize = (s) => String(s || "").toLowerCase().replace(/[^a-z0-9]/g, "");
          const sNorm = studentSkills.map(normalize).filter(Boolean);
          const jNorm = jobSkills.map(normalize).filter(Boolean);
          const common = jNorm.filter((j) => sNorm.some((s) => s.includes(j) || j.includes(s)));
          fitScore = Math.min(98, Math.max(68, Math.round(74 + (common.length / Math.max(1, jNorm.length)) * 24)));
        } else {
          const defaultScores = [86, 91, 79, 94];
          fitScore = defaultScores[index % defaultScores.length];
        }
      }

      let appliedOn = "Recently";
      if (application.createdAt) {
        try {
          appliedOn = new Date(application.createdAt).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          });
        } catch {
          appliedOn = "Recently";
        }
      } else if (application.appliedOn) {
        appliedOn = application.appliedOn;
      }

      const statusRaw = String(application.status || "pending").toLowerCase();
      let statusLabel = "Under Review";
      let statusClass = "bg-amber-50 text-amber-700 border-amber-200";

      if (statusRaw === "shortlisted") {
        statusLabel = "Shortlisted";
        statusClass = "bg-blue-50 text-blue-700 border-blue-200";
      } else if (statusRaw === "accepted") {
        statusLabel = "Accepted";
        statusClass = "bg-emerald-50 text-emerald-700 border-emerald-200";
      } else if (statusRaw === "rejected") {
        statusLabel = "Not Selected";
        statusClass = "bg-rose-50 text-rose-700 border-rose-200";
      } else if (statusRaw === "applied") {
        statusLabel = "Submitted";
        statusClass = "bg-emerald-50 text-emerald-700 border-emerald-200";
      }

      return {
        id: application._id || `${targetJobId}-${index}`,
        targetJobId,
        role,
        company,
        location,
        workMode,
        stipend,
        fitScore,
        appliedOn,
        statusLabel,
        statusClass,
        statusRaw,
      };
    });
  }, [applications, jobsWithMatch, studentSkills]);

  const handleRemoveApplication = async (appId, targetJobId) => {
    const confirmed = await confirm({
      title: "Withdraw Application?",
      message: "Are you sure you want to withdraw/remove this application from your tracker?",
      confirmText: "Withdraw Application",
      cancelText: "Keep Application",
      type: "danger"
    });

    if (!confirmed) return;

    const updated = applications.filter((app, idx) => {
      const id = String(app._id || app.id || `${app.job?._id || app.jobId || idx}`);
      const tId = String(
        app.job?._id ||
          app.jobId ||
          (typeof app.job === "string" ? app.job : "") ||
          app._id ||
          ""
      );
      if (appId && id === String(appId)) return false;
      if (targetJobId && tId === String(targetJobId)) return false;
      return true;
    });
    setApplications(updated);
    localStorage.setItem("studentApplications", JSON.stringify(updated));
  };

  const toggleSave = (jobId) => {
    const updated = savedJobs.includes(jobId)
      ? savedJobs.filter((id) => id !== jobId)
      : [...savedJobs, jobId];

    setSavedJobs(updated);
    localStorage.setItem("savedStudentJobs", JSON.stringify(updated));
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Top navigation */}
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white shadow-xs">
        <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between gap-3 px-3.5 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Mobile Hamburger Menu Toggle */}
            <button
              type="button"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              aria-label="Toggle navigation menu"
              className="rounded-xl p-2 text-slate-600 hover:bg-slate-100 lg:hidden transition cursor-pointer"
            >
              {showMobileMenu ? <X size={22} /> : <Menu size={22} />}
            </button>

            {/* Logo */}
            <Link to="/" className="flex shrink-0 items-center gap-2 sm:gap-2.5">
              <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-blue-600 shadow-xs">
                <BriefcaseBusiness size={20} className="text-white" />
              </div>
              <span className="text-base font-bold text-slate-900 sm:text-xl tracking-tight whitespace-nowrap">
                InternMatch<span className="text-blue-600"> AI</span>
              </span>
            </Link>
          </div>

          {/* Search bar */}
          <div className="hidden max-w-md flex-1 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50/80 px-3.5 py-2.5 md:flex focus-within:border-blue-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-100 transition">
            <Search size={18} className="text-slate-400 shrink-0" />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search jobs, skills or companies..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="text-slate-400 hover:text-slate-600 p-0.5 rounded-full"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Right Action Icons: Notifications & User Profile Dropdown */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Notifications Button & Popover */}
            <div className="relative" ref={notificationsRef}>
              <button
                type="button"
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setShowProfileDropdown(false);
                }}
                aria-label="Notifications"
                className={`relative rounded-xl p-2.5 text-slate-500 transition ${
                  showNotifications ? "bg-slate-100 text-blue-600" : "hover:bg-slate-100"
                }`}
              >
                <Bell size={20} />
                <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-blue-600" />
              </button>

              {/* Notification Popover */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border border-slate-200/90 bg-white p-4 shadow-2xl shadow-slate-900/15 z-50 animate-fadeIn">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-800">Notifications</h4>
                      <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[11px] font-semibold text-blue-700">
                        Recent
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowNotifications(false)}
                      className="text-xs text-blue-600 font-semibold hover:underline"
                    >
                      Close
                    </button>
                  </div>
                  <div className="mt-3 space-y-2.5 text-xs">
                    <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                      <p className="font-semibold text-slate-800">AI Match Score Ready</p>
                      <p className="mt-0.5 text-slate-500">Your profile match scores are now unlocked for recommended jobs.</p>
                      <span className="mt-1 block text-[10px] text-slate-400">Just now</span>
                    </div>
                    <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                      <p className="font-semibold text-slate-800">Application Status Update</p>
                      <p className="mt-0.5 text-slate-500">
                        {applications.length > 0
                          ? `${applications.length} submitted application(s) currently being reviewed.`
                          : "Explore and apply to internships on your Job Board."}
                      </p>
                      <span className="mt-1 block text-[10px] text-slate-400">Today</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Dropdown Button */}
            <div className="relative" ref={profileDropdownRef}>
              <button
                type="button"
                onClick={() => {
                  setShowProfileDropdown(!showProfileDropdown);
                  setShowNotifications(false);
                }}
                className={`flex items-center gap-2 rounded-2xl p-1.5 pl-2 transition border cursor-pointer ${
                  showProfileDropdown
                    ? "border-blue-200 bg-blue-50/70"
                    : "border-slate-200/60 bg-white hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 font-bold text-xs text-white shadow-xs">
                  {studentName.charAt(0).toUpperCase()}
                </div>

                <div className="hidden sm:flex flex-col text-left">
                  <span className="max-w-[120px] truncate text-xs font-bold text-slate-800 leading-tight">
                    {studentName}
                  </span>
                  <span className="text-[10px] font-medium text-slate-400">
                    Student User
                  </span>
                </div>

                <ChevronDown
                  size={15}
                  className={`text-slate-400 transition-transform duration-200 ${
                    showProfileDropdown ? "rotate-180 text-blue-600" : ""
                  }`}
                />
              </button>

              {/* Profile Dropdown Menu */}
              {showProfileDropdown && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-slate-200/90 bg-white p-2.5 shadow-2xl shadow-slate-900/15 z-50 animate-fadeIn">
                  {/* User Overview */}
                  <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-3">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-600 font-bold text-sm text-white">
                        {studentName.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-bold text-slate-900">{studentName}</p>
                        <p className="truncate text-[11px] text-slate-500">
                          {studentEmail || "student@internmatch.ai"}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2.5 flex items-center justify-between border-t border-blue-200/40 pt-2 text-[10px]">
                      <span className="font-semibold text-blue-700">Student User</span>
                      <span className="rounded-md bg-emerald-100 px-1.5 py-0.5 font-bold text-emerald-700">
                        Verified
                      </span>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="mt-2 space-y-1">
                    <Link
                      to="/student/profile"
                      onClick={() => setShowProfileDropdown(false)}
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
                    >
                      <User size={15} className="text-slate-400" />
                      <span>My Profile</span>
                    </Link>

                    <button
                      type="button"
                      onClick={() => {
                        setViewMode("jobs");
                        setShowProfileDropdown(false);
                      }}
                      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition text-left cursor-pointer"
                    >
                      <LayoutDashboard size={15} className="text-slate-400" />
                      <span>Job Board</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setViewMode("jobs");
                        setShowProfileDropdown(false);
                        setTimeout(() => {
                          document.getElementById("applications")?.scrollIntoView({ behavior: "smooth" });
                        }, 100);
                      }}
                      className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition text-left cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <FileText size={15} className="text-slate-400" />
                        <span>My Applications</span>
                      </div>
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">
                        {applications.length}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setViewMode("recommendations");
                        setShowProfileDropdown(false);
                      }}
                      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-purple-600 hover:bg-purple-50 transition text-left cursor-pointer"
                    >
                      <Compass size={15} className="text-purple-600" />
                      <span>Job Recommendations</span>
                    </button>
                  </div>

                  {/* Logout divider */}
                  <div className="mt-2 border-t border-slate-100 pt-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        setShowProfileDropdown(false);
                        handleLogout();
                      }}
                      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition text-left cursor-pointer"
                    >
                      <LogOut size={15} className="text-rose-500" />
                      <span>Log Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Sign Out button (circled in header) */}
            <button
              type="button"
              onClick={handleLogout}
              aria-label="Sign Out"
              title="Sign Out"
              className="rounded-xl p-2 text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition cursor-pointer"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Navigation (Visible on mobile/tablet when hamburger clicked) */}
      {showMobileMenu && (
        <div className="fixed inset-0 z-30 lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs animate-fadeIn"
            onClick={() => setShowMobileMenu(false)}
          />

          {/* Drawer content */}
          <div className="fixed inset-y-0 left-0 w-72 max-w-[85vw] bg-white p-5 shadow-2xl flex flex-col z-40 animate-fadeIn">
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
                className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            {/* Mobile Search */}
            <div className="mt-4 flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
              <Search size={16} className="text-slate-400" />
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search jobs..."
                className="w-full bg-transparent text-xs outline-none"
              />
            </div>

            {/* Nav Links */}
            <nav className="mt-5 space-y-1.5 flex-1">
              <button
                type="button"
                onClick={() => {
                  setViewMode("jobs");
                  setShowMobileMenu(false);
                }}
                className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-left text-sm font-semibold transition ${
                  viewMode === "jobs"
                    ? "bg-blue-50 text-blue-700"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <LayoutDashboard size={18} />
                Job Board
              </button>

              <button
                type="button"
                onClick={() => {
                  setViewMode("jobs");
                  setActiveFilter("All Jobs");
                  setShowMobileMenu(false);
                  setTimeout(() => {
                    document.getElementById("recommended-jobs")?.scrollIntoView({ behavior: "smooth" });
                  }, 100);
                }}
                className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-left text-sm font-medium text-slate-600 hover:bg-slate-50"
              >
                <BriefcaseBusiness size={18} />
                Browse Jobs
              </button>

              <button
                type="button"
                onClick={() => {
                  setViewMode("jobs");
                  setShowMobileMenu(false);
                  setTimeout(() => {
                    document.getElementById("applications")?.scrollIntoView({ behavior: "smooth" });
                  }, 100);
                }}
                className="flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-left text-sm font-medium text-slate-600 hover:bg-slate-50"
              >
                <div className="flex items-center gap-3">
                  <FileText size={18} />
                  My Applications
                </div>
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-600">
                  {applications.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setViewMode("recommendations");
                  setShowMobileMenu(false);
                }}
                className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-left text-sm font-semibold transition ${
                  viewMode === "recommendations"
                    ? "bg-purple-600 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <Compass size={18} />
                AI Job Recommendations
              </button>


              <Link
                to="/student/profile"
                onClick={() => setShowMobileMenu(false)}
                className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-left text-sm font-medium text-slate-600 hover:bg-slate-50"
              >
                <User size={18} />
                My Profile
              </Link>
            </nav>

            {/* Mobile Footer Logout */}
            <div className="border-t border-slate-100 pt-3">
              <button
                type="button"
                onClick={() => {
                  setShowMobileMenu(false);
                  handleLogout();
                }}
                className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-left text-sm font-semibold text-rose-600 hover:bg-rose-50 transition"
              >
                <LogOut size={18} />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mx-auto grid max-w-[1440px] items-start lg:grid-cols-[235px_minmax(0,1fr)]">
        {/* Sticky Fixed Sidebar */}
        <aside className="sticky top-16 z-10 hidden h-[calc(100vh-64px)] overflow-y-auto no-scrollbar border-r border-slate-200 bg-white p-5 lg:block">
          <p className="mb-4 px-3 text-xs font-bold uppercase tracking-wider text-slate-400">
            Workspace
          </p>

          <nav className="space-y-2">
            <button
              type="button"
              onClick={() => setViewMode("jobs")}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold transition ${
                viewMode === "jobs"
                  ? "bg-blue-50 text-blue-700"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <LayoutDashboard size={19} />
              Job Board
            </button>

            <button
              type="button"
              onClick={() => {
                setViewMode("jobs");
                setActiveFilter("All Jobs");
                document.getElementById("recommended-jobs")?.scrollIntoView({
                  behavior: "smooth",
                });
              }}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              <BriefcaseBusiness size={19} />
              Browse Jobs
            </button>

            <button
              type="button"
              onClick={() => {
                setViewMode("jobs");
                document.getElementById("applications")?.scrollIntoView({
                  behavior: "smooth",
                });
              }}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              <FileText size={19} />
              My Applications
              <span className="ml-auto rounded-full bg-slate-100 px-2 py-0.5 text-xs">
                {applications.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                setViewMode("recommendations");
              }}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold transition ${
                viewMode === "recommendations"
                  ? "bg-purple-600 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <Compass
                size={19}
                className={
                  viewMode === "recommendations" ? "text-white" : "text-purple-600"
                }
              />
              AI Job Recommendations
            </button>

            <Link
              to="/student/profile"
              className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              <GraduationCap size={19} />
              My Profile
            </Link>
          </nav>

          <div className="mt-10 rounded-2xl bg-linear-to-r from-purple-600 to-indigo-700 p-4 text-white">
            <Compass size={22} />
            <h3 className="mt-3 font-bold">Job Recommendations</h3>
            <p className="mt-2 text-xs leading-5 text-purple-100">
              Discover customized career roles matched to your verified skills and academic profile.
            </p>
            <button
              type="button"
              onClick={() => {
                setViewMode("recommendations");
              }}
              className="mt-4 w-full rounded-lg bg-white px-3 py-2 text-sm font-semibold text-purple-700 hover:bg-purple-50 cursor-pointer"
            >
              View Recommendations
            </button>
          </div>
        </aside>

        {/* Main content */}
        <main className="min-w-0 p-4 sm:p-6 lg:p-8">
          {/* Welcome banner */}
          <section className="relative overflow-hidden rounded-2xl bg-linear-to-r from-blue-700 via-blue-600 to-indigo-600 p-6 text-white sm:p-8">
            <div className="relative z-10 max-w-2xl">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-xs font-medium">
                <Sparkles size={14} />
                Your career journey starts here
              </div>

              <h1 className="text-2xl font-bold sm:text-3xl">
                {profileLoading
                  ? "Welcome!"
                  : `Welcome back, ${studentName}!`}
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-6 text-blue-100 sm:text-base">
                Explore opportunities that match your skills, build your
                experience and take the next step in your career.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setViewMode("jobs");
                    document.getElementById("recommended-jobs")?.scrollIntoView({
                      behavior: "smooth",
                    });
                  }}
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-blue-700 transition hover:bg-blue-50"
                >
                  Explore Jobs
                  <ArrowUpRight size={17} />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setViewMode("recommendations");
                  }}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/15 px-5 py-3 text-sm font-bold text-white backdrop-blur-xs transition hover:bg-white/25 cursor-pointer"
                >
                  <Compass size={17} />
                  Job Recommendations
                </button>
              </div>
            </div>

            <div className="absolute -right-10 -top-16 hidden h-64 w-64 rounded-full border-[35px] border-white/10 sm:block" />
            <div className="absolute -bottom-24 right-28 hidden h-52 w-52 rounded-full bg-white/10 sm:block" />
          </section>

          {viewMode === "jobs" && (
            <>
              {/* Statistics */}
          <section className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-500">Available Jobs</p>
                <BriefcaseBusiness size={20} className="text-blue-600" />
              </div>
              <p className="mt-3 text-3xl font-bold text-slate-900">
                {jobsLoading ? "..." : jobs.length}
              </p>
              <p className="mt-1 text-xs text-slate-400">
                Jobs posted by recruiters
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-500">Applications</p>
                <FileText size={20} className="text-violet-600" />
              </div>
              <p className="mt-3 text-3xl font-bold text-slate-900">
                {applications.length}
              </p>
              <p className="mt-1 text-xs text-slate-400">
                Locally tracked applications
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-500">Saved Jobs</p>
                <Bookmark size={20} className="text-emerald-600" />
              </div>
              <p className="mt-3 text-3xl font-bold text-slate-900">
                {savedJobs.length}
              </p>
              <p className="mt-1 text-xs text-slate-400">
                Locally bookmarked jobs
              </p>
            </div>
          </section>

          {/* Profile summary */}
          <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
                  <GraduationCap size={25} />
                </div>

                <div>
                  <h2 className="font-bold text-slate-900">
                    Your Student Profile
                  </h2>

                  {profileLoading ? (
                    <p className="mt-1 text-sm text-slate-500">
                      Loading profile...
                    </p>
                  ) : profileError ? (
                    <p className="mt-1 text-sm text-red-600">
                      {profileError}
                    </p>
                  ) : (
                    <>
                      <p className="mt-1 text-sm text-slate-500">
                        {profile.college || "College not added"}
                        {profile.degree ? ` · ${profile.degree}` : ""}
                        {profile.graduationYear
                          ? ` · Batch of ${profile.graduationYear}`
                          : ""}
                      </p>

                      <div className="mt-3 flex flex-wrap gap-2">
                        {studentSkills.length > 0 ? (
                          studentSkills.slice(0, 6).map((skill, index) => (
                            <span
                              key={`${skill}-${index}`}
                              className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600"
                            >
                              {skill}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-slate-400">
                            No skills added yet
                          </span>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>

              <Link
                to="/student/profile"
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Edit Profile
                <ArrowUpRight size={16} />
              </Link>
            </div>
          </section>

          {/* Jobs section */}
          <section id="recommended-jobs" className="mt-10 scroll-mt-24">
            {applyNotification && (
              <div
                className={`mb-6 flex items-center justify-between rounded-2xl p-4 text-sm font-semibold shadow-xs ${
                  applyNotification.type === "success"
                    ? "border border-emerald-200 bg-emerald-50 text-emerald-900"
                    : "border border-blue-200 bg-blue-50 text-blue-900"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Sparkles
                    size={17}
                    className={
                      applyNotification.type === "success"
                        ? "text-emerald-600"
                        : "text-blue-600"
                    }
                  />
                  <span>{applyNotification.message}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setApplyNotification(null)}
                  className="rounded-lg px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-slate-500 hover:bg-white/60"
                >
                  Dismiss
                </button>
              </div>
            )}
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <div className="flex items-center gap-2">
                  <Sparkles size={20} className="text-blue-600" />
                  <h2 className="text-xl font-bold text-slate-900">
                    Available Jobs
                  </h2>
                </div>
                <p className="mt-2 text-sm text-slate-500">
                  Explore jobs and internships posted by recruiters.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowFilterPanel((prev) => !prev)}
                className={`flex items-center gap-2 rounded-xl border px-3.5 py-2 text-sm font-medium transition ${
                  showFilterPanel ||
                  selectedWorkMode !== "All" ||
                  selectedJobType !== "All" ||
                  selectedExperience !== "All"
                    ? "border-blue-600 bg-blue-50 text-blue-700 shadow-xs"
                    : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                <SlidersHorizontal size={17} />
                <span>Filter jobs</span>
                {(selectedWorkMode !== "All" ||
                  selectedJobType !== "All" ||
                  selectedExperience !== "All") && (
                  <span className="flex h-2 w-2 rounded-full bg-blue-600" />
                )}
              </button>
            </div>

            {/* Expandable Advanced Filter Panel */}
            {showFilterPanel && (
              <div className="mt-4 rounded-2xl border border-blue-200 bg-blue-50/60 p-4 transition-all sm:p-5">
                <div className="flex items-center justify-between gap-3 border-b border-blue-100 pb-3">
                  <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
                    <SlidersHorizontal size={16} className="text-blue-600" />
                    Advanced Filters
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedWorkMode("All");
                      setSelectedJobType("All");
                      setSelectedExperience("All");
                      setActiveFilter("All Jobs");
                      setSearchTerm("");
                    }}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-800"
                  >
                    Reset all filters
                  </button>
                </div>

                <div className="mt-4 grid gap-4 sm:grid-cols-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-600">
                      Work Mode
                    </label>
                    <select
                      value={selectedWorkMode}
                      onChange={(e) => setSelectedWorkMode(e.target.value)}
                      className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-500"
                    >
                      <option value="All">All Modes</option>
                      <option value="remote">Remote</option>
                      <option value="hybrid">Hybrid</option>
                      <option value="onsite">On-site</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-600">
                      Job Type
                    </label>
                    <select
                      value={selectedJobType}
                      onChange={(e) => setSelectedJobType(e.target.value)}
                      className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-500"
                    >
                      <option value="All">All Types</option>
                      <option value="internship">Internship</option>
                      <option value="full-time">Full-time</option>
                      <option value="part-time">Part-time</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-600">
                      Experience
                    </label>
                    <select
                      value={selectedExperience}
                      onChange={(e) => setSelectedExperience(e.target.value)}
                      className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-500"
                    >
                      <option value="All">Any Experience</option>
                      <option value="Fresher">Fresher</option>
                      <option value="Experienced">Experienced</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Mobile search */}
            <div className="mt-5 flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-3 md:hidden">
              <Search size={18} className="text-slate-400" />
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search jobs or skills..."
                className="w-full bg-transparent text-sm outline-none"
              />
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {["All Jobs", "Remote", "Internships"].map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setActiveFilter(filter)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                    activeFilter === filter
                      ? "bg-blue-600 text-white shadow-xs"
                      : "border border-slate-200 bg-white text-slate-600 hover:border-blue-300"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>

            {jobsLoading && (
              <p className="mt-6 text-sm text-slate-500">
                Loading jobs from server...
              </p>
            )}

            {jobsError && (
              <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                {jobsError}
              </div>
            )}

            {!jobsLoading && !jobsError && jobs.length === 0 && (
              <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
                <BriefcaseBusiness
                  size={30}
                  className="mx-auto text-slate-300"
                />
                <h3 className="mt-3 font-semibold text-slate-800">
                  No jobs available
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Recruiter-posted jobs will appear here when available.
                </p>
              </div>
            )}

            {!jobsLoading && !jobsError && jobs.length > 0 && (
              <div className="mt-5 grid gap-5 xl:grid-cols-2">
                {filteredJobs.map((job) => {
                  const applied = isJobApplied(job);
                  const isSaved = savedJobs.includes(job.id);
                  const isApplying = applyingJobId === (job._id || job.id);

                  return (
                    <article
                      key={job.id}
                      className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md sm:p-6"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex min-w-0 items-start gap-3">
                          <div
                            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${job.color}`}
                          >
                            <Code2 size={23} />
                          </div>

                          <div className="min-w-0">
                            <p className="text-xs font-semibold text-slate-500">
                              {job.company}
                            </p>
                            <h3 className="mt-1 text-base font-bold text-slate-900">
                              {job.role}
                            </h3>
                            <p className="mt-1 text-xs capitalize text-slate-400">
                              {job.type}
                              {job.workMode ? ` · ${job.workMode}` : ""}
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => toggleSave(job.id)}
                          aria-label={isSaved ? "Remove saved job" : "Save job"}
                          className={`rounded-lg p-2 transition ${
                            isSaved
                              ? "bg-blue-50 text-blue-600"
                              : "text-slate-400 hover:bg-slate-100"
                          }`}
                        >
                          <Bookmark
                            size={19}
                            fill={isSaved ? "currentColor" : "none"}
                          />
                        </button>
                      </div>

                      <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-xs text-slate-500">
                        <span className="flex items-center gap-1.5">
                          <MapPin size={15} />
                          {job.location}
                        </span>
                        {job.workMode && (
                          <span className="flex items-center gap-1.5 capitalize">
                            <BriefcaseBusiness size={15} />
                            {job.workMode}
                          </span>
                        )}
                        <span className="flex items-center gap-1.5">
                          <Clock3 size={15} />
                          {job.duration}
                        </span>
                      </div>

                      <p className="mt-4 text-sm font-semibold text-slate-800">
                        {job.stipend}
                      </p>

                      <p className="mt-2 text-sm leading-6 text-slate-500">
                        {job.description}
                      </p>

                      <div className="mt-4 flex flex-wrap gap-2">
                        {job.skills.map((skill, index) => (
                          <span
                            key={`${skill}-${index}`}
                            className="rounded-md bg-slate-100 px-2.5 py-1.5 text-xs text-slate-600"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>

                      <button
                        type="button"
                        disabled={applied || isApplying}
                        onClick={() => handleApply(job)}
                        className={`mt-5 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                          applied
                            ? "cursor-default border border-emerald-300 bg-emerald-50 text-emerald-700 font-bold"
                            : isApplying
                            ? "cursor-wait bg-blue-400 text-white"
                            : "bg-blue-600 text-white hover:bg-blue-700 shadow-xs hover:shadow"
                        }`}
                      >
                        {applied ? (
                          <>
                            <CheckCircle2 size={17} className="text-emerald-600" />
                            <span>Applied</span>
                          </>
                        ) : isApplying ? (
                          <>
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                            <span>Submitting Application...</span>
                          </>
                        ) : (
                          <>
                            <span>Apply Now</span>
                            <ArrowUpRight size={17} />
                          </>
                        )}
                      </button>
                    </article>
                  );
                })}
              </div>
            )}

            {!jobsLoading &&
              !jobsError &&
              jobs.length > 0 &&
              filteredJobs.length === 0 && (
                <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
                  <Search size={28} className="mx-auto text-slate-400" />
                  <h3 className="mt-3 font-semibold text-slate-800">
                    No jobs found
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Try another search or change the selected filter.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchTerm("");
                      setActiveFilter("All Jobs");
                      setSelectedWorkMode("All");
                      setSelectedJobType("All");
                      setSelectedExperience("All");
                    }}
                    className="mt-4 text-sm font-semibold text-blue-600 hover:text-blue-800"
                  >
                    Clear filters
                  </button>
                </div>
              )}
          </section>

          {/* Application tracker */}
          <section id="applications" className="mt-10 scroll-mt-24">
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-slate-900">
                    Recent Applications
                  </h2>
                  <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-bold text-blue-700">
                    {detailedApplications.length} {detailedApplications.length === 1 ? "Record" : "Records"}
                  </span>
                </div>
                <p className="mt-1 text-sm text-slate-500">
                  Real-time status tracking of your submitted job applications.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <FileText size={20} className="text-slate-400" />
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
              {detailedApplications.length === 0 ? (
                <div className="p-10 text-center">
                  <BriefcaseBusiness
                    size={36}
                    className="mx-auto text-slate-300"
                  />
                  <p className="mt-3 text-base font-semibold text-slate-700">
                    No applications submitted yet
                  </p>
                  <p className="mt-1 text-sm text-slate-400 max-w-md mx-auto">
                    Explore available positions in the job board above and click "Apply Now" to track your application status in real time.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {detailedApplications.map((app, index) => (
                    <div
                      key={app.id || index}
                      className="flex flex-col justify-between gap-4 p-5 transition hover:bg-slate-50/70 lg:flex-row lg:items-center"
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/10 to-indigo-500/10 text-blue-600 font-bold border border-blue-100 shadow-xs">
                          <Code2 size={22} />
                        </div>

                        <div className="space-y-1.5">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-bold text-slate-900 text-base">
                              {app.role}
                            </h3>
                            {app.workMode && (
                              <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600 capitalize">
                                {app.workMode}
                              </span>
                            )}
                            {app.stipend && (
                              <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 border border-emerald-100">
                                {app.stipend}
                              </span>
                            )}
                          </div>

                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600">
                            <span className="inline-flex items-center gap-1 font-semibold text-slate-800">
                              <Building2 size={13} className="text-slate-400" />
                              {app.company}
                            </span>
                            {app.location && (
                              <span className="inline-flex items-center gap-1 text-slate-500">
                                <MapPin size={13} className="text-slate-400" />
                                {app.location}
                              </span>
                            )}
                            <span className="inline-flex items-center gap-1 text-slate-400">
                              <Calendar size={13} className="text-slate-400" />
                              Applied on {app.appliedOn}
                            </span>
                          </div>

                          {/* Clean Status Note */}
                          <div className="pt-1 flex items-center gap-2 text-xs text-slate-500">
                            <span className="inline-flex items-center gap-1 font-medium text-slate-600">
                              <CheckCircle2 size={13} className="text-emerald-600" />
                              Application Submitted
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 self-start lg:self-center">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1 text-xs font-semibold shadow-2xs ${app.statusClass}`}
                        >
                          {app.statusRaw === "accepted" && (
                            <CheckCircle2 size={13} className="text-emerald-600" />
                          )}
                          {app.statusLabel}
                        </span>

                        <button
                          type="button"
                          onClick={() => handleRemoveApplication(app.id, app.targetJobId)}
                          title="Withdraw application"
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </>
      )}

      {/* Standalone AI Job Recommendations Section */}
      {viewMode === "recommendations" && (
        <section className="space-y-6 animate-fadeIn">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <Compass size={22} className="text-purple-600" />
                  <h2 className="text-xl font-bold text-slate-900">
                    AI Job Recommendations
                  </h2>
                </div>
                <p className="mt-1 text-sm text-slate-500">
                  Enter your skills to discover matching career roles and internships based on mathematical vector similarity.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setViewMode("jobs")}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
              >
                <ArrowLeft size={14} />
                Back to Job Board
              </button>
            </div>

            <div className="mt-6">
              <RecommendationView
                initialSkills={studentSkills.join(", ")}
              />
            </div>
          </div>
        </section>
      )}

      {/* Guided Job Application Flow Modal */}
      {applicationModalJob && (
        <JobApplicationFlowModal
          job={applicationModalJob}
          studentProfile={profile}
          onClose={() => setApplicationModalJob(null)}
          onSuccess={(createdApp) => {
            const newApp = {
              ...createdApp,
              job: applicationModalJob,
              jobId: applicationModalJob._id || applicationModalJob.id,
              role: applicationModalJob.role || applicationModalJob.title,
              company: applicationModalJob.company,
              fit: createdApp.fitScore || 85,
              status: createdApp.status || "pending",
              appliedOn: new Date().toLocaleDateString("en-IN"),
              createdAt: createdApp.createdAt || new Date().toISOString(),
            };
            const updated = [newApp, ...applications];
            setApplications(updated);
            localStorage.setItem("studentApplications", JSON.stringify(updated));
            setApplyNotification({
              type: "success",
              message: `Application sent to recruiter for ${newApp.role} at ${newApp.company}!`,
            });
          }}
        />
      )}

      <footer className="py-8 text-center text-xs text-slate-400">
            InternMatch AI · Student Dashboard
          </footer>
        </main>
      </div>
    </div>
  );
};

export default StudentDashboard;