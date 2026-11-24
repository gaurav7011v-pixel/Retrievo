import { useEffect, useState } from "react";
import {
  getAllUsers,
  activateUser,
  deactivateUser
} from "../api/userService";
import AdminLayout from "../layouts/AdminLayout";

import {
  Search,
  Users,
  UserCheck,
  UserX,
  ShieldCheck,
  Eye,
  X,
  Mail,
  GraduationCap,
  Calendar,
  Building2,
  Phone,
  CheckCircle,
  XCircle,
} from "lucide-react";


function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const [actionLoading, setActionLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const [selectedUser, setSelectedUser] = useState(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      const data = await getAllUsers();

      const formattedUsers = data.map((user) => ({
        id: user.id,
        name: user.fullName,
        email: user.email,
        phone: "N/A",
        department: user.department || "N/A",
        year: user.academicYear
          ? `${user.academicYear}${user.academicYear === 1 ? "st" : user.academicYear === 2 ? "nd" : user.academicYear === 3 ? "rd" : "th"} Year`
          : "N/A",
        role: user.role === "ADMIN" ? "Admin" : "Student",
        status: user.enabled ? "Active" : "Inactive",
        joined: user.createdAt
          ? new Date(user.createdAt).toLocaleDateString("en-IN")
          : "N/A"
      }));

      setUsers(formattedUsers);

    } catch (error) {
      console.error("Error fetching users:", error);

      setErrorMessage(
        error.response?.data?.message ||
        "Unable to load users. Please try again."
      );

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Calculate dashboard statistics
  const totalUsers = users.length;

  const activeUsers = users.filter(
    (user) => user.status === "Active"
  ).length;

  const inactiveUsers = users.filter(
    (user) => user.status === "Inactive"
  ).length;

  const adminUsers = users.filter(
    (user) => user.role === "Admin"
  ).length;

  // Search and filter users
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.department.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole =
      roleFilter === "All" || user.role === roleFilter;

    const matchesStatus =
      statusFilter === "All" || user.status === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  // Activate or deactivate a user
  const toggleUserStatus = async (userId) => {

    const user = users.find((u) => u.id === userId);

    if (!user) return;

    try {
      setActionLoading(true);

      if (user.status === "Active") {
        await deactivateUser(userId);
      } else {
        await activateUser(userId);
      }

      // Update frontend after successful backend response
      setUsers((previousUsers) =>
        previousUsers.map((u) =>
          u.id === userId
            ? {
              ...u,
              status: user.status === "Active"
                ? "Inactive"
                : "Active"
            }
            : u
        )
      );

      setSelectedUser(null);

    } catch (error) {
      console.error("Error updating user status:", error);

      alert(
        error.response?.data?.message ||
        "Unable to update account status."
      );

    } finally {
      setActionLoading(false);
    }
  };

  const stats = [
    {
      title: "Total Users",
      value: totalUsers,
      icon: Users,
      color: "bg-purple-100 text-purple-600",
    },
    {
      title: "Active Users",
      value: activeUsers,
      icon: UserCheck,
      color: "bg-green-100 text-green-600",
    },
    {
      title: "Inactive Users",
      value: inactiveUsers,
      icon: UserX,
      color: "bg-red-100 text-red-600",
    },
    {
      title: "Administrators",
      value: adminUsers,
      icon: ShieldCheck,
      color: "bg-blue-100 text-blue-600",
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">

        {/* Page Heading */}
        <div>
          <h1 className="text-2xl font-bold text-[#20213A]">
            Manage Users
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            View and manage registered students and administrators.
          </p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.title}
                className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">
                      {stat.title}
                    </p>

                    <h2 className="mt-2 text-2xl font-bold text-[#20213A]">
                      {stat.value}
                    </h2>
                  </div>

                  <div className={`rounded-xl p-3 ${stat.color}`}>
                    <Icon size={22} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Search and Filters */}
        <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row">

            {/* Search */}
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                placeholder="Search by name, email or department..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-lg border border-gray-200 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-[#6254C7] focus:ring-2 focus:ring-purple-100"
              />
            </div>

            {/* Role Filter */}
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#6254C7]"
            >
              <option value="All">All Roles</option>
              <option value="Student">Student</option>
              <option value="Admin">Admin</option>
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#6254C7]"
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>

          </div>
        </div>

        {/* Users Table */}
        <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">

          <div className="flex items-center justify-between border-b border-gray-100 p-5">
            <h2 className="font-semibold text-[#20213A]">
              Registered Users
            </h2>

            <span className="text-sm text-gray-500">
              {filteredUsers.length} users found
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left">

              <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-6 py-4 font-semibold">User</th>
                  <th className="px-6 py-4 font-semibold">Department</th>
                  <th className="px-6 py-4 font-semibold">Role</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold">Joined</th>
                  <th className="px-6 py-4 text-center font-semibold">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">

                {loading ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-sm text-gray-500">
                      Loading users...
                    </td>
                  </tr>
                ) : errorMessage ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-sm text-red-500">
                      {errorMessage}
                      <button
                        onClick={fetchUsers}
                        className="ml-2 font-semibold text-[#6254C7] hover:underline"
                      >
                        Retry
                      </button>
                    </td>
                  </tr>
                ) : filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="transition hover:bg-gray-50"
                    >
                      {/* User Information */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 font-semibold text-[#6254C7]">
                            {user.name.charAt(0)}
                          </div>

                          <div>
                            <p className="font-medium text-[#20213A]">
                              {user.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Department */}
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {user.department}
                      </td>

                      {/* Role */}
                      <td className="px-6 py-4">
                        <span className={`rounded-full px-3 py-1 text-xs font-medium ${user.role === "Admin"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-purple-100 text-purple-700"
                          }`}>
                          {user.role}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <span className={`rounded-full px-3 py-1 text-xs font-medium ${user.status === "Active"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                          }`}>
                          {user.status}
                        </span>
                      </td>

                      {/* Joined */}
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {user.joined}
                      </td>

                      {/* Action */}
                      <td className="px-6 py-4">
                        <div className="flex justify-center">
                          <button
                            onClick={() => setSelectedUser(user)}
                            className="rounded-lg p-2 text-gray-500 transition hover:bg-purple-100 hover:text-[#6254C7]"
                            title="View user"
                          >
                            <Eye size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-6 py-12 text-center text-sm text-gray-500"
                    >
                      No users found.
                    </td>
                  </tr>
                )}

              </tbody>
            </table>
          </div>
        </div>

        {/* User Details Modal */}
        {selectedUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

            <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl">

              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-gray-100 p-5">
                <h2 className="text-lg font-bold text-[#20213A]">
                  User Details
                </h2>

                <button
                  onClick={() => setSelectedUser(null)}
                  className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Modal Content */}
              <div className="space-y-5 p-6">

                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-purple-100 text-2xl font-bold text-[#6254C7]">
                    {selectedUser.name.charAt(0)}
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-[#20213A]">
                      {selectedUser.name}
                    </h3>

                    <p className="text-sm text-gray-500">
                      {selectedUser.role}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">

                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Mail size={18} className="text-[#6254C7]" />
                    {selectedUser.email}
                  </div>

                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Phone size={18} className="text-[#6254C7]" />
                    {selectedUser.phone}
                  </div>

                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Building2 size={18} className="text-[#6254C7]" />
                    {selectedUser.department}
                  </div>

                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <GraduationCap size={18} className="text-[#6254C7]" />
                    {selectedUser.year}
                  </div>

                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Calendar size={18} className="text-[#6254C7]" />
                    Joined on {selectedUser.joined}
                  </div>

                </div>

                <div className="flex items-center justify-between rounded-lg bg-gray-50 p-4">
                  <span className="text-sm font-medium text-gray-600">
                    Account Status
                  </span>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${selectedUser.status === "Active"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                      }`}
                  >
                    {selectedUser.status}
                  </span>
                </div>

                {/* Account Status Button */}
                <button
                  onClick={() => toggleUserStatus(selectedUser.id)}
                  disabled={actionLoading || selectedUser.role === "Admin"}
                  className={`flex w-full items-center justify-center gap-2 rounded-lg py-3 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:bg-gray-300 ${selectedUser.status === "Active"
                    ? "bg-red-500 hover:bg-red-600"
                    : "bg-green-600 hover:bg-green-700"
                    }`}
                >
                  {selectedUser.status === "Active" ? (
                    <>
                      <XCircle size={18} />
                      {actionLoading ? "Updating..." : "Deactivate Account"}
                    </>
                  ) : (
                    <>
                      <CheckCircle size={18} />
                      {actionLoading ? "Updating..." : "Activate Account"}
                    </>
                  )}
                </button>

                {selectedUser.role === "Admin" && (
                  <p className="text-center text-xs text-gray-400">
                    Administrator accounts cannot be deactivated here.
                  </p>
                )}

              </div>
            </div>
          </div>
        )}

      </div>
    </AdminLayout>
  );
}

export default ManageUsers;