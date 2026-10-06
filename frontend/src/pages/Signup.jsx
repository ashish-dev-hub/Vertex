import React, { useState } from "react";
import { BriefcaseBusiness, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();

  const [role, setRole] = useState("student");
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignup = (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    console.log("Signup Data:", {
      role,
      ...formData,
    });

    if (role === "student") {
      alert("Student account created successfully!");
    } else {
      alert("Recruiter account created successfully!");
    }

    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      
      {/* Navbar */}
      <nav className="w-full border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600">
              <BriefcaseBusiness size={20} className="text-white" />
            </div>

            <span className="text-xl font-bold text-slate-900">
              InternMatch<span className="text-blue-600"> AI</span>
            </span>
          </Link>

          <Link
            to="/login"
            className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-600"
          >
            <ArrowLeft size={17} />
            Back to Login
          </Link>

        </div>
      </nav>

      {/* Signup Section */}
      <div className="flex min-h-[calc(100vh-64px)] items-center justify-center px-4 py-10">
        
        <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          
          {/* Heading */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-slate-900">
              Create your account
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Join InternMatch AI and find the right opportunities
            </p>
          </div>

          {/* Role Selection */}
          <div className="mb-7">
            <p className="mb-3 text-sm font-semibold text-slate-700">
              I am a
            </p>

            <div className="grid grid-cols-2 gap-3">
              
              <button
                type="button"
                onClick={() => setRole("student")}
                className={`rounded-xl border px-4 py-4 text-left transition ${
                  role === "student"
                    ? "border-blue-600 bg-blue-50 ring-1 ring-blue-600"
                    : "border-slate-200 hover:border-blue-300"
                }`}
              >
                <p className="font-semibold text-slate-900">
                  Student
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Find internships & jobs
                </p>
              </button>

              <button
                type="button"
                onClick={() => setRole("recruiter")}
                className={`rounded-xl border px-4 py-4 text-left transition ${
                  role === "recruiter"
                    ? "border-blue-600 bg-blue-50 ring-1 ring-blue-600"
                    : "border-slate-200 hover:border-blue-300"
                }`}
              >
                <p className="font-semibold text-slate-900">
                  Recruiter
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Hire talented students
                </p>
              </button>

            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSignup} className="space-y-5">
            
            {/* Name */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Full Name
              </label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Email */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Email Address
              </label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Password */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Password
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a password"
                  required
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 pr-12 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                >
                  {showPassword ? (
                    <EyeOff size={19} />
                  ) : (
                    <Eye size={19} />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Confirm Password
              </label>

              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                required
                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Signup Button */}
            <button
              type="submit"
              className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700"
            >
              Create Account
            </button>

          </form>

          {/* Login */}
          <p className="mt-6 text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-blue-600 hover:text-blue-700"
            >
              Login
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
};

export default Signup;