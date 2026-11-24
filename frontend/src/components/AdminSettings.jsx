import { useEffect, useState } from "react";
import AdminLayout from "../layouts/AdminLayout";
import {
  getUserProfile,
  updateUserProfile,
  changePassword,
} from "../api/userService";

import {
  User,
  Lock,
  ShieldCheck,
  Save,
  Eye,
  EyeOff,
} from "lucide-react";

const AdminSettings = () => {
  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    department: "",
    academicYear: 1,
    role: "",
    enabled: true,
    createdAt: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await getUserProfile();

      setProfile({
        fullName: data.fullName || "",
        email: data.email || "",
        department: data.department || "",
        academicYear: data.academicYear || 1,
        role: data.role || "",
        enabled: data.enabled,
        createdAt: data.createdAt || "",
      });
    } catch (err) {
      setError("Unable to load profile information.");
    } finally {
      setLoading(false);
    }
  };

  const handleProfileChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    setSaving(true);
    setMessage("");
    setError("");

    try {
      const updatedProfile = await updateUserProfile({
        fullName: profile.fullName,
        department: profile.department,
        academicYear: Number(profile.academicYear),
      });

      setProfile((prev) => ({
        ...prev,
        ...updatedProfile,
      }));

      const storedUser = JSON.parse(
        localStorage.getItem("user") || "{}"
      );

      localStorage.setItem(
        "user",
        JSON.stringify({
          ...storedUser,
          ...updatedProfile,
        })
      );

      setMessage("Profile updated successfully!");
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to update profile."
      );
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordInput = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("New password and confirm password do not match.");
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    setChangingPassword(true);

    try {
      await changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setMessage("Password changed successfully!");
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to change password."
      );
    } finally {
      setChangingPassword(false);
    }
  };

  const togglePassword = (field) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const inputClass =
    "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100";

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <p className="text-gray-500">Loading settings...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="mx-auto max-w-5xl space-y-6">

        {/* Page Heading */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Account Settings
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your administrator profile and security.
          </p>
        </div>

        {/* Messages */}
        {message && (
          <div className="rounded-xl bg-green-50 p-4 text-sm text-green-700">
            {message}
          </div>
        )}

        {error && (
          <div className="rounded-xl bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Personal Information */}
        <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-xl bg-purple-100 p-3 text-purple-600">
              <User size={22} />
            </div>

            <div>
              <h2 className="font-semibold text-gray-900">
                Personal Information
              </h2>
              <p className="text-sm text-gray-500">
                Update your administrator details.
              </p>
            </div>
          </div>

          <form onSubmit={handleUpdateProfile} className="space-y-5">
            <div className="grid gap-5 md:grid-cols-2">

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={profile.fullName}
                  onChange={handleProfileChange}
                  required
                  className={inputClass}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <input
                  type="email"
                  value={profile.email}
                  disabled
                  className={`${inputClass} cursor-not-allowed bg-gray-50`}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Department
                </label>
                <input
                  type="text"
                  name="department"
                  value={profile.department}
                  onChange={handleProfileChange}
                  required
                  className={inputClass}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Academic Year
                </label>
                <select
                  name="academicYear"
                  value={profile.academicYear}
                  onChange={handleProfileChange}
                  required
                  className={inputClass}
                >
                  <option value={1}>1st Year</option>
                  <option value={2}>2nd Year</option>
                  <option value={3}>3rd Year</option>
                  <option value={4}>4th Year</option>
                </select>
              </div>

            </div>

            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 rounded-xl bg-purple-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-purple-700 disabled:opacity-60"
            >
              <Save size={17} />
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </section>

        {/* Change Password */}
        <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-xl bg-orange-100 p-3 text-orange-600">
              <Lock size={22} />
            </div>

            <div>
              <h2 className="font-semibold text-gray-900">
                Change Password
              </h2>
              <p className="text-sm text-gray-500">
                Keep your administrator account secure.
              </p>
            </div>
          </div>

          <form onSubmit={handleChangePassword} className="space-y-5">

            {[
              ["currentPassword", "Current Password", "current"],
              ["newPassword", "New Password", "new"],
              ["confirmPassword", "Confirm New Password", "confirm"],
            ].map(([name, label, key]) => (
              <div key={name}>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  {label}
                </label>

                <div className="relative">
                  <input
                    type={showPassword[key] ? "text" : "password"}
                    name={name}
                    value={passwordData[name]}
                    onChange={handlePasswordInput}
                    required
                    className={`${inputClass} pr-12`}
                  />

                  <button
                    type="button"
                    onClick={() => togglePassword(key)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                  >
                    {showPassword[key] ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>
            ))}

            <button
              type="submit"
              disabled={changingPassword}
              className="rounded-xl bg-gray-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-800 disabled:opacity-60"
            >
              {changingPassword ? "Updating..." : "Update Password"}
            </button>
          </form>
        </section>

        {/* Account Information */}
        <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-3">
            <div className="rounded-xl bg-green-100 p-3 text-green-600">
              <ShieldCheck size={22} />
            </div>

            <div>
              <h2 className="font-semibold text-gray-900">
                Account Information
              </h2>
              <p className="text-sm text-gray-500">
                Your account details and access status.
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-xs text-gray-500">Account Role</p>
              <p className="mt-1 font-semibold text-gray-900">
                {profile.role}
              </p>
            </div>

            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-xs text-gray-500">Account Status</p>
              <p
                className={`mt-1 font-semibold ${
                  profile.enabled ? "text-green-600" : "text-red-600"
                }`}
              >
                {profile.enabled ? "Active" : "Inactive"}
              </p>
            </div>

            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-xs text-gray-500">Registered On</p>
              <p className="mt-1 font-semibold text-gray-900">
                {profile.createdAt
                  ? new Date(profile.createdAt).toLocaleDateString()
                  : "Not available"}
              </p>
            </div>
          </div>
        </section>

      </div>
    </AdminLayout>
  );
};

export default AdminSettings;