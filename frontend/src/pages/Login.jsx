 import React, { useState } from "react";
import {
  ArrowLeft,
  BriefcaseBusiness,
  GraduationCap,
  Eye,
  EyeOff,
} from "lucide-react";

import { Link } from "react-router-dom";

const Login = () => {

  const [role, setRole] = useState("student");
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50">

      {/* NAVBAR */}
      <nav className="flex h-16 items-center border-b border-slate-200 bg-white px-6">

        <Link to="/" className="flex items-center gap-2">

          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600">
            <BriefcaseBusiness size={20} className="text-white" />
          </div>

          <span className="text-xl font-bold text-slate-900">
            InternMatch
            <span className="text-blue-600"> AI</span>
          </span>

        </Link>

      </nav>

      {/* MAIN */}
      <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-6 py-12">

        <div className="w-full max-w-md">

          {/* BACK */}
          <Link
            to="/"
            className="mb-6 flex items-center gap-2 text-sm text-slate-500 hover:text-blue-600"
          >
            <ArrowLeft size={17} />
            Back
          </Link>

          {/* HEADING */}
          <div className="mb-8 text-center">

            <h1 className="text-3xl font-bold text-slate-900">
              Welcome back
            </h1>

            <p className="mt-2 text-slate-500">
              Login to continue to InternMatch AI
            </p>

          </div>

          {/* LOGIN CARD */}
          <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">

            {/* ROLE */}
            <div className="mb-7">

              <p className="mb-3 text-sm font-semibold text-slate-700">
                Login as
              </p>

              <div className="grid grid-cols-2 gap-3">

                {/* STUDENT */}
                <button
                  onClick={() => setRole("student")}
                  className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition ${
                    role === "student"
                      ? "border-blue-600 bg-blue-50 text-blue-600"
                      : "border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <GraduationCap size={19} />
                  Student
                </button>

                {/* RECRUITER */}
                <button
                  onClick={() => setRole("recruiter")}
                  className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition ${
                    role === "recruiter"
                      ? "border-blue-600 bg-blue-50 text-blue-600"
                      : "border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <BriefcaseBusiness size={18} />
                  Recruiter
                </button>

              </div>

            </div>

            {/* EMAIL */}
            <div className="mb-5">

              <label className="mb-2 block text-sm font-medium text-slate-700">
                Email address
              </label>

              <input
                type="email"
                placeholder="you@example.com"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />

            </div>

            {/* PASSWORD */}
            <div className="mb-6">

              <div className="mb-2 flex items-center justify-between">

                <label className="text-sm font-medium text-slate-700">
                  Password
                </label>

                <button className="text-xs font-medium text-blue-600 hover:underline">
                  Forgot password?
                </button>

              </div>

              <div className="relative">

                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 pr-11 text-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? (
                    <EyeOff size={19} />
                  ) : (
                    <Eye size={19} />
                  )}
                </button>

              </div>

            </div>

            {/* LOGIN BUTTON */}
            <button className="w-full rounded-xl bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700">
              Login as {role === "student" ? "Student" : "Recruiter"}
            </button>

            {/* SIGNUP */}
            <p className="mt-6 text-center text-sm text-slate-500">

              Don't have an account?{" "}

              <Link
                to="/signup"
                className="font-semibold text-blue-600 hover:underline"
              >
                Create account
              </Link>

            </p>

          </div>

        </div>

      </main>

    </div>
  );
};

export default Login;