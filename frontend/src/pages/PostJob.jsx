import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  BriefcaseBusiness,
  ArrowLeft,
  MapPin,
  IndianRupee,
  Clock,
  PlusCircle,
} from "lucide-react";

const PostJob = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    company: "",
    role: "",
    jobType: "Internship",
    description: "",
    skills: "",
    location: "",
    salary: "",
    duration: "",
    experience: "Fresher",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.company ||
      !formData.role ||
      !formData.description ||
      !formData.skills ||
      !formData.location ||
      !formData.salary ||
      !formData.duration
    ) {
      alert("Please fill all required fields.");
      return;
    }

    const newJob = {
      id: Date.now(),
      company: formData.company,
      role: formData.role,
      jobType: formData.jobType,
      description: formData.description,

      skills: formData.skills
        .split(",")
        .map((skill) => skill.trim())
        .filter((skill) => skill !== ""),

      location: formData.location,
      salary: formData.salary,
      duration: formData.duration,
      experience: formData.experience,

      applicants: 0,
      status: "Active",

      createdAt: new Date().toLocaleDateString(),
    };

    const existingJobs =
      JSON.parse(localStorage.getItem("recruiterJobs")) || [];

    const updatedJobs = [...existingJobs, newJob];

    localStorage.setItem(
      "recruiterJobs",
      JSON.stringify(updatedJobs)
    );

    alert("Job posted successfully!");

    navigate("/recruiter/dashboard");
  };

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Navbar */}
      <nav className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">

          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600">
              <BriefcaseBusiness
                size={20}
                className="text-white"
              />
            </div>

            <span className="text-xl font-bold text-slate-900">
              InternMatch
              <span className="text-blue-600"> AI</span>
            </span>
          </Link>

          <Link
            to="/recruiter/dashboard"
            className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-600"
          >
            <ArrowLeft size={17} />
            Back to Dashboard
          </Link>

        </div>
      </nav>

      {/* Main */}
      <main className="px-5 py-8 sm:px-8">

        <div className="mx-auto max-w-4xl">

          {/* Heading */}
          <div className="mb-8">

            <p className="mb-2 text-sm font-semibold text-blue-600">
              Recruiter Panel
            </p>

            <h1 className="text-3xl font-bold text-slate-900">
              Post a New Job
            </h1>

            <p className="mt-2 text-slate-500">
              Add the job details so students can discover and apply
              for this opportunity.
            </p>

          </div>

          {/* Form Card */}
          <form
            onSubmit={handleSubmit}
            className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
          >

            {/* Basic Information */}
            <div className="mb-8">

              <h2 className="mb-1 text-lg font-bold text-slate-900">
                Basic Information
              </h2>

              <p className="mb-6 text-sm text-slate-500">
                Enter the basic details of the opportunity.
              </p>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                {/* Company */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Company Name *
                  </label>

                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    placeholder="e.g. TechNova"
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                {/* Role */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Job Title *
                  </label>

                  <input
                    type="text"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    placeholder="e.g. Frontend Developer Intern"
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                {/* Job Type */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Job Type
                  </label>

                  <select
                    name="jobType"
                    value={formData.jobType}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  >
                    <option>Internship</option>
                    <option>Full Time</option>
                    <option>Part Time</option>
                    <option>Contract</option>
                  </select>
                </div>

                {/* Experience */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Experience Required
                  </label>

                  <select
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  >
                    <option>Fresher</option>
                    <option>0-1 Years</option>
                    <option>1-2 Years</option>
                    <option>2+ Years</option>
                  </select>
                </div>

              </div>

            </div>

            {/* Job Description */}
            <div className="mb-8 border-t border-slate-200 pt-8">

              <h2 className="mb-1 text-lg font-bold text-slate-900">
                Job Description
              </h2>

              <p className="mb-6 text-sm text-slate-500">
                Describe the role and responsibilities.
              </p>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="5"
                placeholder="Describe the role, responsibilities and expectations..."
                className="w-full resize-none rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

            </div>

            {/* Skills */}
            <div className="mb-8 border-t border-slate-200 pt-8">

              <h2 className="mb-1 text-lg font-bold text-slate-900">
                Required Skills
              </h2>

              <p className="mb-6 text-sm text-slate-500">
                Add skills separated by commas. These skills will
                later be used by the ML matching system.
              </p>

              <input
                type="text"
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                placeholder="React, JavaScript, HTML, CSS"
                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

            </div>

            {/* Location & Compensation */}
            <div className="mb-8 border-t border-slate-200 pt-8">

              <h2 className="mb-1 text-lg font-bold text-slate-900">
                Location & Compensation
              </h2>

              <p className="mb-6 text-sm text-slate-500">
                Tell students where the opportunity is based and
                what compensation is offered.
              </p>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-3">

                {/* Location */}
                <div>
                  <label className="mb-2 flex items-center gap-1 text-sm font-medium text-slate-700">
                    <MapPin size={15} />
                    Location *
                  </label>

                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Remote / Noida"
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                {/* Salary */}
                <div>
                  <label className="mb-2 flex items-center gap-1 text-sm font-medium text-slate-700">
                    <IndianRupee size={15} />
                    Salary / Stipend *
                  </label>

                  <input
                    type="text"
                    name="salary"
                    value={formData.salary}
                    onChange={handleChange}
                    placeholder="₹15,000/month"
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                {/* Duration */}
                <div>
                  <label className="mb-2 flex items-center gap-1 text-sm font-medium text-slate-700">
                    <Clock size={15} />
                    Duration *
                  </label>

                  <input
                    type="text"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    placeholder="3 Months"
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

              </div>

            </div>

            {/* AI Notice */}
            <div className="mb-8 rounded-lg border border-blue-100 bg-blue-50 p-4">

              <p className="text-sm font-semibold text-blue-800">
                AI Matching
              </p>

              <p className="mt-1 text-sm leading-6 text-blue-700">
                The required skills entered here will later be
                sent to the ML service to calculate candidate-role
                fit scores and recommendations.
              </p>

            </div>

            {/* Buttons */}
            <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:justify-end">

              <Link
                to="/recruiter/dashboard"
                className="rounded-lg border border-slate-300 px-5 py-3 text-center text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </Link>

              <button
                type="submit"
                className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                <PlusCircle size={18} />
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