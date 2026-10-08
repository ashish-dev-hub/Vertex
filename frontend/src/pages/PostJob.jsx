 import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  BriefcaseBusiness,
  ArrowLeft,
  MapPin,
  IndianRupee,
  Clock,
  Code,
  Building2,
  UserRound,
} from "lucide-react";

const PostJob = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    companyName: "",
    jobTitle: "",
    jobType: "",
    experience: "",
    skills: "",
    location: "",
    salary: "",
    duration: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Skills ko array me convert kar rahe hain
    const skillsArray = formData.skills
      .split(",")
      .map((skill) => skill.trim())
      .filter((skill) => skill !== "");

    const newJob = {
      id: Date.now(),

      companyName: formData.companyName,
      jobTitle: formData.jobTitle,
      jobType: formData.jobType,
      experience: formData.experience,
      skills: skillsArray,
      location: formData.location,
      salary: formData.salary,
      duration: formData.duration,

      applicants: 0,
      status: "Active",
    };

    // Existing jobs
    const existingJobs =
      JSON.parse(localStorage.getItem("recruiterJobs")) || [];

    // New job ko sabse upar add karna
    const updatedJobs = [newJob, ...existingJobs];

    // Local storage me save
    localStorage.setItem(
      "recruiterJobs",
      JSON.stringify(updatedJobs)
    );

    alert("Job posted successfully!");

    // Dashboard par redirect
    navigate("/recruiter/dashboard");
  };

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white">
        <div className="flex h-16 items-center px-6">

          <button
            onClick={() => navigate("/recruiter/dashboard")}
            className="flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-blue-600"
          >
            <ArrowLeft size={18} />
            Back to Dashboard
          </button>

        </div>
      </nav>

      {/* Main */}
      <main className="px-5 py-8 sm:px-8">

        <div className="mx-auto max-w-3xl">

          {/* Heading */}
          <div className="mb-8">

            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50">
              <BriefcaseBusiness
                size={25}
                className="text-blue-600"
              />
            </div>

            <h1 className="text-3xl font-bold text-slate-900">
              Post a New Job
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Create a new internship or job opportunity for students.
            </p>

          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
          >

            {/* Company Name */}
            <div className="mb-6">

              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Company Name
              </label>

              <div className="relative">

                <Building2
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  placeholder="e.g. TechNova"
                  required
                  className="w-full rounded-lg border border-slate-300 py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

              </div>

            </div>

            {/* Job Title */}
            <div className="mb-6">

              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Job Title
              </label>

              <div className="relative">

                <BriefcaseBusiness
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  name="jobTitle"
                  value={formData.jobTitle}
                  onChange={handleChange}
                  placeholder="e.g. Frontend Developer Intern"
                  required
                  className="w-full rounded-lg border border-slate-300 py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

              </div>

            </div>

            {/* Job Type */}
            <div className="mb-6">

              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Job Type
              </label>

              <select
                name="jobType"
                value={formData.jobType}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="">Select Job Type</option>
                <option value="Internship">Internship</option>
                <option value="Full Time">Full Time</option>
                <option value="Part Time">Part Time</option>
                <option value="Contract">Contract</option>
              </select>

            </div>

            {/* Experience Required */}
            <div className="mb-6">

              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Experience Required
              </label>

              <div className="relative">

                <UserRound
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  placeholder="e.g. Fresher / 0-1 Years"
                  required
                  className="w-full rounded-lg border border-slate-300 py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

              </div>

            </div>

            {/* Required Skills */}
            <div className="mb-6">

              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Required Skills
              </label>

              <div className="relative">

                <Code
                  size={18}
                  className="absolute left-3 top-4 text-slate-400"
                />

                <input
                  type="text"
                  name="skills"
                  value={formData.skills}
                  onChange={handleChange}
                  placeholder="e.g. React, JavaScript, HTML, CSS, Git"
                  required
                  className="w-full rounded-lg border border-slate-300 py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

              </div>

              <p className="mt-2 text-xs text-slate-500">
                Enter multiple skills separated by commas.
              </p>

            </div>

            {/* Location */}
            <div className="mb-6">

              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Location
              </label>

              <div className="relative">

                <MapPin
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g. Delhi / Noida / Remote"
                  required
                  className="w-full rounded-lg border border-slate-300 py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

              </div>

            </div>

            {/* Salary */}
            <div className="mb-6">

              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Salary / Stipend
              </label>

              <div className="relative">

                <IndianRupee
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  name="salary"
                  value={formData.salary}
                  onChange={handleChange}
                  placeholder="e.g. ₹15,000/month"
                  required
                  className="w-full rounded-lg border border-slate-300 py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

              </div>

            </div>

            {/* Duration */}
            <div className="mb-8">

              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Duration
              </label>

              <div className="relative">

                <Clock
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  placeholder="e.g. 3 Months"
                  required
                  className="w-full rounded-lg border border-slate-300 py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

              </div>

            </div>

            {/* Buttons */}
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

              <button
                type="button"
                onClick={() => navigate("/recruiter/dashboard")}
                className="rounded-lg border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
              >
                Post Job
              </button>

            </div>

          </form>

        </div>

      </main>

    </div>
  );
};

export default PostJob;