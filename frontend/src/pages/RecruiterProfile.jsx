
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getRecruiterProfile,
  createRecruiterProfile,
  updateRecruiterProfile,
} from "../api/recruiterProfile";

const RecruiterProfile = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    companyName: "",
    companyDescription: "",
    industry: "",
    companyWebsite: "",
    companyLocation: "",
    phone: "",
  });

  const [profileExists, setProfileExists] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loadFailed, setLoadFailed] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isForbidden, setIsForbidden] = useState(false);

  // Page open hote hi existing profile fetch karo
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getRecruiterProfile();

        const profile =
          response.data?.profile ??
          response.data?.data?.profile ??
          response.data?.data ??
          response.data;

        if (profile?.companyName) {
          setFormData({
            companyName: profile.companyName || "",
            companyDescription:
              profile.companyDescription || "",
            industry: profile.industry || "",
            companyWebsite: profile.companyWebsite || "",
            companyLocation: profile.companyLocation || "",
            // Backend model field is 'phone', not 'phoneNumber'
            phone: profile.phone || "",
          });

          setProfileExists(true);
        }
      } catch (err) {
        const status = err.response?.status;

        if (status === 404) {
          // Profile nahi mili; nayi profile bhar sakte hain
          setProfileExists(false);
        } else if (status === 403) {
          setIsForbidden(true);
          setLoadFailed(true);
          setError(
            err.response?.data?.message ||
              "You are not authorized to access recruiter profile."
          );
        } else {
          // Network/server/auth error mein POST allow mat karo
          setLoadFailed(true);
          setError(
            err.response?.data?.message ||
              "Could not load your profile. Please try again."
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Input values update karo
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Create ya update profile
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");
    setSaving(true);

    try {
      const profileData = {
        companyName: formData.companyName.trim(),
        companyDescription: formData.companyDescription.trim(),
        industry: formData.industry,
        companyWebsite: formData.companyWebsite.trim(),
        companyLocation: formData.companyLocation.trim(),
        // Backend model field is 'phone', not 'phoneNumber'
        phone: formData.phone.trim(),
      };

      let response;

      if (profileExists) {
        response = await updateRecruiterProfile(profileData);
      } else {
        response = await createRecruiterProfile(profileData);
      }

      setSuccess(
        response.data?.message ||
          "Recruiter profile saved successfully!"
      );

      // Save successful hone par dashboard kholo
      navigate("/recruiter/dashboard", { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Could not save profile. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="font-medium text-blue-700">
          Loading recruiter profile...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 md:flex">
      {/* Left branding panel */}
      <section className="relative flex flex-col justify-center overflow-hidden bg-linear-to-br from-blue-700 via-blue-600 to-indigo-800 px-8 py-10 text-white md:min-h-screen md:w-5/12 md:px-12">
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-16 -left-12 h-64 w-64 rounded-full bg-indigo-300/20 blur-2xl" />

        <div className="relative z-10">
          <p className="mb-6 text-sm font-bold uppercase tracking-[0.25em] text-blue-100">
            InternMatch AI
          </p>

          <h1 className="text-4xl font-bold leading-tight md:text-5xl">
            Build your team.
            <br />
            Find the right talent.
          </h1>

          <p className="mt-6 max-w-md leading-7 text-blue-100">
            Set up your company profile to connect with
            students and discover candidates for your
            internship and job opportunities.
          </p>

          <div className="mt-10 rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur-md">
            <p className="font-semibold">
              Your company, your next opportunity.
            </p>

            <p className="mt-2 text-sm leading-6 text-blue-100">
              A complete profile helps students understand
              your organisation and its opportunities.
            </p>
          </div>
        </div>
      </section>

      {/* Right form panel */}
      <main className="flex flex-1 items-center justify-center px-4 py-10 sm:px-8 md:px-12">
        <div className="w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/50 sm:p-9">
          <div className="mb-8 flex items-start justify-between gap-4">
            <div>
              <p className="mb-2 text-sm font-bold tracking-widest text-blue-600">
                RECRUITER SETUP
              </p>

              <h2 className="text-3xl font-bold text-slate-900">
                Company profile
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Tell us about your company to get started.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                localStorage.removeItem("token");
                navigate("/login");
              }}
              className="shrink-0 rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition"
            >
              Log out
            </button>
          </div>

          {isForbidden ? (
            <div className="mb-6 rounded-2xl border border-amber-300 bg-amber-50 p-5 text-amber-900 shadow-sm">
              <div className="flex items-start gap-3">
                <span className="text-2xl">⚠️</span>
                <div className="flex-1">
                  <h4 className="font-bold text-amber-950">
                    Role Mismatch (Account Unauthorized)
                  </h4>
                  <p className="mt-1 text-sm text-amber-800 leading-relaxed">
                    Aapka current account <strong>Student</strong> role ka hai, isliye Recruiter Profile access nahi ho sakta.
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2.5">
                    <button
                      type="button"
                      onClick={() => navigate("/student/profile")}
                      className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 transition"
                    >
                      Go to Student Profile
                    </button>
                    <button
                      type="button"
                      onClick={() => navigate("/student/dashboard")}
                      className="rounded-xl border border-blue-300 bg-blue-50 px-4 py-2 text-xs font-semibold text-blue-700 hover:bg-blue-100 transition"
                    >
                      Student Dashboard
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        localStorage.removeItem("token");
                        navigate("/login");
                      }}
                      className="rounded-xl border border-amber-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                    >
                      Logout & Switch to Recruiter
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : error ? (
            <div
              role="alert"
              className="mb-5 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"
            >
              {error}
            </div>
          ) : null}

          {success && (
            <div
              role="status"
              className="mb-5 rounded-xl border border-green-200 bg-green-50 p-3 text-sm text-green-700"
            >
              {success}
            </div>
          )}

          {loadFailed && !isForbidden ? (
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="w-full rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
            >
              Retry loading profile
            </button>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Company name */}
              <div>
                <label
                  htmlFor="companyName"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Company Name <span className="text-red-500">*</span>
                </label>

                <input
                  id="companyName"
                  name="companyName"
                  type="text"
                  value={formData.companyName}
                  onChange={handleChange}
                  placeholder="Enter company name"
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </div>

              {/* Company description */}
              <div>
                <label
                  htmlFor="companyDescription"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Company Description
                </label>

                <textarea
                  id="companyDescription"
                  name="companyDescription"
                  value={formData.companyDescription}
                  onChange={handleChange}
                  placeholder="Tell students about your company"
                  rows={4}
                  className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </div>

              {/* Industry */}
              <div>
                <label
                  htmlFor="industry"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Industry
                </label>

                <select
                  id="industry"
                  name="industry"
                  value={formData.industry}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                >
                  <option value="">Select industry</option>
                  <option value="Information Technology">
                    Information Technology
                  </option>
                  <option value="Education">Education</option>
                  <option value="Finance">Finance</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="E-commerce">E-commerce</option>
                  <option value="Manufacturing">Manufacturing</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Website and location */}
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="companyWebsite"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Company Website
                  </label>

                  <input
                    id="companyWebsite"
                    name="companyWebsite"
                    type="url"
                    value={formData.companyWebsite}
                    onChange={handleChange}
                    placeholder="https://example.com"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label
                    htmlFor="companyLocation"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Company Location
                  </label>

                  <input
                    id="companyLocation"
                    name="companyLocation"
                    type="text"
                    value={formData.companyLocation}
                    onChange={handleChange}
                    placeholder="e.g. Delhi, India"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label
                  htmlFor="phone"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Phone Number
                </label>

                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter company contact number"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </div>


              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 w-full rounded-xl bg-blue-600 px-5 py-3.5 font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving
                    ? "Saving profile..."
                    : profileExists
                    ? "Update Profile"
                    : "Save Profile & Continue"}
                </button>

                {profileExists && (
                  <button
                    type="button"
                    onClick={() => navigate("/recruiter/dashboard")}
                    className="flex-1 w-full rounded-xl bg-slate-100 px-5 py-3.5 font-semibold text-slate-700 transition hover:bg-slate-200 focus:outline-none focus:ring-4 focus:ring-slate-200"
                  >
                    Go to Dashboard
                  </button>
                )}
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  );
};

export default RecruiterProfile;

