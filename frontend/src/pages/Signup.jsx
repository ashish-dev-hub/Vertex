 
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  User,
  Mail,
  LockKeyhole,
  ShieldCheck,
  UserRound,
  UserPlus,
  ArrowRight,
} from "lucide-react";

import { signup } from "../api/auth";

const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "student",
  });

  const [loading, setLoading] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*\d).{8,}$/;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!emailRegex.test(formData.email)) {
      alert("Please enter a valid email");
      return;
    }

    if (!passwordRegex.test(formData.password)) {
      alert(
        "Password must be at least 8 characters and contain a number"
      );
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const response = await signup({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      });

      console.log("Signup response:", response.data);

      alert("Signup successful! Please login.");

      // Student aur Recruiter dono same login page par jayenge
      navigate("/login");
    } catch (error) {
      console.log("Signup error:", error);

      alert(
        error.response?.data?.message ||
          "Signup failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl min-h-650px overflow-hidden rounded-3xl bg-white shadow-2xl flex flex-col lg:flex-row">

        {/* LEFT SIDE - SIGNUP FORM */}
        <div className="w-full lg:w-[45%] flex items-center justify-center bg-white px-6 py-10 sm:px-10 lg:px-12">
          <div className="w-full max-w-md">

            {/* Heading */}
            <div className="mb-7">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50">
                <UserPlus
                  size={24}
                  className="text-blue-600"
                />
              </div>

              <h1 className="text-3xl font-bold text-slate-900">
                Create Account
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                Join InternMatch AI and find the right opportunity
                for your career.
              </p>
            </div>

            {/* FORM */}
            <form onSubmit={handleSignup}>

              {/* ROLE */}
              <div className="mb-4">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Register as
                </label>

                <div className="relative">
                  <UserRound
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                  />

                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full appearance-none rounded-xl border border-slate-300 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  >
                    <option value="student">Student</option>
                    <option value="recruiter">Recruiter</option>
                  </select>
                </div>
              </div>

              {/* NAME */}
              <div className="mb-4">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Full Name
                </label>

                <div className="relative">
                  <User
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="text"
                    name="name"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  />
                </div>
              </div>

              {/* EMAIL */}
              <div className="mb-4">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Email Address
                </label>

                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  />
                </div>
              </div>

              {/* PASSWORD */}
              <div className="mb-4">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Password
                </label>

                <div className="relative">
                  <LockKeyhole
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="password"
                    name="password"
                    placeholder="Enter password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  />
                </div>
              </div>

              {/* CONFIRM PASSWORD */}
              <div className="mb-6">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Confirm Password
                </label>

                <div className="relative">
                  <ShieldCheck
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  />
                </div>
              </div>

              {/* SIGNUP BUTTON */}
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? (
                  "Creating Account..."
                ) : (
                  <>
                    Create Account
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            {/* LOGIN LINK */}
            <p className="mt-6 text-center text-sm text-slate-500">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="font-semibold text-blue-600 hover:text-blue-700 hover:underline"
              >
                Login
              </button>
            </p>

          </div>
        </div>

        {/* RIGHT SIDE - IMAGE */}
        <div className="relative hidden min-h-650px overflow-hidden lg:block lg:w-[55%]">

          <img
            src="https://images.unsplash.com/vector-1788230742198-1bf35c2fc17c?w=900&auto=format&fit=crop&q=60"
            alt="Create your account"
            className="absolute inset-0 h-full w-full object-cover"
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-slate-900/20" />

          {/* CONTENT OVER IMAGE */}
          <div className="relative z-10 flex h-full flex-col justify-between p-10">

            {/* LOGO */}
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/20 bg-white/20 backdrop-blur-md">
                <UserPlus
                  size={23}
                  className="text-white"
                />
              </div>

              <div>
                <h2 className="text-xl font-bold text-white">
                  InternMatch AI
                </h2>

                <p className="text-xs text-white/80">
                  Find. Match. Grow.
                </p>
              </div>
            </div>

            {/* BOTTOM TEXT */}
            <div className="max-w-lg">
              <div className="mb-4 inline-flex items-center rounded-full border border-white/20 bg-white/15 px-4 py-2 text-sm font-medium text-white backdrop-blur-md">
                Start your journey
              </div>

              <h2 className="text-4xl font-extrabold leading-tight text-blue-600">
                Your next
                <span className="block text-green-500">
                  opportunity
                </span>
                starts here.
              </h2>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default Signup;