import { useEffect, useState } from "react";
import AdminLayout from "../layouts/AdminLayout";
import {
  getAllItemsAdmin,
  updateItemStatus,
  deleteItemAdmin,
} from "../api/itemService";

import {
  Search,
  FileText,
  AlertCircle,
  CheckCircle,
  PackageCheck,
  Eye,
  Trash2,
  X,
  MapPin,
  Calendar,
  User,
  Tag,
  Clock,
  Image as ImageIcon,
} from "lucide-react";


function ManageReports() {
  const [reports, setReports] = useState([]);

  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const [actionLoading, setActionLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const [selectedReport, setSelectedReport] = useState(null);
  const [deleteReport, setDeleteReport] = useState(null);

  const fetchReports = async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      const data = await getAllItemsAdmin();

      const formattedReports = data.map((item) => ({
        id: item.id,
        itemName: item.itemName,
        category: item.category,
        type: item.itemType === "LOST" ? "Lost" : "Found",
        location: item.location,
        date: item.itemDate
          ? new Date(item.itemDate).toLocaleDateString("en-IN")
          : "N/A",
        student: item.reporterName || "Unknown",
        email: "N/A",
        description: item.description,
        status:
          item.status === "CLAIMED"
            ? "Matched"
            : item.status === "RETURNED"
              ? "Recovered"
              : item.status === "CLOSED"
                ? "Closed"
                : "Active",
        image: item.imageUrl || "",
      }));

      setReports(formattedReports);

    } catch (error) {
      console.error("Error fetching reports:", error);

      setErrorMessage(
        error.response?.data?.message ||
        "Unable to load reports. Please try again."
      );

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  // Statistics
  const totalReports = reports.length;

  const lostReports = reports.filter(
    (report) => report.type === "Lost"
  ).length;

  const foundReports = reports.filter(
    (report) => report.type === "Found"
  ).length;

  const recoveredReports = reports.filter(
    (report) => report.status === "Recovered"
  ).length;

  // Search and filter
  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      report.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.student.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType =
      typeFilter === "All" || report.type === typeFilter;

    const matchesStatus =
      statusFilter === "All" || report.status === statusFilter;

    return matchesSearch && matchesType && matchesStatus;
  });

  // Update report status
  const updateReportStatus = async (reportId, newStatus) => {
    try {
      setActionLoading(true);

      const statusMapping = {
        Active: "ACTIVE",
        Matched: "CLAIMED",
        Recovered: "RETURNED",
      };

      await updateItemStatus(reportId, statusMapping[newStatus]);

      setReports((previousReports) =>
        previousReports.map((report) =>
          report.id === reportId
            ? { ...report, status: newStatus }
            : report
        )
      );

      setSelectedReport(null);

    } catch (error) {
      console.error("Error updating report status:", error);

      alert(
        error.response?.data?.message ||
        "Unable to update report status."
      );

    } finally {
      setActionLoading(false);
    }
  };

  // Delete report
  const handleDeleteReport = async () => {
    if (!deleteReport) return;

    try {
      setActionLoading(true);

      await deleteItemAdmin(deleteReport.id);

      setReports((previousReports) =>
        previousReports.filter(
          (report) => report.id !== deleteReport.id
        )
      );

      setDeleteReport(null);

    } catch (error) {
      console.error("Error deleting report:", error);

      alert(
        error.response?.data?.message ||
        "Unable to delete report."
      );

    } finally {
      setActionLoading(false);
    }
  };

  const stats = [
    {
      title: "Total Reports",
      value: totalReports,
      icon: FileText,
      color: "bg-purple-100 text-purple-600",
    },
    {
      title: "Lost Reports",
      value: lostReports,
      icon: AlertCircle,
      color: "bg-red-100 text-red-600",
    },
    {
      title: "Found Reports",
      value: foundReports,
      icon: PackageCheck,
      color: "bg-blue-100 text-blue-600",
    },
    {
      title: "Recovered Items",
      value: recoveredReports,
      icon: CheckCircle,
      color: "bg-green-100 text-green-600",
    },
  ];

  const getStatusStyle = (status) => {
    switch (status) {
      case "Active":
        return "bg-blue-100 text-blue-700";
      case "Matched":
        return "bg-yellow-100 text-yellow-700";
      case "Recovered":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">

        {/* Heading */}
        <div>
          <h1 className="text-2xl font-bold text-[#20213A]">
            Manage Reports
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Monitor, review and manage all lost-and-found reports.
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

            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                placeholder="Search item, student or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-lg border border-gray-200 py-3 pl-10 pr-4 text-sm outline-none focus:border-[#6254C7] focus:ring-2 focus:ring-purple-100"
              />
            </div>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#6254C7]"
            >
              <option value="All">All Types</option>
              <option value="Lost">Lost</option>
              <option value="Found">Found</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#6254C7]"
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Matched">Matched</option>
              <option value="Recovered">Recovered</option>
            </select>

          </div>
        </div>

        {/* Reports Table */}
        <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">

          <div className="flex items-center justify-between border-b border-gray-100 p-5">
            <h2 className="font-semibold text-[#20213A]">
              All Reports
            </h2>

            <span className="text-sm text-gray-500">
              {filteredReports.length} reports found
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left">

              <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-6 py-4 font-semibold">Item</th>
                  <th className="px-6 py-4 font-semibold">Reported By</th>
                  <th className="px-6 py-4 font-semibold">Type</th>
                  <th className="px-6 py-4 font-semibold">Location</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 text-center font-semibold">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">

                {loading ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                      Loading reports...
                    </td>
                  </tr>
                ) : errorMessage ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center">
                      <p className="text-red-500">{errorMessage}</p>

                      <button
                        onClick={fetchReports}
                        className="mt-3 text-sm font-semibold text-[#6254C7]"
                      >
                        Try Again
                      </button>
                    </td>
                  </tr>
                ) : filteredReports.length > 0 ? (
                  filteredReports.map((report) => (
                    <tr
                      key={report.id}
                      className="transition hover:bg-gray-50"
                    >

                      {/* Item */}
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-[#20213A]">
                            {report.itemName}
                          </p>
                          <p className="text-xs text-gray-500">
                            {report.category}
                          </p>
                        </div>
                      </td>

                      {/* Student */}
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-gray-700">
                          {report.student}
                        </p>
                        <p className="text-xs text-gray-500">
                          {report.date}
                        </p>
                      </td>

                      {/* Type */}
                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${report.type === "Lost"
                            ? "bg-red-100 text-red-700"
                            : "bg-blue-100 text-blue-700"
                            }`}
                        >
                          {report.type}
                        </span>
                      </td>

                      {/* Location */}
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {report.location}
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusStyle(
                            report.status
                          )}`}
                        >
                          {report.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4">
                        <div className="flex justify-center gap-2">

                          <button
                            onClick={() => setSelectedReport(report)}
                            className="rounded-lg p-2 text-gray-500 transition hover:bg-purple-100 hover:text-[#6254C7]"
                            title="View report"
                          >
                            <Eye size={18} />
                          </button>

                          <button
                            onClick={() => setDeleteReport(report)}
                            className="rounded-lg p-2 text-gray-500 transition hover:bg-red-100 hover:text-red-600"
                            title="Delete report"
                          >
                            <Trash2 size={18} />
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
                      No reports found.
                    </td>
                  </tr>
                )}

              </tbody>
            </table>
          </div>
        </div>

        {/* Report Details Modal */}
        {selectedReport && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

            <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white shadow-xl">

              <div className="flex items-center justify-between border-b border-gray-100 p-5">
                <h2 className="text-lg font-bold text-[#20213A]">
                  Report Details
                </h2>

                <button
                  onClick={() => setSelectedReport(null)}
                  className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-5 p-6">

                <div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${selectedReport.type === "Lost"
                      ? "bg-red-100 text-red-700"
                      : "bg-blue-100 text-blue-700"
                      }`}
                  >
                    {selectedReport.type} Item
                  </span>

                  <h3 className="mt-3 text-2xl font-bold text-[#20213A]">
                    {selectedReport.itemName}
                  </h3>

                  <p className="mt-1 text-sm text-gray-500">
                    {selectedReport.category}
                  </p>
                </div>

                <div className="rounded-xl bg-gray-50 p-4">
                  <div className="mb-3 flex items-center gap-2 text-sm font-medium text-gray-700">
                    <ImageIcon size={18} className="text-[#6254C7]" />
                    Item Image
                  </div>

                  {selectedReport.image ? (
                    <img
                      src={selectedReport.image}
                      alt={selectedReport.itemName}
                      className="h-48 w-full rounded-lg object-cover"
                    />
                  ) : (
                    <div className="flex h-32 items-center justify-center rounded-lg border border-dashed border-gray-300 text-sm text-gray-400">
                      No image uploaded
                    </div>
                  )}
                </div>

                <div className="space-y-3">

                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <User size={18} className="text-[#6254C7]" />
                    {selectedReport.student}
                  </div>

                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <MapPin size={18} className="text-[#6254C7]" />
                    {selectedReport.location}
                  </div>

                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Calendar size={18} className="text-[#6254C7]" />
                    {selectedReport.date}
                  </div>

                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Tag size={18} className="text-[#6254C7]" />
                    {selectedReport.category}
                  </div>

                  <div className="flex items-start gap-3 text-sm text-gray-600">
                    <FileText size={18} className="mt-0.5 text-[#6254C7]" />
                    <p>{selectedReport.description}</p>
                  </div>

                </div>

                <div className="flex items-center justify-between rounded-lg bg-gray-50 p-4">
                  <span className="text-sm font-medium text-gray-600">
                    Current Status
                  </span>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(
                      selectedReport.status
                    )}`}
                  >
                    {selectedReport.status}
                  </span>
                </div>

                {/* Status Update */}
                <div>
                  <p className="mb-3 text-sm font-semibold text-[#20213A]">
                    Update Report Status
                  </p>

                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                    {actionLoading && (
                      <p className="mb-2 text-sm text-[#6254C7]">
                        Updating report...
                      </p>
                    )}
                    {["Active", "Matched", "Recovered"].map((status) => (
                      <button
                        key={status}
                        onClick={() =>
                          updateReportStatus(selectedReport.id, status)
                        }
                        disabled={actionLoading || selectedReport.status === status}
                        className="rounded-lg border border-gray-200 px-3 py-3 text-sm font-medium text-gray-600 transition hover:border-[#6254C7] hover:bg-purple-50 hover:text-[#6254C7] disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400"
                      >
                        {status}
                      </button>
                    ))}

                  </div>
                </div>

              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteReport && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">

              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
                <Trash2 size={22} />
              </div>

              <h2 className="text-lg font-bold text-[#20213A]">
                Delete Report?
              </h2>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                Are you sure you want to delete the report for{" "}
                <span className="font-semibold text-gray-700">
                  {deleteReport.itemName}
                </span>
                ? This action cannot be undone.
              </p>

              <div className="mt-6 flex gap-3">

                <button
                  onClick={() => setDeleteReport(null)}
                  disabled={actionLoading}
                  className="flex-1 rounded-lg border border-gray-200 py-3 text-sm font-semibold text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  onClick={handleDeleteReport}
                  disabled={actionLoading}
                  className="flex-1 rounded-lg bg-red-500 py-3 text-sm font-semibold text-white hover:bg-red-600"
                >
                  {actionLoading ? "Deleting..." : "Delete Report"}
                </button>

              </div>
            </div>
          </div>
        )}

      </div>
    </AdminLayout>
  );
}

export default ManageReports;