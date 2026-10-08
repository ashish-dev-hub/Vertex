 import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api/auth";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
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

  const handleLogin = async (e) => {
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

    try {
      setLoading(true);

      const response = await login({
        email: formData.email,
        password: formData.password,
        role: formData.role,
      });

      console.log("Login response:", response.data);

      alert("Login successful");

      // Backend response me user.role check
      const user = response.data.user;

      if (user?.role === "recruiter") {
        navigate("/recruiter/dashboard");
      } else if (user?.role === "student") {
        navigate("/student/dashboard");
      } else {
        // Fallback
        if (formData.role === "recruiter") {
          navigate("/recruiter/dashboard");
        } else {
          navigate("/student/dashboard");
        }
      }
    } catch (error) {
      console.log("Login error:", error);

      alert(
        error.response?.data?.message ||
          "Login failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg border border-gray-200"
      >
        <h1 className="text-center text-2xl font-bold text-gray-900 mb-6">
          WELCOME BACK
        </h1>

        {/* Role */}
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="w-full mb-4 p-3 rounded-lg bg-white text-gray-900 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="student">Student</option>
          <option value="recruiter">Recruiter</option>
        </select>

        {/* Email */}
        <input
          type="email"
          name="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full mb-4 p-3 rounded-lg bg-white text-gray-900 border border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Password */}
        <input
          type="password"
          name="password"
          placeholder="Enter password"
          value={formData.password}
          onChange={handleChange}
          required
          className="w-full mb-6 p-3 rounded-lg bg-white text-gray-900 border border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Login Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full p-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* Signup Link jb aapke paas account n ho  */}
        <p className="text-center text-gray-600 mt-5">
          Don't have an account?{" "}
          <button
            type="button"
            onClick={() => navigate("/signup")}
            className="text-blue-600 font-semibold hover:underline"
          >
            Sign up
          </button>
        </p>
      </form>
    </div>
  );
};

export default Login;