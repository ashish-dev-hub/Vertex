 import React, { useMemo, useState } from "react";
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

const demoJobs = [
  {
    id: 1,
    company: "TechNova",
    role: "Frontend Developer Intern",
    location: "Remote",
    stipend: "₹15,000/month",
    duration: "3 months",
    type: "Internship",
    skills: ["React", "JavaScript", "HTML", "CSS"],
    fit: 91,
    color: "bg-blue-100 text-blue-700",
    description: "Build responsive user interfaces and work with a product team.",
  },
  {
    id: 2,
    company: "DataSphere",
    role: "Python Developer Intern",
    location: "Noida, India",
    stipend: "₹12,000/month",
    duration: "6 months",
    type: "Internship",
    skills: ["Python", "SQL", "Git"],
    fit: 85,
    color: "bg-violet-100 text-violet-700",
    description: "Assist with Python applications, APIs and data processing.",
  },
  {
    id: 3,
    company: "InsightWorks",
    role: "Data Analyst Intern",
    location: "Gurugram, India",
    stipend: "₹18,000/month",
    duration: "4 months",
    type: "Internship",
    skills: ["Python", "SQL", "Excel"],
    fit: 78,
    color: "bg-emerald-100 text-emerald-700",
    description: "Explore datasets and create reports to support business decisions.",
  },
  {
    id: 4,
    company: "CloudPeak",
    role: "Full Stack Developer Intern",
    location: "Hybrid",
    stipend: "₹20,000/month",
    duration: "6 months",
    type: "Internship",
    skills: ["React", "Node.js", "MongoDB"],
    fit: 74,
    color: "bg-orange-100 text-orange-700",
    description: "Contribute to frontend features and backend API development.",
  },
];

const StudentDashboard = () => {
  const navigate = useNavigate();

  const [profile] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("studentProfile")) || {};
    } catch {
      return {};
    }
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("All Jobs");
  const [savedJobs, setSavedJobs] = useState([]);
  const [applications, setApplications] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("studentApplications")) || [];
    } catch {
      return [];
    }
  });

  const studentName = profile.fullName?.trim() || "Student";
  const studentSkills = Array.isArray(profile.skills)
    ? profile.skills
    : (profile.skills || "")
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean);

  const filteredJobs = useMemo(() => {
    return demoJobs.filter((job) => {
      const text = `${job.role} ${job.company} ${job.location} ${job.skills.join(" ")}`;
      const matchesSearch = text
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const matchesFilter =
        activeFilter === "All Jobs" ||
        (activeFilter === "Remote" && job.location === "Remote") ||
        (activeFilter === "High Match" && job.fit >= 85);

      return matchesSearch && matchesFilter;
    });
  }, [searchTerm, activeFilter]);

  const handleApply = (job) => {
    const alreadyApplied = applications.some(
      (application) => application.jobId === job.id
    );

    if (alreadyApplied) {
      alert("You have already applied for this internship.");
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

    alert(`Application submitted for ${job.role}!`);
  };

  const toggleSave = (jobId) => {
    setSavedJobs((previous) =>
      previous.includes(jobId)
        ? previous.filter((id) => id !== jobId)
        : [...previous, jobId]
    );
  };

  const handleLogout = () => {
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

            <div className="hidden h-9 w-9 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700 sm:flex">
              {studentName.charAt(0).toUpperCase()}
            </div>

            <span className="hidden max-w-32 truncate text-sm font-semibold sm:block">
              {studentName}
            </span>

            <ChevronDown size={16} className="hidden text-slate-400 sm:block" />

            <button
              type="button"
              onClick={handleLogout}
              title="Back to login"
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

          <div className="mt-10 rounded-2xl bg-gradient from-blue-600 to-indigo-700 p-4 text-white">
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
          <section className="relative overflow-hidden rounded-2xl bg-gradient from-blue-700 via-blue-600 to-indigo-600 p-6 text-white sm:p-8">
            <div className="relative z-10 max-w-2xl">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-xs font-medium">
                <Sparkles size={14} />
                Your career journey starts here
              </div>

              <h1 className="text-2xl font-bold  text-red-400sm:text-3xl">
                Welcome back, {studentName}!
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-6 text-blue-400 sm:text-base">
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
                <p className="text-sm text-slate-500">Recommended Jobs</p>
                <BriefcaseBusiness size={20} className="text-blue-600" />
              </div>
              <p className="mt-3 text-3xl font-bold text-slate-900">
                {demoJobs.length}
              </p>
              <p className="mt-1 text-xs text-slate-400">
                Sample opportunities
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
                Jobs you have applied for
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
                Opportunities bookmarked
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
                  <p className="mt-1 text-sm text-slate-500">
                    {profile.college || "Add your college details"}
                    {profile.degree ? ` · ${profile.degree}` : ""}
                    {profile.graduationYear
                      ? ` · Class of ${profile.graduationYear}`
                      : ""}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {studentSkills.length > 0 ? (
                      studentSkills.slice(0, 6).map((skill) => (
                        <span
                          key={skill}
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
                    Recommended for You
                  </h2>
                </div>
                <p className="mt-2 text-sm text-slate-500">
                  Explore internships that may suit your profile.
                </p>
              </div>

              <div className="flex items-center gap-2 text-sm text-slate-500">
                <SlidersHorizontal size={17} />
                <span>Filter jobs</span>
              </div>
            </div>

            {/* Search for mobile */}
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

            <div className="mt-5 grid gap-5 xl:grid-cols-2">
              {filteredJobs.map((job) => {
                const applied = applications.some(
                  (application) => application.jobId === job.id
                );

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
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => toggleSave(job.id)}
                        aria-label={
                          savedJobs.includes(job.id)
                            ? "Remove saved job"
                            : "Save job"
                        }
                        className={`rounded-lg p-2 transition ${
                          savedJobs.includes(job.id)
                            ? "bg-blue-50 text-blue-600"
                            : "text-slate-400 hover:bg-slate-100"
                        }`}
                      >
                        <Bookmark
                          size={19}
                          fill={
                            savedJobs.includes(job.id)
                              ? "currentColor"
                              : "none"
                          }
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
                      {job.skills.map((skill) => (
                        <span
                          key={skill}
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
                            Demo AI Fit Score
                          </p>
                          <p className="mt-1 text-xs text-blue-600">
                            Example score, not a real ML prediction
                          </p>
                        </div>

                        <span className="text-2xl font-bold text-blue-700">
                          {job.fit}%
                        </span>
                      </div>

                      <div className="mt-3 h-2 overflow-hidden rounded-full bg-blue-100">
                        <div
                          className="h-full rounded-full bg-blue-600"
                          style={{ width: `${job.fit}%` }}
                        />
                      </div>
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
                      {applied ? "Applied Successfully" : "Apply Now"}
                      {!applied && <ArrowUpRight size={17} />}
                    </button>
                  </article>
                );
              })}
            </div>

            {filteredJobs.length === 0 && (
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

          {/* Application tracker preview */}
          <section id="applications" className="mt-10 scroll-mt-24">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Recent Applications
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Track the jobs you have applied for.
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
                    Apply to an internship to see it listed here.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {applications.map((application) => (
                    <div
                      key={application.jobId}
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
                          Demo fit score: {application.fit}%
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
            InternMatch AI · Demo dashboard · Backend integration pending
          </footer>
        </main>
      </div>
    </div>
  );
};

export default StudentDashboard;