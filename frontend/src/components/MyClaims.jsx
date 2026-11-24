import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import StudentLayout from "../layouts/StudentLayout";
import { getMyClaims } from "../api/claimService";

import {
  Package,
  Search,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  FileText,
} from "lucide-react";


function MyClaims() {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const [activeFilter, setActiveFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch logged-in student's claims
  useEffect(() => {
    const fetchClaims = async () => {
      try {
        setLoading(true);
        setErrorMessage("");

        const data = await getMyClaims();

        setClaims(data);
      } catch (error) {
        console.error("Error fetching claims:", error);

        setErrorMessage(
          error.response?.data?.message ||
          "Unable to load your claims. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchClaims();
  }, []);

  const totalClaims = claims.length;

  const pendingClaims = claims.filter(
    (claim) => claim.status === "PENDING"
  ).length;

  const approvedClaims = claims.filter(
    (claim) => claim.status === "APPROVED"
  ).length;

  const rejectedClaims = claims.filter(
    (claim) => claim.status === "REJECTED"
  ).length;


  const filteredClaims = claims.filter((claim) => {
    const matchesFilter =
      activeFilter === "All" ||
      claim.status === activeFilter;

    const matchesSearch =
      claim.itemName?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  // Status badge
  const getStatusStyle = (status) => {
    if (status === "APPROVED") {
      return "bg-green-50 text-green-700";
    }

    if (status === "REJECTED") {
      return "bg-red-50 text-red-700";
    }

    return "bg-yellow-50 text-yellow-700";
  };

  // Status icon
  const getStatusIcon = (status) => {
    if (status === "APPROVED") {
      return <CheckCircle size={15} />;
    }

    if (status === "REJECTED") {
      return <XCircle size={15} />;
    }

    return <Clock size={15} />;
  };

  return (
    <StudentLayout>
      <div className="space-y-8">

        {/* Heading */}
        <div>
          <p className="text-sm font-semibold text-[#6254C7]">
            CLAIM MANAGEMENT
          </p>

          <h1 className="mt-2 text-3xl font-bold text-[#20213A]">
            My Claims
          </h1>

          <p className="mt-2 text-gray-500">
            Track the status of items you have requested to claim.
          </p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">

          {/* Total */}
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">Total Claims</p>
              <div className="rounded-xl bg-purple-50 p-3 text-[#6254C7]">
                <FileText size={21} />
              </div>
            </div>

            <h2 className="mt-4 text-3xl font-bold text-[#20213A]">
              {totalClaims}
            </h2>
          </div>

          {/* Pending */}
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">Pending</p>
              <div className="rounded-xl bg-yellow-50 p-3 text-yellow-600">
                <Clock size={21} />
              </div>
            </div>

            <h2 className="mt-4 text-3xl font-bold text-[#20213A]">
              {pendingClaims}
            </h2>
          </div>

          {/* Approved */}
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">Approved</p>
              <div className="rounded-xl bg-green-50 p-3 text-green-600">
                <CheckCircle size={21} />
              </div>
            </div>

            <h2 className="mt-4 text-3xl font-bold text-[#20213A]">
              {approvedClaims}
            </h2>
          </div>

          {/* Rejected */}
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">Rejected</p>
              <div className="rounded-xl bg-red-50 p-3 text-red-600">
                <XCircle size={21} />
              </div>
            </div>

            <h2 className="mt-4 text-3xl font-bold text-[#20213A]">
              {rejectedClaims}
            </h2>
          </div>
        </div>

        {/* Claims Section */}
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-7">

          {/* Search and Filters */}
          <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">

            <div>
              <h2 className="text-xl font-bold text-[#20213A]">
                Your Claim Requests
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                View and manage your submitted claims.
              </p>
            </div>

            {/* Search */}
            <div className="relative w-full lg:max-w-xs">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                placeholder="Search by item name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-xl border border-gray-200 py-3 pl-11 pr-4 text-sm outline-none focus:border-[#6254C7]"
              />
            </div>
          </div>

          {/* Filter Buttons */}
          <div className="mt-6 flex flex-wrap gap-2">
            {["All", "PENDING", "APPROVED", "REJECTED"].map((filter) => (
              <button
                key={filter === "All"
                  ? "All"
                  : filter.charAt(0) + filter.slice(1).toLowerCase()}
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

          {/* Claims List */}
          <div className="mt-6 space-y-4">

            {filteredClaims.length > 0 ? (
              filteredClaims.map((claim) => (
                <div
                  key={claim.id}
                  className="flex flex-col justify-between gap-5 rounded-xl border border-gray-100 p-5 transition hover:border-purple-200 md:flex-row md:items-center"
                >
                  {/* Item Information */}
                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-[#6254C7]">
                      <Package size={27} />
                    </div>

                    <div>
                      <h3 className="font-bol,.d text-[#20213A]">
                        {claim.itemName}
                      </h3>

                      <p className="mt-1 text-sm text-gray-500">
                        Claim ID: #{claim.id}
                      </p>

                      <p className="mt-2 text-xs text-gray-400">
                        Submitted on{" "}
                        {new Date(claim.createdAt).toLocaleDateString("en-IN")}
                      </p>

                      <p className="mt-2 max-w-lg text-sm text-gray-500">
                        <span className="font-medium text-gray-700">
                          Proof:
                        </span>{" "}
                        {claim.proof}
                      </p>

                      {claim.additionalInfo && (
                        <p className="mt-1 max-w-lg text-sm text-gray-500">
                          <span className="font-medium text-gray-700">
                            Additional Information:
                          </span>{" "}
                          {claim.additionalInfo}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Status and Action */}
                  <div className="flex flex-wrap items-center gap-3 md:flex-col md:items-end">

                    <span
                      className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${getStatusStyle(
                        claim.status
                      )}`}
                    >
                      {getStatusIcon(claim.status)}
                      {claim.status}
                    </span>

                    <Link
                      to={`/item/${claim.itemId}`}
                      className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition hover:border-[#6254C7] hover:text-[#6254C7]"
                    >
                      <Eye size={16} />
                      View Item
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
                  No Claims Found
                </h3>

                <p className="mt-2 text-sm text-gray-500">
                  No claims match your current search or filter.
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

export default MyClaims;