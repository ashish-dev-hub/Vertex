 import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

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
    <div className="min-h-screen bg-white text-black flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-3xl bg-white border border-gray-300 rounded-2xl p-8 shadow-sm">

        {/* Heading */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-black">
            Complete Your Profile
          </h1>

          <p className="text-gray-600 mt-2">
            Complete your profile to get relevant internship and job recommendations.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-black mb-2">
              Full Name *
            </label>

            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter your full name"
              className="w-full bg-white text-black border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-black"
            />
          </div>

          {/* College */}
          <div>
            <label className="block text-sm font-medium text-black mb-2">
              College *
            </label>

            <input
              type="text"
              name="college"
              value={formData.college}
              onChange={handleChange}
              placeholder="Enter your college name"
              className="w-full bg-white text-black border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-black"
            />
          </div>

          {/* Degree + Graduation Year */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* Degree */}
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Degree
              </label>

              <select
                name="degree"
                value={formData.degree}
                onChange={handleChange}
                className="w-full bg-white text-black border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-black"
              >
                <option>B.Tech</option>
                <option>B.E</option>
                <option>BCA</option>
                <option>MCA</option>
                <option>M.Tech</option>
                <option>Other</option>
              </select>
            </div>

            {/* Graduation Year */}
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Graduation Year *
              </label>

              <input
                type="number"
                name="graduationYear"
                value={formData.graduationYear}
                onChange={handleChange}
                className="w-full bg-white text-black border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-black"
              />
            </div>

          </div>

          {/* Skills */}
          <div>
            <label className="block text-sm font-medium text-black mb-2">
              Skills *
            </label>

            <input
              type="text"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              placeholder="React, JavaScript, HTML, CSS"
              className="w-full bg-white text-black border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-black"
            />

            <p className="text-xs text-gray-500 mt-2">
              Separate multiple skills using commas.
            </p>
          </div>

          {/* Experience + Preferred Role */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* Experience */}
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Experience
              </label>

              <select
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                className="w-full bg-white text-black border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-black"
              >
                <option>Fresher</option>
                <option>0-1 Years</option>
                <option>1-2 Years</option>
                <option>2+ Years</option>
              </select>
            </div>

            {/* Preferred Role */}
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Preferred Role *
              </label>

              <input
                type="text"
                name="preferredRole"
                value={formData.preferredRole}
                onChange={handleChange}
                placeholder="Frontend Developer"
                className="w-full bg-white text-black border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-black"
              />
            </div>

          </div>

          {/* Preferred Location */}
          <div>
            <label className="block text-sm font-medium text-black mb-2">
              Preferred Location
            </label>

            <input
              type="text"
              name="preferredLocation"
              value={formData.preferredLocation}
              onChange={handleChange}
              placeholder="Noida, Delhi, Remote"
              className="w-full bg-white text-black border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-black"
            />
          </div>

          {/* Work Mode */}
          <div>
            <label className="block text-sm font-medium text-black mb-2">
              Work Mode
            </label>

            <select
              name="workMode"
              value={formData.workMode}
              onChange={handleChange}
              className="w-full bg-white text-black border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-black"
            >
              <option value="On-site">On-site</option>
              <option value="Remote">Remote</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-black mb-2">
              Phone Number
            </label>

            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter your phone number"
              className="w-full bg-white text-black border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-black"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-black text-white hover:bg-gray-800 transition rounded-lg py-3 font-semibold"
          >
            Complete Profile
          </button>

        </form>
      </div>
    </div>
  );
};

export default StudentProfile;