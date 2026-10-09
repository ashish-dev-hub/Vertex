 
import React, { useEffect, useMemo, useState } from "react";
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
} from "lucide-react";

import { getStudentProfile } from "../api/studentProfile";
import { getJobs } from "../api/jobs";

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

  const [profile, setProfile] = useState({});
  const [jobs, setJobs] = useState([]);

  const [profileLoading, setProfileLoading] = useState(true);
  const [jobsLoading, setJobsLoading] = useState(true);

  const [profileError, setProfileError] = useState("");
  const [jobsError, setJobsError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("All Jobs");

  const [savedJobs, setSavedJobs] = useState(() =>
    getStoredArray("savedStudentJobs")
  );

  const [applications, setApplications] = useState(() =>
    getStoredArray("studentApplications")
  );

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

        if (active) {
          setProfile(student || {});
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
            stipend:
              job.stipend != null
                ? `₹${job.stipend}/month`
                : job.salary != null
                ? typeof job.salary === "number"
                  ? `₹${job.salary}`
                  : job.salary
                : "Not specified",
            duration: job.duration || "Not specified",
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

    fetchProfile();
    fetchPostedJobs();

    return () => {
      active = false;
    };
  }, []);

  const studentName =
    profile.fullName?.trim?.() ||
    profile.name?.trim?.() ||
    "Student";

  const studentSkills = Array.isArray(profile.skills)
    ? profile.skills
    : typeof profile.skills === "string"
    ? profile.skills.split(",").map((skill) => skill.trim()).filter(Boolean)
    : [];

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const text = [
        job.role,
        job.company,
        job.location,
        ...job.skills,
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch = text.includes(searchTerm.toLowerCase());

      const matchesFilter =
        activeFilter === "All Jobs" ||
        (activeFilter === "Remote" &&
          job.location.toLowerCase().includes("remote")) ||
        (activeFilter === "High Match" &&
          job.fit !== null &&
          job.fit >= 85);

      return matchesSearch && matchesFilter;
    });
  }, [jobs, searchTerm, activeFilter]);

  const handleApply = (job) => {
    const alreadyApplied = applications.some(
      (application) => String(application.jobId) === String(job.id)
    );

    if (alreadyApplied) {
      alert("You have already applied for this job.");
      return;
    }

    const updatedApplications = [
      ...applications,
      {
        jobId: job.id,
        role: job.role,
        company: job.company,
        fit: job.fit,
        status: "Applied",
        appliedOn: new Date().toLocaleDateString("en-IN"),
      },
    ];

    setApplications(updatedApplications);
    localStorage.setItem(
      "studentApplications",
      JSON.stringify(updatedApplications)
    );

    alert(
      "Demo application saved. Connect an application API to submit it to the backend."
    );
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
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Top navigation */}
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-1440px items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex shrink-0 items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600">
              <BriefcaseBusiness size={21} className="text-white" />
            </div>
            <span className="text-lg font-bold text-slate-900 sm:text-xl">
              InternMatch<span className="text-blue-600"> AI</span>
            </span>
          </Link>

          <div className="hidden max-w-md flex-1 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 md:flex">
            <Search size={18} className="text-slate-400" />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search jobs, skills or companies..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="Notifications"
              className="rounded-xl p-2.5 text-slate-500 hover:bg-slate-100"
            >
              <Bell size={20} />
            </button>

            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700">
              {studentName.charAt(0).toUpperCase()}
            </div>

            <span className="hidden max-w-32 truncate text-sm font-semibold sm:block">
              {studentName}
            </span>

            <ChevronDown size={16} className="hidden text-slate-400 sm:block" />

            <button
              type="button"
              onClick={handleLogout}
              title="Log out"
              className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-1440px lg:grid-cols-[235px_minmax(0,1fr)]">
        {/* Sidebar */}
        <aside className="hidden min-h-[calc(100vh-64px)] border-r border-slate-200 bg-white p-5 lg:block">
          <p className="mb-4 px-3 text-xs font-bold uppercase tracking-wider text-slate-400">
            Workspace
          </p>

          <nav className="space-y-2">
            <button
              type="button"
              className="flex w-full items-center gap-3 rounded-xl bg-blue-50 px-3 py-3 text-left text-sm font-semibold text-blue-700"
            >
              <LayoutDashboard size={19} />
              Dashboard
            </button>

            <button
              type="button"
              onClick={() => {
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
              onClick={() =>
                document.getElementById("applications")?.scrollIntoView({
                  behavior: "smooth",
                })
              }
              className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              <FileText size={19} />
              My Applications
              <span className="ml-auto rounded-full bg-slate-100 px-2 py-0.5 text-xs">
                {applications.length}
              </span>
            </button>

            <Link
              to="/student/profile"
              className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              <GraduationCap size={19} />
              My Profile
            </Link>
          </nav>

          <div className="mt-10 rounded-2xl bg-linear-to-r from-blue-600 to-indigo-700 p-4 text-white">
            <Sparkles size={22} />
            <h3 className="mt-3 font-bold">AI Career Match</h3>
            <p className="mt-2 text-xs leading-5 text-blue-100">
              Discover opportunities aligned with your skills and career goals.
            </p>
            <button
              type="button"
              onClick={() => {
                setActiveFilter("High Match");
                document.getElementById("recommended-jobs")?.scrollIntoView({
                  behavior: "smooth",
                });
              }}
              className="mt-4 w-full rounded-lg bg-white px-3 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-50"
            >
              View Top Matches
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

              <button
                type="button"
                onClick={() =>
                  document.getElementById("recommended-jobs")?.scrollIntoView({
                    behavior: "smooth",
                  })
                }
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-blue-700 transition hover:bg-blue-50"
              >
                Explore Opportunities
                <ArrowUpRight size={17} />
              </button>
            </div>

            <div className="absolute -right-10 -top-16 hidden h-64 w-64 rounded-full border-35px border-white/10 sm:block" />
            <div className="absolute -bottom-24 right-28 hidden h-52 w-52 rounded-full bg-white/10 sm:block" />
          </section>

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

              <div className="flex items-center gap-2 text-sm text-slate-500">
                <SlidersHorizontal size={17} />
                <span>Filter jobs</span>
              </div>
            </div>

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
              {["All Jobs", "High Match", "Remote"].map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setActiveFilter(filter)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                    activeFilter === filter
                      ? "bg-blue-600 text-white"
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
                  const applied = applications.some(
                    (application) =>
                      String(application.jobId) === String(job.id)
                  );

                  const isSaved = savedJobs.includes(job.id);

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
                            <p className="mt-1 text-xs text-slate-400">
                              {job.type}
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

                      <div className="mt-5 rounded-xl bg-blue-50 p-4">
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="flex items-center gap-1.5 text-sm font-bold text-blue-800">
                              <Sparkles size={15} />
                              AI Match Score
                            </p>
                            <p className="mt-1 text-xs text-blue-600">
                              {job.fit == null
                                ? "Match score not available"
                                : "Based on the score provided by the API"}
                            </p>
                          </div>
                          <span className="text-2xl font-bold text-blue-700">
                            {job.fit == null ? "—" : `${job.fit}%`}
                          </span>
                        </div>

                        {job.fit != null && (
                          <div className="mt-3 h-2 overflow-hidden rounded-full bg-blue-100">
                            <div
                              className="h-full rounded-full bg-blue-600"
                              style={{
                                width: `${Math.max(
                                  0,
                                  Math.min(100, job.fit)
                                )}%`,
                              }}
                            />
                          </div>
                        )}
                      </div>

                      <button
                        type="button"
                        disabled={applied}
                        onClick={() => handleApply(job)}
                        className={`mt-5 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                          applied
                            ? "cursor-not-allowed bg-emerald-50 text-emerald-700"
                            : "bg-blue-600 text-white hover:bg-blue-700"
                        }`}
                      >
                        {applied ? "Applied (Demo)" : "Apply Now"}
                        {!applied && <ArrowUpRight size={17} />}
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
                    }}
                    className="mt-4 text-sm font-semibold text-blue-600"
                  >
                    Clear filters
                  </button>
                </div>
              )}
          </section>

          {/* Application tracker */}
          <section id="applications" className="mt-10 scroll-mt-24">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Recent Applications
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Track your locally saved application records.
                </p>
              </div>
              <FileText size={22} className="text-slate-400" />
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
              {applications.length === 0 ? (
                <div className="p-8 text-center">
                  <BriefcaseBusiness
                    size={30}
                    className="mx-auto text-slate-300"
                  />
                  <p className="mt-3 font-semibold text-slate-700">
                    No applications yet
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    Apply to a job to see its demo record here.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {applications.map((application, index) => (
                    <div
                      key={`${application.jobId}-${index}`}
                      className="flex flex-col justify-between gap-3 p-5 sm:flex-row sm:items-center"
                    >
                      <div>
                        <h3 className="font-semibold text-slate-900">
                          {application.role}
                        </h3>
                        <p className="mt-1 text-sm text-slate-500">
                          {application.company} · Applied{" "}
                          {application.appliedOn}
                        </p>
                        <p className="mt-1 text-xs text-blue-600">
                          {application.fit == null
                            ? "Match score unavailable"
                            : `Match score: ${application.fit}%`}
                        </p>
                      </div>

                      <span className="w-fit rounded-full bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700">
                        {application.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          <footer className="py-8 text-center text-xs text-slate-400">
            InternMatch AI · Student Dashboard
          </footer>
        </main>
      </div>
    </div>
  );
};

export default StudentDashboard;