import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import AuthLayout from "../layouts/AuthLayout";
import api from "../api/axios";

function Login() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [rememberMe, setRememberMe] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    try {
      setLoading(true);

      const response = await api.post("/auth/login", formData);

      const { token, userId, fullName, email, role } = response.data;

      // Store logged-in user details
      const user = {
        userId,
        fullName,
        email,
        role,
      };

      // Clear any previous login data
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");

      // Save according to Remember Me selection
      const storage = rememberMe ? localStorage : sessionStorage;

      storage.setItem("token", token);
      storage.setItem("user", JSON.stringify(user));

      alert("Login successful!");

      if (role === "ADMIN") {
        navigate("/admin/dashboard");
      } else {
        navigate("/dashboard");
      }

    } catch (err) {
      const message =
        err.response?.data?.message ||
        "Login failed. Please check your credentials.";

      setError(message);

    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to continue your campus journey."
    >
      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Email */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            College Email Address
          </label>

          <div className="relative">
            <Mail
              size={19}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@college.edu"
              required
              className="w-full border border-gray-200 bg-white rounded-xl py-3.5 pl-12 pr-4 outline-none focus:border-[#253b35] focus:ring-2 focus:ring-[#253b35]/10 transition"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Password
          </label>

          <div className="relative">
            <Lock
              size={19}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
              className="w-full border border-gray-200 bg-white rounded-xl py-3.5 pl-12 pr-12 outline-none focus:border-[#253b35] focus:ring-2 focus:ring-[#253b35]/10 transition"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
            </button>
          </div>
        </div>

        {/* Remember and Forgot Password */}
        <div className="flex items-center justify-between text-sm">

          <label className="flex items-center gap-2 text-gray-600">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="accent-[#253b35]"
            />
            Remember me
          </label>

          <Link
            to="/forgot-password"
            className="text-[#253b35] font-semibold hover:underline"
          >
            Forgot password?
          </Link>

        </div>

        {/* Error Message */}
        {error && (
          <p className="text-red-600 text-sm text-center">
            {error}
          </p>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#253b35] hover:bg-[#344d44] disabled:opacity-60 text-white py-3.5 rounded-xl font-semibold transition duration-200"
        >
          {loading ? "Signing In..." : "Sign In →"}
        </button>

      </form>

      {/* Register Link */}
      <p className="text-center text-sm text-gray-500 mt-8">
        Don't have an account?{" "}
        <Link
          to="/register"
          className="text-[#253b35] font-bold hover:underline"
        >
          Create account
        </Link>
      </p>

    </AuthLayout>
  );
}

export default Login;