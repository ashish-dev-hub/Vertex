 import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BriefcaseBusiness,
  GraduationCap,
  Code2,
  MapPin,
  Phone,
  User,
  Sparkles,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

const StudentProfile = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    preferredLocation: "",
    college: "",
    degree: "B.Tech",
    graduationYear: "2029",
    skills: "",
    experience: "Fresher",
    preferredRole: "Frontend Developer",
    workMode: "On-site",
    phone: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.fullName ||
      !formData.college ||
      !formData.graduationYear ||
      !formData.skills ||
      !formData.preferredRole
    ) {
      alert("Please complete all required fields.");
      return;
    }

    const profile = {
      ...formData,
      skills: formData.skills
        .split(",")
        .map((skill) => skill.trim())
        .filter((skill) => skill !== ""),
      profileCompleted: true,
    };

    localStorage.setItem(
      "studentProfile",
      JSON.stringify(profile)
    );

    alert("Profile completed successfully!");

    navigate("/student/dashboard");
  };

  return (
    <div className="min-h-scree `bg-linear-to-br` from-blue-50 via-white to-purple-100 flex items-center justify-center px-4 py-8 relative overflow-hidden">

      {/* ================= BACKGROUND DECORATIONS ================= */}

      <div className="absolute top-10 left-10 w-40 h-40 bg-blue-200/40 rounded-full blur-3xl"></div>

      <div className="absolute bottom-10 right-10 w-56 h-56 bg-purple-300/40 rounded-full blur-3xl"></div>

      <div className="absolute top-1/2 left-1/3 w-32 h-32 bg-cyan-200/30 rounded-full blur-3xl"></div>

      {/* ================= MAIN CARD ================= */}

      <div className="relative z-10 w-full max-w-6xl bg-white rounded-[28px] shadow-2xl overflow-hidden border border-white">

        <div className="grid grid-cols-1 lg:grid-cols-[42%_58%]">

          {/* =====================================================
                         LEFT BLUE SECTION
          ====================================================== */}

          <div className="relative bg-linear-to-br from-blue-900 via-blue-700 to-indigo-700 text-white p-8 lg:p-10 overflow-hidden min-h-700px">

            {/* Decorative circles */}

            <div className="absolute -top-24 -right-24 w-72 h-72 bg-blue-400/20 rounded-full"></div>

            <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-purple-400/20 rounded-full"></div>

            <div className="absolute top-1/2 right- -80px w-48 h-48 border border-white/10 rounded-full"></div>

            {/* Content */}

            <div className="relative z-10 h-full flex flex-col">

              {/* Logo */}

              <div className="flex items-center gap-3 mb-10">

                <div className="w-12 h-12 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl flex items-center justify-center">

                  <BriefcaseBusiness size={25} />

                </div>

                <div>
                  <h2 className="font-bold text-xl">
                    InternMatch AI
                  </h2>

                  <p className="text-blue-200 text-sm">
                    Find. Match. Grow.
                  </p>
                </div>

              </div>

              {/* Badge */}

              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/10 backdrop-blur-md rounded-full px-4 py-2 w-fit text-sm mb-7">

                <Sparkles size={16} />

                Build your career profile
              </div>

              {/* Heading */}

              <h1 className="text-4xl lg:text-5xl font-bold leading-tight mb-6">

                Create your
                <br />

                <span className="text-blue-200">
                  career profile.
                </span>

              </h1>

              <p className="text-blue-100 text-base leading-7 max-w-md">

                Tell us about your education, skills and career
                preferences. Our AI will help you discover
                internships and jobs that match your profile.

              </p>

              {/* Feature Cards */}

              <div className="mt-10 space-y-4">

                {/* Feature 1 */}

                <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex items-center gap-4">

                  <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center">

                    <Sparkles size={21} />

                  </div>

                  <div>
                    <p className="font-semibold">
                      AI-Powered Matching
                    </p>

                    <p className="text-blue-200 text-sm">
                      Get opportunities based on your skills
                    </p>
                  </div>

                </div>

                {/* Feature 2 */}

                <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex items-center gap-4">

                  <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center">

                    <BriefcaseBusiness size={21} />

                  </div>

                  <div>
                    <p className="font-semibold">
                      Smart Job Recommendations
                    </p>

                    <p className="text-blue-200 text-sm">
                      Find roles that fit your profile
                    </p>
                  </div>

                </div>

                {/* Feature 3 */}

                <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex items-center gap-4">

                  <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center">

                    <GraduationCap size={21} />

                  </div>

                  <div>
                    <p className="font-semibold">
                      Built For Students
                    </p>

                    <p className="text-blue-200 text-sm">
                      Start your career with confidence
                    </p>
                  </div>

                </div>

              </div>

              {/* Bottom */}

              <div className="mt-auto pt-10">

                <p className="text-blue-200 text-sm">
                  Your career journey starts here.
                </p>

              </div>

            </div>
          </div>

          {/* =====================================================
                         RIGHT FORM SECTION
          ====================================================== */}

          <div className="bg-white p-7 md:p-10 lg:p-12">

            {/* Header */}

            <div className="mb-7">

              <div className="flex items-center gap-2 text-blue-600 text-sm font-medium mb-3">

                <CheckCircle2 size={17} />

                Almost there!

              </div>

              <h2 className="text-3xl font-bold text-slate-900">
                Complete Your Profile
              </h2>

              <p className="text-slate-500 mt-2 text-sm leading-6">
                Complete your profile to get relevant internship
                and job recommendations.
              </p>

            </div>

            {/* ================= FORM ================= */}

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >

              {/* Full Name */}

              <div>

                <label className="block text-sm font-semibold text-slate-800 mb-2">
                  Full Name
                  <span className="text-red-500 ml-1">*</span>
                </label>

                <div className="relative">

                  <User
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className="w-full border border-slate-200 bg-white rounded-xl pl-11 pr-4 py-3.5 text-slate-900 placeholder-slate-400 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  />

                </div>

              </div>

              {/* College */}

              <div>

                <label className="block text-sm font-semibold text-slate-800 mb-2">
                  College
                  <span className="text-red-500 ml-1">*</span>
                </label>

                <div className="relative">

                  <GraduationCap
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="text"
                    name="college"
                    value={formData.college}
                    onChange={handleChange}
                    placeholder="Enter your college name"
                    className="w-full border border-slate-200 bg-white rounded-xl pl-11 pr-4 py-3.5 text-slate-900 placeholder-slate-400 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  />

                </div>

              </div>

              {/* Degree + Graduation Year */}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {/* Degree */}

                <div>

                  <label className="block text-sm font-semibold text-slate-800 mb-2">
                    Degree
                  </label>

                  <select
                    name="degree"
                    value={formData.degree}
                    onChange={handleChange}
                    className="w-full border border-slate-200 bg-white rounded-xl px-4 py-3.5 text-slate-900 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  >

                    <option>B.Tech</option>
                    <option>B.E</option>
                    <option>BCA</option>
                    <option>MCA</option>
                    <option>M.Tech</option>
                    <option>Other</option>

                  </select>

                </div>

                {/* Graduation */}

                <div>

                  <label className="block text-sm font-semibold text-slate-800 mb-2">
                    Graduation Year
                    <span className="text-red-500 ml-1">*</span>
                  </label>

                  <input
                    type="number"
                    name="graduationYear"
                    value={formData.graduationYear}
                    onChange={handleChange}
                    className="w-full border border-slate-200 bg-white rounded-xl px-4 py-3.5 text-slate-900 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  />

                </div>

              </div>

              {/* Skills */}

              <div>

                <label className="block text-sm font-semibold text-slate-800 mb-2">
                  Skills
                  <span className="text-red-500 ml-1">*</span>
                </label>

                <div className="relative">

                  <Code2
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="text"
                    name="skills"
                    value={formData.skills}
                    onChange={handleChange}
                    placeholder="React, JavaScript, HTML, CSS"
                    className="w-full border border-slate-200 bg-white rounded-xl pl-11 pr-4 py-3.5 text-slate-900 placeholder-slate-400 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  />

                </div>

                <p className="text-xs text-slate-400 mt-2">
                  Separate multiple skills using commas.
                </p>

              </div>

              {/* Experience + Role */}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {/* Experience */}

                <div>

                  <label className="block text-sm font-semibold text-slate-800 mb-2">
                    Experience
                  </label>

                  <select
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    className="w-full border border-slate-200 bg-white rounded-xl px-4 py-3.5 text-slate-900 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  >

                    <option>Fresher</option>
                    <option>0-1 Years</option>
                    <option>1-2 Years</option>
                    <option>2+ Years</option>

                  </select>

                </div>

                {/* Preferred Role */}

                <div>

                  <label className="block text-sm font-semibold text-slate-800 mb-2">
                    Preferred Role
                    <span className="text-red-500 ml-1">*</span>
                  </label>

                  <input
                    type="text"
                    name="preferredRole"
                    value={formData.preferredRole}
                    onChange={handleChange}
                    placeholder="Frontend Developer"
                    className="w-full border border-slate-200 bg-white rounded-xl px-4 py-3.5 text-slate-900 placeholder-slate-400 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  />

                </div>

              </div>

              {/* Location */}

              <div>

                <label className="block text-sm font-semibold text-slate-800 mb-2">
                  Preferred Location
                </label>

                <div className="relative">

                  <MapPin
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="text"
                    name="preferredLocation"
                    value={formData.preferredLocation}
                    onChange={handleChange}
                    placeholder="Noida, Delhi, Remote"
                    className="w-full border border-slate-200 bg-white rounded-xl pl-11 pr-4 py-3.5 text-slate-900 placeholder-slate-400 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  />

                </div>

              </div>

              {/* Work Mode + Phone */}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {/* Work Mode */}

                <div>

                  <label className="block text-sm font-semibold text-slate-800 mb-2">
                    Work Mode
                  </label>

                  <select
                    name="workMode"
                    value={formData.workMode}
                    onChange={handleChange}
                    className="w-full border border-slate-200 bg-white rounded-xl px-4 py-3.5 text-slate-900 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  >

                    <option value="On-site">
                      On-site
                    </option>

                    <option value="Remote">
                      Remote
                    </option>

                    <option value="Hybrid">
                      Hybrid
                    </option>

                  </select>

                </div>

                {/* Phone */}

                <div>

                  <label className="block text-sm font-semibold text-slate-800 mb-2">
                    Phone Number
                  </label>

                  <div className="relative">

                    <Phone
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Enter phone number"
                      className="w-full border border-slate-200 bg-white rounded-xl pl-11 pr-4 py-3.5 text-slate-900 placeholder-slate-400 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                    />

                  </div>

                </div>

              </div>

              {/* Submit Button */}

              <button
                type="submit"
                className="w-full mt-2 bg-linear-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-semibold py-3.5 rounded-xl shadow-lg shadow-blue-500/20 transition-all duration-200 flex items-center justify-center gap-2"
              >

                Complete Profile

                <ArrowRight size={19} />

              </button>

              {/* Bottom info */}

              <div className="flex items-center justify-center gap-2 text-xs text-slate-400 pt-1">

                <Sparkles size={14} className="text-blue-500" />

                Your profile helps us find better opportunities for you.

              </div>

            </form>

          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;