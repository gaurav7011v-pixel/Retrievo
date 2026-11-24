import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft, Send, CheckCircle } from "lucide-react";
import AuthLayout from "../layouts/AuthLayout";
import api from "../api/axios";

function ForgotPassword() {

    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess(false);

        try {
            setLoading(true);

            await api.post("/auth/forgot-password", {
                email: email.trim()
            });

            setSuccess(true);

        } catch (err) {

            setError(
                err.response?.data?.message ||
                "Unable to process your request. Please try again later."
            );

        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout
            title="Forgot your password?"
            subtitle="Don't worry. We'll help you get back into your account."
        >

            {!success ? (

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
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@college.edu"
                                required
                                className="w-full border border-gray-200 bg-white rounded-xl py-3.5 pl-12 pr-4 outline-none focus:border-[#253b35] focus:ring-2 focus:ring-[#253b35]/10 transition"
                            />

                        </div>

                    </div>

                    {/* Error */}
                    {error && (
                        <p className="text-red-600 text-sm text-center">
                            {error}
                        </p>
                    )}

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#253b35] hover:bg-[#344d44] disabled:opacity-60 text-white py-3.5 rounded-xl font-semibold transition duration-200 flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            "Sending..."
                        ) : (
                            <>
                                Send Reset Link
                                <Send size={17} />
                            </>
                        )}
                    </button>

                </form>

            ) : (

                /* Success Message */
                <div className="text-center space-y-4">

                    <div className="flex justify-center">
                        <CheckCircle
                            size={55}
                            className="text-[#253b35]"
                        />
                    </div>

                    <h3 className="text-lg font-bold text-gray-800">
                        Check Your Email
                    </h3>

                    <p className="text-sm text-gray-500 leading-relaxed">
                        If an account exists with this email address,
                        a password reset link has been sent.
                        Please check your inbox.
                    </p>

                    <button
                        onClick={() => {
                            setSuccess(false);
                            setEmail("");
                        }}
                        className="text-[#253b35] font-semibold text-sm hover:underline"
                    >
                        Try another email
                    </button>

                </div>

            )}

            {/* Back to Login */}
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

export default ForgotPassword;