import { useEffect, useState } from "react";
import AdminLayout from "../layouts/AdminLayout";

import {
  Search,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  ClipboardCheck,
  AlertCircle,
  X,
} from "lucide-react";

import {
  getAllClaims,
  approveClaim,
  rejectClaim,
} from "../api/claimService";




function ManageClaims() {
  const [claims, setClaims] = useState([]);
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClaim, setSelectedClaim] = useState(null);

  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchClaims();
  }, []);

  const fetchClaims = async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      const data = await getAllClaims();

      console.log("Claims API Response:", data);

      setClaims(data);
    } catch (error) {
      console.error("Error fetching claims:", error);

      setErrorMessage(
        error.response?.data?.message ||
        "Unable to load claims. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const updateClaimStatus = async (id, newStatus) => {
    try {
      setActionLoading(true);

      let updatedClaim;

      if (newStatus === "APPROVED") {
        updatedClaim = await approveClaim(id);
      } else {
        updatedClaim = await rejectClaim(id);
      }

      setClaims((prevClaims) =>
        prevClaims.map((claim) =>
          claim.id === id ? updatedClaim : claim
        )
      );

      setSelectedClaim(updatedClaim);

    } catch (error) {
      console.error("Error updating claim:", error);

      alert(
        error.response?.data?.message ||
        "Unable to update claim status."
      );
    } finally {
      setActionLoading(false);
    }
  };

  // Statistics
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

  // Search and filter
  const filteredClaims = claims.filter((claim) => {
    const matchesFilter =
      activeFilter === "All" ||
      claim.status === activeFilter.toUpperCase();

    const studentName = claim.claimantName || "";
    const itemName = claim.itemName || "";

    const matchesSearch =
      studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      itemName.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  // Status styling
  const getStatusStyle = (status) => {
    if (status === "APPROVED") {
      return "bg-green-50 text-green-700";
    }

    if (status === "REJECTED") {
      return "bg-red-50 text-red-700";
    }

    return "bg-yellow-50 text-yellow-700";
  };

  return (
    <AdminLayout>
      <div className="space-y-8">

        {/* Heading */}
        <div>
          <p className="text-sm font-semibold text-[#6254C7]">
            CLAIM MANAGEMENT
          </p>

          <h1 className="mt-2 text-3xl font-bold text-[#20213A]">
            Manage Claims
          </h1>

          <p className="mt-2 text-gray-500">
            Review student ownership requests and manage their status.
          </p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">

          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">Total Claims</p>
              <ClipboardCheck size={22} className="text-[#6254C7]" />
            </div>

            <h2 className="mt-4 text-3xl font-bold text-[#20213A]">
              {totalClaims}
            </h2>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">Pending</p>
              <Clock size={22} className="text-yellow-600" />
            </div>

            <h2 className="mt-4 text-3xl font-bold text-[#20213A]">
              {pendingClaims}
            </h2>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">Approved</p>
              <CheckCircle size={22} className="text-green-600" />
            </div>

            <h2 className="mt-4 text-3xl font-bold text-[#20213A]">
              {approvedClaims}
            </h2>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">Rejected</p>
              <XCircle size={22} className="text-red-600" />
            </div>

            <h2 className="mt-4 text-3xl font-bold text-[#20213A]">
              {rejectedClaims}
            </h2>
          </div>
        </div>

        {/* Claims Management */}
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-7">

          {/* Search and Heading */}
          <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
            <div>
              <h2 className="text-xl font-bold text-[#20213A]">
                Student Claim Requests
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Review submitted claims and verify ownership.
              </p>
            </div>

            <div className="relative w-full lg:max-w-xs">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                placeholder="Search student or item..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-xl border border-gray-200 py-3 pl-11 pr-4 text-sm outline-none focus:border-[#6254C7]"
              />
            </div>
          </div>

          {/* Filter Buttons */}
          <div className="mt-6 flex flex-wrap gap-2">
            {["All", "Pending", "Approved", "Rejected"].map((filter) => (
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

          {/* Claims Table */}
          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[850px] text-left">
              <thead>
                <tr className="border-b border-gray-100 text-xs uppercase tracking-wide text-gray-400">
                  <th className="pb-4 font-semibold">Student</th>
                  <th className="pb-4 font-semibold">Item</th>
                  <th className="pb-4 font-semibold">Claim Date</th>
                  <th className="pb-4 font-semibold">Status</th>
                  <th className="pb-4 font-semibold">Action</th>
                </tr>
              </thead>

              <tbody>

                {loading ? (
                  <tr>
                    <td colSpan="5" className="py-12 text-center">
                      Loading claims...
                    </td>
                  </tr>
                ) : errorMessage ? (
                  <tr>
                    <td colSpan="5" className="py-12 text-center text-red-600">
                      {errorMessage}
                    </td>
                  </tr>
                ) : filteredClaims.length > 0 ? (
                  filteredClaims.map((claim) => (
                    <tr
                      key={claim.id}
                      className="border-b border-gray-50 last:border-0"
                    >
                      <td className="py-5">
                        <p className="font-semibold text-[#20213A]">
                          {claim.claimantName}
                        </p>

                        <p className="mt-1 text-xs text-gray-400">
                          Claim ID: #{claim.id}
                        </p>
                      </td>

                      <td className="py-5">
                        <p className="font-semibold text-[#20213A]">
                          {claim.itemName}
                        </p>

                        <p className="mt-1 text-xs text-gray-400">
                          Item ID: #{claim.itemId}
                        </p>
                      </td>

                      <td className="py-5 text-sm text-gray-500">
                        {claim.createdAt
                          ? new Date(claim.createdAt).toLocaleDateString("en-IN")
                          : "N/A"}
                      </td>

                      <td className="py-5">
                        <span
                          className={`rounded-full px-3 py-1.5 text-xs font-semibold ${getStatusStyle(
                            claim.status
                          )}`}
                        >
                          {claim.status}
                        </span>
                      </td>

                      <td className="py-5">
                        <button
                          onClick={() => setSelectedClaim(claim)}
                          className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-[#6254C7] transition hover:border-[#6254C7] hover:bg-purple-50"
                        >
                          <Eye size={16} />
                          Review
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="py-12 text-center">
                      <Package
                        size={40}
                        className="mx-auto mb-3 text-gray-300"
                      />

                      <p className="font-semibold text-[#20213A]">
                        No Claims Found
                      </p>

                      <p className="mt-1 text-sm text-gray-500">
                        Try changing your search or filter.
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Review Claim Modal */}
        {selectedClaim && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
            <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">

              {/* Modal Header */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-[#6254C7]">
                    CLAIM VERIFICATION
                  </p>

                  <h2 className="mt-1 text-xl font-bold text-[#20213A]">
                    Review Claim
                  </h2>
                </div>

                <button
                  onClick={() => setSelectedClaim(null)}
                  className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
                >
                  <X size={21} />
                </button>
              </div>

              {/* Student Information */}
              <div className="mt-6 rounded-xl bg-gray-50 p-4">
                <h3 className="font-semibold text-[#20213A]">
                  Student Information
                </h3>

                <p className="mt-3 text-sm text-gray-600">
                  Name: {selectedClaim.claimantName}
                </p>

                <p className="mt-2 text-sm text-gray-600">
                  Claim ID: #{selectedClaim.id}
                </p>
              </div>

              {/* Item Information */}
              <div className="mt-4 rounded-xl bg-purple-50 p-4">
                <div className="flex items-center gap-3">
                  <Package className="text-[#6254C7]" size={23} />

                  <div>
                    <h3 className="font-semibold text-[#20213A]">
                      {selectedClaim.itemName}
                    </h3>

                    <p className="text-sm text-gray-500">
                      Item ID: #{selectedClaim.itemId}
                    </p>
                  </div>
                </div>
              </div>

              {/* Ownership Proof */}
              <div className="mt-5">
                <h3 className="font-semibold text-[#20213A]">
                  Student's Proof of Ownership
                </h3>

                <p className="mt-2 rounded-xl border border-gray-100 p-4 text-sm leading-6 text-gray-600">
                  {selectedClaim.proof}
                </p>
              </div>

              <div className="mt-4 flex items-start gap-3 rounded-xl bg-yellow-50 p-4">
                <AlertCircle
                  size={20}
                  className="shrink-0 text-yellow-600"
                />

                <p className="text-sm leading-6 text-gray-600">
                  Carefully verify the student's information and ownership
                  proof before making a decision.
                </p>
              </div>

              {selectedClaim.additionalInfo && (
                <div className="mt-4">
                  <h3 className="font-semibold text-[#20213A]">
                    Additional Information
                  </h3>

                  <p className="mt-2 rounded-xl border border-gray-100 p-4 text-sm text-gray-600">
                    {selectedClaim.additionalInfo}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              {selectedClaim.status === "PENDING" ? (
                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <button
                    onClick={() =>
                      updateClaimStatus(selectedClaim.id, "APPROVED")
                    }
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-green-600 py-3 font-semibold text-white transition hover:bg-green-700"
                  >
                    <CheckCircle size={18} />
                    Approve Claim
                  </button>

                  <button
                    onClick={() =>
                      updateClaimStatus(selectedClaim.id, "REJECTED")
                    }
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-600 py-3 font-semibold text-white transition hover:bg-red-700"
                  >
                    <XCircle size={18} />
                    Reject Claim
                  </button>
                </div>
              ) : (
                <div className="mt-6 rounded-xl bg-gray-50 p-4 text-center">
                  <p className="text-sm font-semibold text-gray-600">
                    This claim has already been {selectedClaim.status.toLowerCase()}.
                  </p>
                </div>
              )}

            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export default ManageClaims;