import { useState } from "react";
import { Link ,useNavigate} from "react-router-dom";
import { User, Mail, Lock, Eye, EyeOff, IdCard } from "lucide-react";
import AuthLayout from "../layouts/AuthLayout";
import api from "../api/axios";

function Register() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    studentId: "",
    department: "",
    academicYear: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      setLoading(true);

      const registrationData = {
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        department: formData.department,
        academicYear: Number(formData.academicYear),
      };

       await api.post(
        "/auth/register",
        registrationData
      );

      alert("Registration successful! Please login.");

      navigate("/login");

    } catch (err) {
      const message =
        err.response?.data?.message ||
        "Registration failed. Please try again.";

      setError(message);

    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create an account"
      subtitle="Join your campus community and help lost things find their way home."
    >
      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Full Name */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Full Name
          </label>

          <div className="relative">
            <User
              size={19}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
              className="w-full border border-gray-200 bg-white rounded-xl py-3 pl-12 pr-4 outline-none focus:border-[#253b35] focus:ring-2 focus:ring-[#253b35]/10 transition"
            />
          </div>
        </div>

        {/* College Email */}
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
              className="w-full border border-gray-200 bg-white rounded-xl py-3 pl-12 pr-4 outline-none focus:border-[#253b35] focus:ring-2 focus:ring-[#253b35]/10 transition"
            />
          </div>
        </div>

        {/* Student ID */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Student ID
          </label>

          <div className="relative">
            <IdCard
              size={19}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              name="studentId"
              value={formData.studentId}
              onChange={handleChange}
              placeholder="Enter your college ID"
              required
              className="w-full border border-gray-200 bg-white rounded-xl py-3 pl-12 pr-4 outline-none focus:border-[#253b35] focus:ring-2 focus:ring-[#253b35]/10 transition"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Department
          </label>

          <input
            type="text"
            name="department"
            value={formData.department}
            onChange={handleChange}
            placeholder="e.g. Computer Science"
            required
            className="w-full border border-gray-200 bg-white rounded-xl py-3 px-4 outline-none focus:border-[#253b35] focus:ring-2 focus:ring-[#253b35]/10 transition"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Academic Year
          </label>

          <select
            name="academicYear"
            value={formData.academicYear}
            onChange={handleChange}
            required
            className="w-full border border-gray-200 bg-white rounded-xl py-3 px-4 outline-none focus:border-[#253b35] focus:ring-2 focus:ring-[#253b35]/10 transition"
          >
            <option value="">Select academic year</option>
            <option value="1">1st Year</option>
            <option value="2">2nd Year</option>
            <option value="3">3rd Year</option>
            <option value="4">4th Year</option>
          </select>
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
              placeholder="Create a password"
              required
              minLength={8}
              className="w-full border border-gray-200 bg-white rounded-xl py-3 pl-12 pr-12 outline-none focus:border-[#253b35] focus:ring-2 focus:ring-[#253b35]/10 transition"
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

        {/* Confirm Password */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Confirm Password
          </label>

          <div className="relative">
            <Lock
              size={19}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Re-enter your password"
              required
              minLength={8}
              className="w-full border border-gray-200 bg-white rounded-xl py-3 pl-12 pr-4 outline-none focus:border-[#253b35] focus:ring-2 focus:ring-[#253b35]/10 transition"
            />
          </div>
        </div>

        {/* Terms */}
        <label className="flex items-start gap-2 text-sm text-gray-500 pt-1">
          <input
            type="checkbox"
            required
            className="mt-1 accent-[#253b35]"
          />
          <span>
            I agree to the terms and conditions of Retrievo.
          </span>
        </label>

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
          {loading ? "Creating Account..." : "Create Account →"}
        </button>

      </form>

      <p className="text-center text-sm text-gray-500 mt-6">
        Already have an account?{" "}
        <Link
          to="/login"
          className="text-[#253b35] font-bold hover:underline"
        >
          Sign in
        </Link>
      </p>

    </AuthLayout>
  );
}

export default Register;