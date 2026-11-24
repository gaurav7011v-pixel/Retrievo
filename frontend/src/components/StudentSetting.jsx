import { useEffect, useState } from "react";
import StudentLayout from "../layouts/StudentLayout";
import {
  getUserProfile,
  updateUserProfile,
  changePassword,
} from "../api/userService";

import {
  UserRound,
  LockKeyhole,
  ShieldCheck,
  Save,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";

function StudentSettings() {
  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    department: "",
    academicYear: "",
    role: "",
    enabled: true,
    createdAt: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await getUserProfile();
      setProfile(data);
    } catch (err) {
      setError("Unable to load your profile.");
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
    setMessage("");
    setError("");

    try {
      setSaving(true);

      const updatedProfile = await updateUserProfile({
        fullName: profile.fullName,
        department: profile.department,
        academicYear: Number(profile.academicYear),
      });

      setProfile(updatedProfile);
      localStorage.setItem("user", JSON.stringify(updatedProfile));
      setMessage("Profile updated successfully!");
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to update profile."
      );
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e) => {
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

    try {
      setChangingPassword(true);

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
        err.response?.data?.message || "Unable to change password."
      );
    } finally {
      setChangingPassword(false);
    }
  };

  if (loading) {
    return (
      <StudentLayout>
        <div className="flex min-h-[50vh] items-center justify-center">
          <Loader2 className="animate-spin text-[#6254C7]" size={32} />
        </div>
      </StudentLayout>
    );
  }

  const inputClass =
    "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#6254C7] focus:ring-2 focus:ring-purple-100";

  return (
    <StudentLayout>
      <div className="mx-auto max-w-5xl space-y-7">

        {/* Page Heading */}
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-[#6254C7]">
            Account Management
          </p>
          <h1 className="mt-2 text-3xl font-bold text-[#20213A]">
            Settings
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Manage your personal information and account security.
          </p>
        </div>

        {/* Messages */}
        {message && (
          <div className="rounded-xl bg-green-50 p-4 text-sm text-green-700">
            {message}
          </div>
        )}

        {error && (
          <div className="rounded-xl bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Profile Section */}
        <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-7 flex items-center gap-3">
            <div className="rounded-xl bg-purple-100 p-3 text-[#6254C7]">
              <UserRound size={22} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#20213A]">
                Personal Information
              </h2>
              <p className="text-sm text-gray-500">
                Update your personal details.
              </p>
            </div>
          </div>

          <form onSubmit={handleUpdateProfile}>
            <div className="grid gap-5 sm:grid-cols-2">

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Full Name
                </label>
                <input
                  name="fullName"
                  value={profile.fullName}
                  onChange={handleProfileChange}
                  className={inputClass}
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Email Address
                </label>
                <input
                  value={profile.email}
                  disabled
                  className={`${inputClass} cursor-not-allowed bg-gray-50 text-gray-500`}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Department
                </label>
                <input
                  name="department"
                  value={profile.department}
                  onChange={handleProfileChange}
                  className={inputClass}
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Academic Year
                </label>
                <select
                  name="academicYear"
                  value={profile.academicYear}
                  onChange={handleProfileChange}
                  className={inputClass}
                  required
                >
                  <option value="">Select academic year</option>
                  <option value="1">First Year</option>
                  <option value="2">Second Year</option>
                  <option value="3">Third Year</option>
                  <option value="4">Fourth Year</option>
                </select>
              </div>
            </div>

            <div className="mt-7 flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 rounded-xl bg-[#6254C7] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#5143B5] disabled:opacity-60"
              >
                <Save size={17} />
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </section>

        {/* Password Section */}
        <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-7 flex items-center gap-3">
            <div className="rounded-xl bg-blue-100 p-3 text-blue-600">
              <LockKeyhole size={22} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#20213A]">
                Change Password
              </h2>
              <p className="text-sm text-gray-500">
                Keep your account secure with a strong password.
              </p>
            </div>
          </div>

          <form onSubmit={handlePasswordChange}>
            {[
              {
                label: "Current Password",
                name: "currentPassword",
                value: passwordData.currentPassword,
                show: showCurrent,
                toggle: () => setShowCurrent(!showCurrent),
              },
              {
                label: "New Password",
                name: "newPassword",
                value: passwordData.newPassword,
                show: showNew,
                toggle: () => setShowNew(!showNew),
              },
              {
                label: "Confirm New Password",
                name: "confirmPassword",
                value: passwordData.confirmPassword,
                show: showConfirm,
                toggle: () => setShowConfirm(!showConfirm),
              },
            ].map((field) => (
              <div className="mb-5" key={field.name}>
                <label className="mb-2 block text-sm font-semibold">
                  {field.label}
                </label>

                <div className="relative">
                  <input
                    type={field.show ? "text" : "password"}
                    value={field.value}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        [field.name]: e.target.value,
                      })
                    }
                    className={inputClass}
                    required
                  />

                  <button
                    type="button"
                    onClick={field.toggle}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    {field.show ? <EyeOff size={19} /> : <Eye size={19} />}
                  </button>
                </div>
              </div>
            ))}

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={changingPassword}
                className="flex items-center gap-2 rounded-xl bg-[#20213A] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#30314F] disabled:opacity-60"
              >
                <LockKeyhole size={17} />
                {changingPassword ? "Updating..." : "Update Password"}
              </button>
            </div>
          </form>
        </section>

        {/* Account Information */}
        <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-xl bg-green-100 p-3 text-green-600">
              <ShieldCheck size={22} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#20213A]">
                Account Information
              </h2>
              <p className="text-sm text-gray-500">
                Your account details.
              </p>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase text-gray-400">
                Account Role
              </p>
              <p className="mt-2 font-semibold">{profile.role}</p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase text-gray-400">
                Account Status
              </p>
              <p className="mt-2 font-semibold text-green-600">
                {profile.enabled ? "Active" : "Disabled"}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase text-gray-400">
                Registration Date
              </p>
              <p className="mt-2 font-semibold">
                {profile.createdAt
                  ? new Date(profile.createdAt).toLocaleDateString("en-IN")
                  : "N/A"}
              </p>
            </div>
          </div>
        </section>

      </div>
    </StudentLayout>
  );
}

export default StudentSettings;