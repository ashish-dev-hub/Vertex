 
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getStudentProfile,
  createStudentProfile,
  updateStudentProfile,
} from "../api/studentProfile";

const StudentProfile = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    preferredLocation: "",
    college: "",
    degree: "",
    graduationYear: "",
    skills: "",
    experience: "",
    preferredRole: "",
    workMode: "",
    phone: "",
  });

  const [profileExists, setProfileExists] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Backend se existing profile fetch karna
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getStudentProfile();

        const profile =
          response.data?.profile ??
          response.data?.data?.profile ??
          response.data?.data ??
          response.data;

        if (profile && profile.fullName) {
          setFormData({
            fullName: profile.fullName || "",
            preferredLocation: profile.preferredLocation || "",
            college: profile.college || "",
            degree: profile.degree || "",
            graduationYear: profile.graduationYear
              ? String(profile.graduationYear)
              : "",
            skills: Array.isArray(profile.skills)
              ? profile.skills.join(", ")
              : profile.skills || "",
            experience: profile.experience || "",
            preferredRole: profile.preferredRole || "",
            workMode: profile.workMode || "",
            phone: profile.phone || "",
          });

          setProfileExists(true);
        }
      } catch (err) {
        if (err.response?.status === 401) {
          setError("Session expired. Please log in again.");
        } else if (err.response?.status !== 404) {
          setError(
            err.response?.data?.message ||
              "Could not load profile. Please try again."
          );
        }
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchProfile();
  }, []);

  // Input fields ki values update karna
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Profile save karna
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");
    setSaving(true);

    try {
      const profileData = {
        ...formData,
        graduationYear: Number(formData.graduationYear),
        skills: formData.skills
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean),
      };

      let response;

      if (profileExists) {
        response = await updateStudentProfile(profileData);
      } else {
        response = await createStudentProfile(profileData);
      }

      setProfileExists(true);

      setSuccess(
        response.data?.message || "Profile saved successfully!"
      );

      // Profile save hone ke baad dashboard par jaana
      setTimeout(() => {
        navigate("/student/dashboard");
      }, 800);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to save profile. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loadingProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-lg font-medium text-blue-700">
          Loading your profile...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 md:flex">
      {/* Left panel */}
      <div className="relative flex min-h-260px flex-col justify-center overflow-hidden bg-linear-to-br from-blue-700 via-blue-600 to-indigo-700 px-8 py-10 text-white md:min-h-screen md:w-5/12 md:px-12">
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-20 -left-12 h-64 w-64 rounded-full bg-indigo-300/20 blur-2xl" />

        <div className="relative z-10">
          <p className="mb-5 text-sm font-semibold uppercase tracking-[0.25em] text-blue-100">
            InternMatch AI
          </p>

          <h1 className="mb-5 text-3xl font-bold leading-tight md:text-5xl">
            Build your profile.
            <br />
            Find your future.
          </h1>

          <p className="max-w-md text-base leading-7 text-blue-100 md:text-lg">
            Tell us about your education, skills and career
            interests so you can discover opportunities that
            match your profile.
          </p>

          <div className="mt-8 rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur-md">
            <p className="font-semibold">
              Your next opportunity starts here.
            </p>
            <p className="mt-2 text-sm leading-6 text-blue-100">
              Keep your information accurate to get more
              relevant internship recommendations.
            </p>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex flex-1 items-center justify-center px-4 py-10 sm:px-8 md:px-12">
        <div className="w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/50 sm:p-9">
          <div className="mb-8">
            <p className="mb-2 text-sm font-semibold text-blue-600">
              STUDENT PROFILE
            </p>

            <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              Complete your profile
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Fill in your details to get started with
              internship opportunities.
            </p>
          </div>

          {error && (
            <div
              role="alert"
              className="mb-5 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"
            >
              {error}
            </div>
          )}

          {success && (
            <div
              role="status"
              className="mb-5 rounded-xl border border-green-200 bg-green-50 p-3 text-sm text-green-700"
            >
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full name */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Full name
              </label>

              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
            </div>

            {/* College and degree */}
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  College / University
                </label>

                <input
                  type="text"
                  name="college"
                  value={formData.college}
                  onChange={handleChange}
                  placeholder="Enter college name"
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Degree
                </label>

                <select
                  name="degree"
                  value={formData.degree}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                >
                  <option value="">Select degree</option>
                  <option value="B.Tech">B.Tech</option>
                  <option value="B.E.">B.E.</option>
                  <option value="BCA">BCA</option>
                  <option value="MCA">MCA</option>
                  <option value="B.Sc">B.Sc</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            {/* Graduation year and location */}
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Graduation year
                </label>

                <input
                  type="number"
                  name="graduationYear"
                  value={formData.graduationYear}
                  onChange={handleChange}
                  placeholder="e.g. 2029"
                  min="2020"
                  max="2040"
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Preferred location
                </label>

                <input
                  type="text"
                  name="preferredLocation"
                  value={formData.preferredLocation}
                  onChange={handleChange}
                  placeholder="e.g. Delhi, Remote"
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </div>
            </div>

            {/* Skills */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Skills
              </label>

              <input
                type="text"
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                placeholder="React, Python, SQL (comma separated)"
                required
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />

              <p className="mt-2 text-xs text-slate-500">
                Separate each skill with a comma.
              </p>
            </div>

            {/* Experience */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Experience
              </label>

              <select
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              >
                <option value="">Select experience</option>
                <option value="Fresher">Fresher</option>
                <option value="Less than 1 year">
                  Less than 1 year
                </option>
                <option value="1-2 years">1–2 years</option>
                <option value="2+ years">2+ years</option>
              </select>
            </div>

            {/* Preferred role and work mode */}
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Preferred role
                </label>

                <input
                  type="text"
                  name="preferredRole"
                  value={formData.preferredRole}
                  onChange={handleChange}
                  placeholder="e.g. Frontend Developer"
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Preferred work mode
                </label>

                <select
                  name="workMode"
                  value={formData.workMode}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                >
                  <option value="">Select work mode</option>
                  <option value="Remote">Remote</option>
                  <option value="On-site">On-site</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="Any">Any</option>
                </select>
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Phone number
              </label>

              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
                required
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={saving}
              className="w-full rounded-xl bg-blue-600 px-5 py-3.5 font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving
                ? "Saving profile..."
                : profileExists
                ? "Update profile"
                : "Save and continue"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
