import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllUsers } from "../api/userService";
import { getAllItemsAdmin } from "../api/itemService";
import { getAllClaims } from "../api/claimService";
import AdminLayout from "../layouts/AdminLayout";
import {
  Users,
  Package,
  Search,
  ClipboardCheck,
  CheckCircle,
  Clock,
  AlertCircle,
  ArrowUpRight,
  Eye,
} from "lucide-react";


function AdminDashboard() {
  const [stats, setStats] = useState([
    {
      title: "Total Students",
      value: 0,
      change: "Registered users",
      icon: Users,
      color: "bg-blue-50 text-blue-600",
    },
    {
      title: "Total Reports",
      value: 0,
      change: "Lost and found items",
      icon: Package,
      color: "bg-purple-50 text-[#6254C7]",
    },
    {
      title: "Pending Claims",
      value: 0,
      change: "Awaiting verification",
      icon: Clock,
      color: "bg-yellow-50 text-yellow-600",
    },
    {
      title: "Recovered Items",
      value: 0,
      change: "Successfully returned",
      icon: CheckCircle,
      color: "bg-green-50 text-green-600",
    },
  ]);

  const [recentReports, setRecentReports] = useState([]);

  const [pendingClaims, setPendingClaims] = useState(0);

  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      const [users, items, claims] = await Promise.all([
        getAllUsers(),
        getAllItemsAdmin(),
        getAllClaims(),
      ]);

      // Count registered students (exclude admins)
      const totalStudents = users.filter(
        (user) => user.role === "STUDENT"
      ).length;

      // Count pending claims
      const pending = claims.filter(
        (claim) => claim.status === "PENDING"
      ).length;

      // Count recovered items
      const recovered = items.filter(
        (item) => item.status === "RETURNED"
      ).length;

      setPendingClaims(pending);

      // Update statistics
      setStats((previousStats) =>
        previousStats.map((stat) => {
          switch (stat.title) {
            case "Total Students":
              return { ...stat, value: totalStudents };

            case "Total Reports":
              return { ...stat, value: items.length };

            case "Pending Claims":
              return { ...stat, value: pending };

            case "Recovered Items":
              return { ...stat, value: recovered };

            default:
              return stat;
          }
        })
      );

      // Get the latest reports
      const latestReports = [...items]
        .sort(
          (a, b) =>
            new Date(b.createdAt) - new Date(a.createdAt)
        )
        .slice(0, 4)
        .map((item) => ({
          id: item.id,
          item: item.itemName,
          student: item.reporterName || "Unknown",
          type: item.itemType === "LOST" ? "Lost" : "Found",
          date: item.itemDate
            ? new Date(item.itemDate).toLocaleDateString("en-IN")
            : "N/A",
          status:
            item.status === "RETURNED"
              ? "Recovered"
              : item.status === "CLAIMED"
                ? "Matched"
                : item.status === "CLOSED"
                  ? "Closed"
                  : "Active",
        }));

      setRecentReports(latestReports);

    } catch (error) {
      console.error("Dashboard loading error:", error);

      setErrorMessage(
        error.response?.data?.message ||
        "Unable to load dashboard data."
      );

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <AdminLayout>
      <div className="space-y-8">

        {/* Welcome Section */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-semibold text-[#6254C7]">
              ADMIN OVERVIEW
            </p>

            <h1 className="mt-2 text-3xl font-bold text-[#20213A]">
              Dashboard
            </h1>

            <p className="mt-2 text-gray-500">
              Monitor and manage your campus lost and found system.
            </p>
          </div>

          <Link
            to="/admin/claims"
            className="flex items-center justify-center gap-2 rounded-xl bg-[#6254C7] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#5143B5]"
          >
            Review Claims
            <ArrowUpRight size={17} />
          </Link>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.title}
                className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-500">
                    {stat.title}
                  </p>

                  <div className={`rounded-xl p-3 ${stat.color}`}>
                    <Icon size={22} />
                  </div>
                </div>

                <h2 className="mt-5 text-3xl font-bold text-[#20213A]">
                  {loading ? "..." : stat.value}
                </h2>

                <p className="mt-2 text-xs text-gray-400">
                  {stat.change}
                </p>
              </div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="mb-4 text-xl font-bold text-[#20213A]">
            Quick Management
          </h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

            <Link
              to="/admin/items"
              className="group rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-purple-200"
            >
              <Package
                size={25}
                className="text-[#6254C7]"
              />

              <h3 className="mt-4 font-semibold text-[#20213A]">
                Manage Items
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Review lost and found reports.
              </p>
            </Link>

            <Link
              to="/admin/claims"
              className="group rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-purple-200"
            >
              <ClipboardCheck
                size={25}
                className="text-yellow-600"
              />

              <h3 className="mt-4 font-semibold text-[#20213A]">
                Manage Claims
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Verify student ownership claims.
              </p>
            </Link>

            <Link
              to="/admin/users"
              className="group rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-purple-200"
            >
              <Users
                size={25}
                className="text-blue-600"
              />

              <h3 className="mt-4 font-semibold text-[#20213A]">
                Manage Users
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                View registered students.
              </p>
            </Link>

            <Link
              to="/admin/reports"
              className="group rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-purple-200"
            >
              <Search
                size={25}
                className="text-green-600"
              />

              <h3 className="mt-4 font-semibold text-[#20213A]">
                Manage Reports
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Monitor submitted reports.
              </p>
            </Link>

          </div>
        </div>

        {/* Recent Reports */}
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-7">

          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-xl font-bold text-[#20213A]">
                Recent Reports
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Latest activity from students.
              </p>
            </div>

            <Link
              to="/admin/items"
              className="text-sm font-semibold text-[#6254C7] hover:underline"
            >
              View All
            </Link>
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[650px] text-left">
              <thead>
                <tr className="border-b border-gray-100 text-xs uppercase tracking-wide text-gray-400">
                  <th className="pb-4 font-semibold">Item</th>
                  <th className="pb-4 font-semibold">Student</th>
                  <th className="pb-4 font-semibold">Type</th>
                  <th className="pb-4 font-semibold">Date</th>
                  <th className="pb-4 font-semibold">Status</th>
                  <th className="pb-4 font-semibold">Action</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6" className="py-8 text-center text-gray-500">
                      Loading recent reports...
                    </td>
                  </tr>
                ) : errorMessage ? (
                  <tr>
                    <td colSpan="6" className="py-8 text-center">
                      <p className="text-red-500">{errorMessage}</p>

                      <button
                        onClick={fetchDashboardData}
                        className="mt-2 text-sm text-blue-600 hover:underline"
                      >
                        Try Again
                      </button>
                    </td>
                  </tr>
                ) : recentReports.length > 0 ? (
                  recentReports.map((report) => (
                    <tr
                      key={report.id}
                      className="border-b border-gray-50 last:border-0"
                    >
                      <td className="py-5 font-semibold text-[#20213A]">
                        {report.item}
                      </td>

                      <td className="py-5 text-sm text-gray-500">
                        {report.student}
                      </td>

                      <td className="py-5">
                        <span
                          className={`rounded-md px-2 py-1 text-xs font-semibold ${report.type === "Lost"
                            ? "bg-red-50 text-red-600"
                            : "bg-blue-50 text-blue-600"
                            }`}
                        >
                          {report.type}
                        </span>
                      </td>

                      <td className="py-5 text-sm text-gray-500">
                        {report.date}
                      </td>

                      <td className="py-5">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${report.status === "Recovered"
                            ? "bg-green-50 text-green-700"
                            : "bg-yellow-50 text-yellow-700"
                            }`}
                        >
                          {report.status}
                        </span>
                      </td>

                      <td className="py-5">
                        <Link
                          to={`/item/${report.id}`}
                          className="inline-flex items-center gap-1 text-sm font-medium text-[#6254C7] hover:underline"
                        >
                          <Eye size={16} />
                          View
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="py-8 text-center text-gray-500">
                      No reports available yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pending Claims Notice */}
        <div className="flex flex-col gap-4 rounded-2xl border border-yellow-100 bg-yellow-50 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="rounded-xl bg-white p-3 text-yellow-600">
              <AlertCircle size={23} />
            </div>

            <div>
              <h3 className="font-bold text-[#20213A]">
                Claims Awaiting Review
              </h3>

              <p className="mt-1 text-sm text-gray-600">
                There are {pendingClaims} ownership claims waiting for administrator review.
              </p>
            </div>
          </div>

          <Link
            to="/admin/claims"
            className="whitespace-nowrap rounded-xl bg-yellow-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-yellow-600"
          >
            Review Now
          </Link>
        </div>

      </div>
    </AdminLayout>
  );
}

export default AdminDashboard;