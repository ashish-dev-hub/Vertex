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
  Hand,
} from "lucide-react";

const RecruiterDashboard = () => {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);

  // Load jobs from localStorage
  useEffect(() => {
    const savedJobs = JSON.parse(localStorage.getItem("recruiterJobs")) || [];
    setJobs(savedJobs);
  }, []);

  const totalApplicants = jobs.reduce(
    (total, job) => total + Number(job.applicants || 0),
    0
  );

  const activeJobs = jobs.filter(
    (job) => job.status === "Active"
  ).length;

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white">
        <div className="flex h-16 items-center justify-between px-6">

          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600">
              <BriefcaseBusiness size={20} className="text-white" />
            </div>

            <span className="text-xl font-bold text-slate-900">
              InternMatch
              <span className="text-blue-600"> AI</span>
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-slate-800">
                Recruiter
              </p>

              <p className="text-xs text-slate-500">
                TechNova
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
              <UserCircle size={24} className="text-blue-600" />
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

              <a
                href="#profile"
                className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-blue-600"
              >
                <UserCircle size={19} />
                Profile
              </a>

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
          className="flex-1 p-5 sm:p-8"
        >
          <div className="mx-auto max-w-7xl">

            {/* Header */}
            <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

              <div>
                <p className="mb-1 text-sm font-medium text-blue-600">
                  Recruiter Panel
                </p>

                <h1 className="flex items-center gap-2 text-3xl font-bold text-slate-900">
                  Welcome back, Recruiter
                  <Hand size={28} className="text-yellow-500" />
                </h1>

                <p className="mt-2 text-slate-500">
                  Manage your jobs and review potential candidates.
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

            {/* Stats */}
            <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

              {/* Total Jobs */}
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
                  {jobs.length}
                </p>
              </div>

              {/* Applicants */}
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
                  {totalApplicants}
                </p>
              </div>

              {/* Active Jobs */}
              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-green-50">
                  <BriefcaseBusiness
                    size={22}
                    className="text-green-600"
                  />
                </div>

                <p className="text-sm text-slate-500">
                  Active Jobs
                </p>

                <p className="mt-1 text-2xl font-bold text-slate-900">
                  {activeJobs}
                </p>
              </div>

              {/* Shortlisted */}
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

            {/* Jobs Section */}
            <section
              id="jobs"
              className="rounded-xl border border-slate-200 bg-white shadow-sm"
            >

              {/* Section Header */}
              <div className="flex flex-col justify-between gap-3 border-b border-slate-200 p-6 sm:flex-row sm:items-center">

                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    My Jobs
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Manage the internships and jobs you have posted.
                  </p>
                </div>

                <Link
                  to="/recruiter/post-job"
                  className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                >
                  + Add New Job
                </Link>

              </div>

              {/* Job Cards */}

              {jobs.length === 0 ? (

                <div className="p-10 text-center">

                  <BriefcaseBusiness
                    size={45}
                    className="mx-auto text-slate-300"
                  />

                  <h3 className="mt-4 text-lg font-semibold text-slate-800">
                    No jobs posted yet
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Start by posting your first job.
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
                      key={job.id}
                      className="p-6 transition hover:bg-slate-50"
                    >

                      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

                        {/* Job Info */}
                        <div className="flex gap-4">

                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-blue-50">
                            <BriefcaseBusiness
                              size={23}
                              className="text-blue-600"
                            />
                          </div>

                          <div>

                            <div className="flex flex-wrap items-center gap-2">

                              <h3 className="font-semibold text-slate-900">
                                {job.role}
                              </h3>

                              <span
                                className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                                  job.status === "Active"
                                    ? "bg-green-100 text-green-700"
                                    : "bg-slate-100 text-slate-500"
                                }`}
                              >
                                {job.status}
                              </span>

                            </div>

                            <p className="mt-1 text-sm font-medium text-slate-600">
                              {job.company}
                            </p>

                            <div className="mt-3 flex flex-wrap gap-4 text-sm text-slate-500">

                              <span className="flex items-center gap-1.5">
                                <MapPin size={15} />
                                {job.location}
                              </span>

                              <span className="flex items-center gap-1.5">
                                <IndianRupee size={15} />
                                {job.salary}
                              </span>

                              <span className="flex items-center gap-1.5">
                                <Clock size={15} />
                                {job.duration}
                              </span>

                            </div>

                          </div>

                        </div>

                        {/* Applicant Info */}
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">

                          <div className="rounded-lg bg-slate-50 px-4 py-2 text-center">
                            <p className="text-lg font-bold text-slate-900">
                              {job.applicants || 0}
                            </p>

                            <p className="text-xs text-slate-500">
                              Applicants
                            </p>
                          </div>

                          <button
                            className="flex items-center justify-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                          >
                            <Eye size={16} />
                            View
                          </button>

                          <button
                            className="flex items-center justify-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                          >
                            <Edit size={16} />
                            Edit
                          </button>

                        </div>

                      </div>

                    </div>

                  ))}

                </div>

              )}

            </section>

            {/* AI Insights */}
            <section className="mt-8 rounded-xl border border-blue-100 bg-blue-50 p-6">

              <div className="flex flex-col gap-4 sm:flex-row sm:items-start">

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-blue-600">
                  <Users
                    size={21}
                    className="text-white"
                  />
                </div>

                <div>

                  <h2 className="font-bold text-slate-900">
                    AI Candidate Insights
                  </h2>

                  <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-600">
                    Once the ML model is connected, you will be able
                    to see candidate-role fit scores, applicant
                    profile groups and other ML-supported insights
                    directly in your recruiter dashboard.
                  </p>

                  <p className="mt-3 text-xs font-medium text-blue-700">
                    Demo mode — ML integration will be added later.
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