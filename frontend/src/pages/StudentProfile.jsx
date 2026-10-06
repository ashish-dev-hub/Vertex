import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  BriefcaseBusiness,
  GraduationCap,
  Code2,
  MapPin,
  ArrowLeft,
  ArrowRight,
  UserRound,
} from "lucide-react";

const StudentProfile = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    college: "",
    degree: "B.Tech",
    graduationYear: "2029",
    skills: "",
    experience: "Fresher",
    preferredRole: "Frontend Developer",
    preferredLocation: "",
    linkedin: "",
    portfolio: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    const skillsArray = formData.skills
      .split(",")
      .map((skill) => skill.trim())
      .filter(Boolean);

    if (skillsArray.length === 0) {
      setError("Please enter at least one skill.");
      return;
    }

    const profile = {
      ...formData,
      skills: skillsArray,
    };

    // Temporary frontend storage. Later, we will use the backend API.
    localStorage.setItem("studentProfile", JSON.stringify(profile));

    alert("Student profile saved successfully!");

    // Dashboard will be connected in our next step.
    navigate("/student/dashboard");
  };

  const inputClass =
    "mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-50";

  const labelClass = "text-sm font-semibold text-slate-700";

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600">
              <BriefcaseBusiness size={20} className="text-white" />
            </div>

            <span className="text-xl font-bold text-slate-900">
              InternMatch<span className="text-blue-600"> AI</span>
            </span>
          </Link>

          <span className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 sm:text-sm">
            Student Profile
          </span>
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <Link
          to="/login"
          className="mb-6 inline-flex items-center gap-2 text-sm text-slate-500 hover:text-blue-600"
        >
          <ArrowLeft size={16} />
          Back to Login
        </Link>

        <div className="mb-8">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
            <UserRound size={28} />
          </div>

          <p className="mb-2 text-sm font-semibold text-blue-600">
            LET'S GET YOU STARTED
          </p>

          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Complete your student profile
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
            Tell us about your education, skills and career goals so we can
            help you discover relevant internships and jobs.
          </p>
        </div>

        {/* Profile Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8"
        >
          {/* Personal Information */}
          <section>
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <UserRound size={21} />
              </div>

              <div>
                <h2 className="font-bold text-slate-900">
                  Personal Information
                </h2>
                <p className="text-sm text-slate-500">
                  Basic details about you
                </p>
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Full Name *</label>
                <input
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Preferred Location *</label>
                <div className="relative">
                  <MapPin
                    size={17}
                    className="absolute left-3 top-1/2 mt-1 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    name="preferredLocation"
                    value={formData.preferredLocation}
                    onChange={handleChange}
                    placeholder="e.g. Delhi or Remote"
                    required
                    className={`${inputClass} pl-10`}
                  />
                </div>
              </div>
            </div>
          </section>

          <div className="border-t border-slate-100" />

          {/* Education */}
          <section>
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                <GraduationCap size={22} />
              </div>

              <div>
                <h2 className="font-bold text-slate-900">
                  Education
                </h2>
                <p className="text-sm text-slate-500">
                  Your current academic details
                </p>
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className={labelClass}>College / University *</label>
                <input
                  name="college"
                  value={formData.college}
                  onChange={handleChange}
                  placeholder="Enter your college name"
                  required
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Degree *</label>
                <select
                  name="degree"
                  value={formData.degree}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value="B.Tech">B.Tech</option>
                  <option value="B.E.">B.E.</option>
                  <option value="BCA">BCA</option>
                  <option value="MCA">MCA</option>
                  <option value="B.Sc">B.Sc</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className={labelClass}>Graduation Year *</label>
                <select
                  name="graduationYear"
                  value={formData.graduationYear}
                  onChange={handleChange}
                  className={inputClass}
                >
                  {Array.from({ length: 8 }, (_, i) => 2026 + i).map(
                    (year) => (
                      <option key={year} value={String(year)}>
                        {year}
                      </option>
                    )
                  )}
                </select>
              </div>
            </div>
          </section>

          <div className="border-t border-slate-100" />

          {/* Skills and Experience */}
          <section>
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <Code2 size={22} />
              </div>

              <div>
                <h2 className="font-bold text-slate-900">
                  Skills & Experience
                </h2>
                <p className="text-sm text-slate-500">
                  Help us understand your technical background
                </p>
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <label className={labelClass}>Your Skills *</label>
                <input
                  name="skills"
                  value={formData.skills}
                  onChange={handleChange}
                  placeholder="React, JavaScript, HTML, CSS"
                  required
                  className={inputClass}
                />
                <p className="mt-2 text-xs text-slate-400">
                  Separate skills with commas.
                </p>
              </div>

              <div>
                <label className={labelClass}>Experience Level *</label>
                <select
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value="Fresher">Fresher</option>
                  <option value="Less than 1 year">Less than 1 year</option>
                  <option value="1-2 years">1–2 years</option>
                  <option value="2+ years">2+ years</option>
                </select>
              </div>

              <div>
                <label className={labelClass}>Preferred Job Role *</label>
                <select
                  name="preferredRole"
                  value={formData.preferredRole}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value="Frontend Developer">
                    Frontend Developer
                  </option>
                  <option value="Backend Developer">
                    Backend Developer
                  </option>
                  <option value="Full Stack Developer">
                    Full Stack Developer
                  </option>
                  <option value="Data Analyst">Data Analyst</option>
                  <option value="Machine Learning Intern">
                    Machine Learning Intern
                  </option>
                  <option value="Software Engineer">
                    Software Engineer
                  </option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </section>

          <div className="border-t border-slate-100" />

          {/* Optional Links */}
          <section>
            <h2 className="font-bold text-slate-900">
              Professional Links
              <span className="ml-2 text-xs font-normal text-slate-400">
                Optional
              </span>
            </h2>

            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <div>
                <label className={labelClass}>LinkedIn Profile</label>
                <input
                  type="url"
                  name="linkedin"
                  value={formData.linkedin}
                  onChange={handleChange}
                  placeholder="https://linkedin.com/in/..."
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Portfolio / GitHub</label>
                <input
                  type="url"
                  name="portfolio"
                  value={formData.portfolio}
                  onChange={handleChange}
                  placeholder="https://github.com/..."
                  className={inputClass}
                />
              </div>
            </div>
          </section>

          {error && (
            <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
              {error}
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 font-semibold text-white transition hover:bg-blue-700"
          >
            Save Profile & Continue
            <ArrowRight size={18} />
          </button>

          <p className="text-center text-xs leading-5 text-slate-400">
            Your profile will help us match your skills with relevant
            opportunities. AI recommendations will be connected later.
          </p>
        </form>
      </main>
    </div>
  );
};

export default StudentProfile;