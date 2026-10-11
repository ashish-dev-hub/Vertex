  import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  BriefcaseBusiness,
  Sparkles,
  GraduationCap,
  ArrowRight,
  Mail,
  LockKeyhole,
  Eye,
  EyeOff,
  Brain,
  Code2,
  Briefcase,
  BarChart3,
  Send,
} from "lucide-react";

import { login } from "../api/auth";
import { getStudentProfile } from "../api/studentProfile";
import { getRecruiterProfile } from "../api/recruiterProfile";
import { useToast } from "../context/ToastContext";
import SecurityAdvisoryModal from "../components/common/SecurityAdvisoryModal";

const Login = () => {
  const navigate = useNavigate();
  const { showSuccess, showError, showWarning } = useToast();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "student",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showSecurityModal, setShowSecurityModal] = useState(false);
  const [pendingRole, setPendingRole] = useState(null);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*\d).{8,}$/;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const proceedRedirect = async (roleToUse) => {
    const role = roleToUse || pendingRole || formData.role;
    if (role === "recruiter") {
      try {
        await getRecruiterProfile();
        navigate("/recruiter/dashboard");
      } catch {
        navigate("/recruiter/profile");
      }
    } else {
      try {
        await getStudentProfile();
        navigate("/student/dashboard");
      } catch {
        navigate("/student/profile");
      }
    }
  };

  const handleLogin = async (e) => {
    if (e && e.preventDefault) e.preventDefault();

    if (!emailRegex.test(formData.email)) {
      showWarning("Please enter a valid email address.", "Invalid Email");
      return;
    }

    if (!passwordRegex.test(formData.password)) {
      showWarning(
        "Password must be at least 8 characters and contain a number",
        "Invalid Password"
      );
      return;
    }

    try {
      setLoading(true);

      const response = await login({
        email: formData.email,
        password: formData.password,
        role: formData.role,
      });

      console.log("Login response:", response.data);
      const user = response.data.user;
      const userRole = user?.role || formData.role;
      localStorage.setItem("userRole", userRole);
      if (user?.name) localStorage.setItem("userName", user.name);
      if (user?.email) localStorage.setItem("userEmail", user.email);

      // Check if password has a commonly breached pattern
      const isCommonWeak = [
        "123456", "12345678", "password", "anuraj123", "anuraj", "admin123", "student123", "1234"
      ].some((w) => formData.password.toLowerCase().includes(w));

      if (isCommonWeak) {
        setPendingRole(userRole);
        setShowSecurityModal(true);
      } else {
        showSuccess("Login successful! Redirecting...", "Welcome Back");
        setTimeout(async () => {
          proceedRedirect(userRole);
        }, 500);
      }
    } catch (error) {
      console.log("Login error:", error);

      showError(
        error.response?.data?.message ||
          "Login failed. Please check your credentials.",
        "Authentication Error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 px-3 py-6 sm:px-6 lg:px-10 flex items-center justify-center">

      {/* Background decoration */}
      <div className="pointer-events-none absolute -left-32 top-10 h-80 w-80 rounded-full bg-blue-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-purple-300/40 blur-3xl" />
      <div className="pointer-events-none absolute left-[35%] top- -100px h-72 w-72 rounded-full bg-indigo-200/40 blur-3xl" />

      <div className="pointer-events-none absolute left- -80px top-[35%] h-72 w-72 rounded-full border-2 border-blue-200/50" />
      <div className="pointer-events-none absolute right- -100px top-[15%] h-80 w-80 rounded-full border-2 border-purple-200/50" />

      {/* Software Engineer floating card */}
      <div className="absolute left-6 top-10 z-20 hidden rotate-[-5deg] items-center gap-3 rounded-2xl border border-white/80 bg-white/90 px-5 py-3 shadow-xl backdrop-blur-md lg:flex">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50">
          <Code2 size={21} className="text-blue-600" />
        </div>

        <div>
          <p className="text-xs font-semibold text-slate-500">
            Software Engineer
          </p>
          <p className="text-sm font-bold text-emerald-600">
            92% Match
          </p>
        </div>

        <ArrowRight size={18} className="ml-2 text-blue-600" />
      </div>

     

      {/* Data Scientist floating card */}
      <div className="absolute bottom-10 right-8 z-20 hidden rotate-[-4deg] items-center gap-3 rounded-2xl border border-white/80 bg-white/90 px-5 py-3 shadow-xl backdrop-blur-md lg:flex">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50">
          <BarChart3 size={21} className="text-purple-600" />
        </div>

        <div>
          <p className="text-xs font-semibold text-slate-500">
            Data Scientist
          </p>
          <p className="text-sm font-bold text-emerald-600">
            94% Match
          </p>
        </div>

        <ArrowRight size={18} className="ml-2 text-purple-600" />
      </div>

      {/* Education floating item */}
      <div className="absolute bottom-24 left-8 z-10 hidden flex-col items-center gap-2 lg:flex">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-lg">
          <GraduationCap size={25} className="text-blue-600" />
        </div>

        <span className="text-sm font-semibold text-slate-500">
          Education
        </span>
      </div>

      {/* Main card */}
      <div className="relative z-10 mx-auto flex flex-col min-h-650px w-full max-w-6xl overflow-hidden rounded-[28px] border border-white/80 bg-white shadow-[0_25px_80px_rgba(37,99,235,0.18)] lg:flex-row">

        {/* LEFT SIDE */}
        <div className="relative hidden min-h-600px w-full overflow-hidden bg-blue-700 lg:flex lg:w-[55%]">

          <img
            src="https://plus.unsplash.com/premium_photo-1713296255442-e9338f42aad8?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aW1hZ2UlMjBncmFkdWF0aW9uJTIwY2FwJTIwdWRhdGElMjBodWFhJTIwbGFka2FhfGVufDB8fDB8fHww"
            alt="Graduation celebration"
            className="absolute inset-0 h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-b from-blue-900/95 via-blue-800/85 to-blue-700/70" />
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-blue-950/80 to-transparent" />

          <div className="absolute -left-32 -top-32 h-80 w-80 rounded-full border border-white/10" />
          <div className="absolute -right-32 top-20 h-96 w-96 rounded-full border border-white/10" />

          <div className="relative z-10 flex min-h-600px w-full flex-col justify-between p-8 sm:p-10 lg:p-12">

            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md">
                <BriefcaseBusiness size={24} className="text-white" />
              </div>

              <div>
                <h2 className="text-xl font-bold text-white">
                  InternMatch AI
                </h2>

                <p className="text-xs text-blue-100">
                  Find. Match. Grow.
                </p>
              </div>
            </div>

            {/* Main content */}
            <div className="max-w-xl">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-md">
                <GraduationCap size={17} />
                Your career journey starts here
              </div>

              <h1 className="text-4xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-[58px]">
                Find the right

                <span className="block text-blue-200">
                  opportunity
                </span>

                for your future.
              </h1>

              <p className="mt-5 max-w-xl text-sm leading-6 text-blue-100 sm:text-base sm:leading-7">
                Connect with internships and jobs that match your
                skills, education and career goals with AI-powered
                recommendations.
              </p>

              {/* Feature cards */}
              <div className="mt-7 flex flex-wrap gap-3">

                <div className="flex items-center gap-3 rounded-2xl border border-white/20 bg-white/10 px-4 py-3 backdrop-blur-md">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10">
                    <Sparkles size={18} className="text-yellow-300" />
                  </div>

                  <div>
                    <p className="text-[11px] text-blue-100">
                      AI Matching
                    </p>

                    <p className="text-xs font-bold text-white sm:text-sm">
                      Smart Job Recommendations
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-2xl border border-white/20 bg-white/10 px-4 py-3 backdrop-blur-md">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10">
                    <GraduationCap size={18} className="text-white" />
                  </div>

                  <div>
                    <p className="text-[11px] text-blue-100">
                      Built for Students
                    </p>

                    <p className="text-xs font-bold text-white sm:text-sm">
                      Start Your Career
                    </p>
                  </div>
                </div>

              </div>
            </div>

            {/* Bottom */}
            <div className="flex items-center justify-between text-sm text-blue-100">
              <span>
                Discover opportunities made for you.
              </span>

              <ArrowRight size={18} />
            </div>
          </div>
        </div>

        {/* RIGHT SIDE - LOGIN */}
        <div className="flex w-full items-center justify-center bg-white px-5 py-8 sm:px-10 lg:w-[45%] lg:px-12">

          <div className="w-full max-w-md">

            {/* Mobile Brand Header */}
            <div className="mb-6 flex items-center gap-3 lg:hidden">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 shadow-sm">
                <BriefcaseBusiness size={20} className="text-white" />
              </div>
              <span className="text-lg font-bold text-slate-900">
                InternMatch <span className="text-blue-600">AI</span>
              </span>
            </div>

            <div className="mb-8">
              <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                Welcome Back
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                Login to continue your career journey.
              </p>
            </div>

            <div onKeyDown={(e) => { if (e.key === "Enter") handleLogin(e); }}>

              {/* ROLE */}
              <div className="mb-5">
                <label className="mb-2 block text-sm font-bold text-slate-800">
                  Login as
                </label>

                <div className="relative">
                  <Briefcase
                    size={18}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-3.5 pl-11 pr-4 text-sm font-medium text-slate-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  >
                    <option value="student">
                      Student
                    </option>

                    <option value="recruiter">
                      Recruiter
                    </option>
                  </select>
                </div>
              </div>

              {/* EMAIL */}
              <div className="mb-5">
                <label className="mb-2 block text-sm font-bold text-slate-800">
                  Email Address
                </label>

                <div className="relative">
                  <Mail
                    size={18}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    autoComplete="off"
                    data-form-type="other"
                    className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-11 pr-4 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  />
                </div>
              </div>

              {/* PASSWORD */}
              <div className="mb-7">
                <label className="mb-2 block text-sm font-bold text-slate-800">
                  Password
                </label>

                <div className="relative">
                  <LockKeyhole
                    size={18}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    autoComplete="new-password"
                    data-form-type="other"
                    className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-11 pr-12 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700"
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              {/* LOGIN BUTTON */}
              <button
                type="button"
                onClick={handleLogin}
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-500/25 transition duration-200 hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
              >
                {loading ? (
                  "Logging in..."
                ) : (
                  <>
                    Login
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </div>

            {/* SIGNUP */}
            <p className="mt-7 text-center text-sm text-slate-500">
              Don't have an account?{" "}

              <button
                type="button"
                onClick={() => navigate("/signup")}
                className="font-bold text-blue-600 transition hover:text-blue-700 hover:underline"
              >
                Sign up
              </button>
            </p>

            {/* INFO */}
            <div className="mt-8 flex items-start gap-3 rounded-xl bg-blue-50 px-4 py-4">
              <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white">
                <Sparkles size={17} className="text-blue-600" />
              </div>

              <p className="text-xs leading-5 text-slate-500">
                Find internships and jobs that match your skills
                with AI-powered recommendations.
              </p>
            </div>

          </div>
        </div>
      </div>

      {/* Mobile bottom text */}
      <div className="relative z-10 mt-5 flex items-center justify-center gap-2 text-xs text-slate-500 lg:hidden">
        <Send size={13} />
        Smart career opportunities powered by AI
      </div>

      {/* Security Advisory Modal */}
      <SecurityAdvisoryModal
        isOpen={showSecurityModal}
        email={formData.email}
        onClose={() => {
          setShowSecurityModal(false);
          proceedRedirect(pendingRole);
        }}
        onContinue={() => {
          setShowSecurityModal(false);
          proceedRedirect(pendingRole);
        }}
      />
    </div>
  );
};

export default Login;
