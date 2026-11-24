import { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import {
    Lock,
    Eye,
    EyeOff,
    ArrowLeft,
    CheckCircle,
} from "lucide-react";

import AuthLayout from "../layouts/AuthLayout";
import api from "../api/axios";

function ResetPassword() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const token = searchParams.get("token");

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!token) {
            setError("Invalid password reset link.");
            return;
        }

        if (newPassword.length < 8) {
            setError("Password must contain at least 8 characters.");
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        try {
            setLoading(true);

            await api.post("/auth/reset-password", {
                token,
                newPassword,
            });

            setSuccess(true);

        } catch (err) {
            setError(
                err.response?.data?.message ||
                (typeof err.response?.data === "string"
                    ? err.response.data
                    : "Unable to reset password. Your link may have expired.")
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout
            title="Create New Password"
            subtitle="Choose a strong password for your Retrievo account."
        >
            {!token ? (
                <div className="text-center space-y-4">
                    <p className="text-red-600 text-sm">
                        Invalid password reset link. Please request a new one.
                    </p>

                    <Link
                        to="/forgot-password"
                        className="text-[#253b35] font-semibold hover:underline"
                    >
                        Request another reset link
                    </Link>
                </div>
            ) : success ? (
                <div className="text-center space-y-5">

                    <div className="flex justify-center">
                        <CheckCircle
                            size={55}
                            className="text-[#253b35]"
                        />
                    </div>

                    <h3 className="text-xl font-bold text-gray-800">
                        Password Reset Successful!
                    </h3>

                    <p className="text-sm text-gray-500 leading-relaxed">
                        Your password has been changed successfully.
                        You can now log in using your new password.
                    </p>

                    <button
                        onClick={() => navigate("/login")}
                        className="w-full bg-[#253b35] hover:bg-[#344d44] text-white py-3.5 rounded-xl font-semibold transition"
                    >
                        Go to Login
                    </button>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-5">

                    {/* New Password */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            New Password
                        </label>

                        <div className="relative">
                            <Lock
                                size={19}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                            />

                            <input
                                type={showPassword ? "text" : "password"}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="Enter new password"
                                required
                                minLength={8}
                                className="w-full border border-gray-200 bg-white rounded-xl py-3.5 pl-12 pr-12 outline-none focus:border-[#253b35] focus:ring-2 focus:ring-[#253b35]/10 transition"
                            />

                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
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
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Confirm New Password
                        </label>

                        <div className="relative">
                            <Lock
                                size={19}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                            />

                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirm new password"
                                required
                                className="w-full border border-gray-200 bg-white rounded-xl py-3.5 pl-12 pr-12 outline-none focus:border-[#253b35] focus:ring-2 focus:ring-[#253b35]/10 transition"
                            />

                            <button
                                type="button"
                                onClick={() =>
                                    setShowConfirmPassword(!showConfirmPassword)
                                }
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                            >
                                {showConfirmPassword ? (
                                    <EyeOff size={19} />
                                ) : (
                                    <Eye size={19} />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <p className="text-red-600 text-sm text-center">
                            {error}
                        </p>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#253b35] hover:bg-[#344d44] disabled:opacity-60 text-white py-3.5 rounded-xl font-semibold transition duration-200"
                    >
                        {loading ? "Resetting Password..." : "Reset Password"}
                    </button>

                </form>
            )}

            <div className="mt-8 text-center">
                <Link
                    to="/login"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-[#253b35] hover:underline"
                >
                    <ArrowLeft size={17} />
                    Back to Login
                </Link>
            </div>

        </AuthLayout>
    );
}

export default ResetPassword;