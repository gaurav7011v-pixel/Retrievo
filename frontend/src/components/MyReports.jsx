import { useEffect, useState } from "react";
import api from "../api/axios";
import { getMyReports } from "../api/itemService";
import { Link } from "react-router-dom";
import StudentLayout from "../layouts/StudentLayout";
import {
  Package,
  Search,
  Plus,
  Calendar,
  MapPin,
  Eye,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";



function MyReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const [activeFilter, setActiveFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const fetchReports = async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      const data = await getMyReports();

      const formattedReports = data.map((item) => ({
        id: item.id,
        imageUrl: item.imageUrl,
        name: item.itemName,
        category: item.category,
        type: item.itemType === "LOST" ? "Lost" : "Found",
        location: item.location,
        date: item.itemDate
          ? new Date(item.itemDate).toLocaleDateString("en-IN")
          : "N/A",
        status:
          item.status === "CLAIMED" || item.status === "RETURNED"
            ? "Recovered"
            : item.status === "CLOSED"
              ? "Closed"
              : "Active",
        description: item.description,
      }));

      setReports(formattedReports);

    } catch (error) {
      console.error("Error fetching reports:", error);

      setErrorMessage(
        error.response?.data?.message ||
        "Unable to load your reports. Please try again."
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
    const matchesFilter =
      activeFilter === "All" || report.type === activeFilter;

    const matchesSearch =
      report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.location.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  // Status styling
  const getStatusStyle = (status) => {
    if (status === "Recovered") {
      return "bg-green-50 text-green-700";
    }

    if (status === "Matched") {
      return "bg-blue-50 text-blue-700";
    }

    return "bg-yellow-50 text-yellow-700";
  };

  // Status icon
  const getStatusIcon = (status) => {
    if (status === "Recovered") {
      return <CheckCircle size={15} />;
    }

    if (status === "Matched") {
      return <AlertCircle size={15} />;
    }

    return <Clock size={15} />;
  };

  return (
    <StudentLayout>
      <div className="space-y-8">

        {/* Heading */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-semibold text-[#6254C7]">
              REPORT MANAGEMENT
            </p>

            <h1 className="mt-2 text-3xl font-bold text-[#20213A]">
              My Reports
            </h1>

            <p className="mt-2 text-gray-500">
              Manage and track the items you have reported.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              to="/report-lost"
              className="flex items-center gap-2 rounded-xl border border-[#6254C7] px-4 py-3 text-sm font-semibold text-[#6254C7] transition hover:bg-purple-50"
            >
              <Plus size={17} />
              Report Lost
            </Link>

            <Link
              to="/report-found"
              className="flex items-center gap-2 rounded-xl bg-[#6254C7] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#5143B5]"
            >
              <Plus size={17} />
              Report Found
            </Link>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">

          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">Total Reports</p>
              <div className="rounded-xl bg-purple-50 p-3 text-[#6254C7]">
                <Package size={21} />
              </div>
            </div>

            <h2 className="mt-4 text-3xl font-bold text-[#20213A]">
              {totalReports}
            </h2>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">Lost Items</p>
              <div className="rounded-xl bg-red-50 p-3 text-red-600">
                <AlertCircle size={21} />
              </div>
            </div>

            <h2 className="mt-4 text-3xl font-bold text-[#20213A]">
              {lostReports}
            </h2>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">Found Items</p>
              <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                <Package size={21} />
              </div>
            </div>

            <h2 className="mt-4 text-3xl font-bold text-[#20213A]">
              {foundReports}
            </h2>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">Recovered</p>
              <div className="rounded-xl bg-green-50 p-3 text-green-600">
                <CheckCircle size={21} />
              </div>
            </div>

            <h2 className="mt-4 text-3xl font-bold text-[#20213A]">
              {recoveredReports}
            </h2>
          </div>
        </div>

        {/* Reports Section */}
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-7">

          {/* Search and Heading */}
          <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
            <div>
              <h2 className="text-xl font-bold text-[#20213A]">
                Your Submitted Reports
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                View the details and current status of your reports.
              </p>
            </div>

            <div className="relative w-full lg:max-w-xs">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                placeholder="Search items or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-xl border border-gray-200 py-3 pl-11 pr-4 text-sm outline-none focus:border-[#6254C7]"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="mt-6 flex flex-wrap gap-2">
            {["All", "Lost", "Found"].map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`rounded-xl px-4 py-2 text-sm font-medium transition ${activeFilter === filter
                  ? "bg-[#6254C7] text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-purple-50 hover:text-[#6254C7]"
                  }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Reports List */}
          <div className="mt-6 space-y-4">
            {loading ? (
              <div className="py-12 text-center text-gray-500">
                Loading your reports...
              </div>
            ) : errorMessage ? (
              <div className="py-12 text-center">
                <p className="text-red-500">{errorMessage}</p>

                <button
                  onClick={fetchReports}
                  className="mt-3 text-sm font-semibold text-[#6254C7]"
                >
                  Try Again
                </button>
              </div>
            ) : filteredReports.length > 0 ? (
              filteredReports.map((report) => (
                <div
                  key={report.id}
                  className="flex flex-col justify-between gap-5 rounded-xl border border-gray-100 p-5 transition hover:border-purple-200 lg:flex-row lg:items-center"
                >
                  {/* Report Information */}
                  <div className="flex items-start gap-4">
                    <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-purple-50">
                      {report.imageUrl ? (
                        <img
                          src={
                            report.imageUrl.startsWith("http")
                              ? report.imageUrl
                              : `${api.defaults.baseURL.replace("/api", "")}${report.imageUrl}`
                          }
                          alt={report.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-[#6254C7]">
                          <Package size={27} />
                        </div>
                      )}
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-bold text-[#20213A]">
                          {report.name}
                        </h3>

                        <span
                          className={`rounded-md px-2 py-1 text-xs font-semibold ${report.type === "Lost"
                            ? "bg-red-50 text-red-600"
                            : "bg-blue-50 text-blue-600"
                            }`}
                        >
                          {report.type}
                        </span>
                      </div>

                      <p className="mt-1 text-sm text-gray-500">
                        {report.category}
                      </p>

                      <div className="mt-3 flex flex-wrap gap-4 text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                          <MapPin size={14} />
                          {report.location}
                        </span>

                        <span className="flex items-center gap-1">
                          <Calendar size={14} />
                          {report.date}
                        </span>
                      </div>

                      <p className="mt-3 max-w-xl text-sm text-gray-500">
                        {report.description}
                      </p>
                    </div>
                  </div>

                  {/* Status and Action */}
                  <div className="flex flex-wrap items-center gap-3 lg:flex-col lg:items-end">
                    <span
                      className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${getStatusStyle(
                        report.status
                      )}`}
                    >
                      {getStatusIcon(report.status)}
                      {report.status}
                    </span>

                    <Link
                      to={`/item/${report.id}`}
                      className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition hover:border-[#6254C7] hover:text-[#6254C7]"
                    >
                      <Eye size={16} />
                      View Details
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-12 text-center">
                <Package
                  size={45}
                  className="mx-auto mb-4 text-gray-300"
                />

                <h3 className="font-semibold text-[#20213A]">
                  No Reports Found
                </h3>

                <p className="mt-2 text-sm text-gray-500">
                  No reports match your search or selected filter.
                </p>

                <button
                  onClick={() => {
                    setActiveFilter("All");
                    setSearchTerm("");
                  }}
                  className="mt-4 text-sm font-semibold text-[#6254C7]"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </StudentLayout>
  );
}

export default MyReports;