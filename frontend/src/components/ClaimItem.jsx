import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import StudentLayout from "../layouts/StudentLayout";
import { getItemById } from "../api/itemService";
import { submitClaim } from "../api/claimService";

import {
  Package,
  ArrowLeft,
  Send,
  ShieldCheck,
  CheckCircle,
  AlertCircle,
} from "lucide-react";


function ClaimItem() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    proof: "",
    additionalInfo: "",
  });

  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // Fetch item details
  useEffect(() => {
    const fetchItem = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getItemById(id);

        if (data.itemType !== "FOUND") {
          setError("Only found items can be claimed.");
          return;
        }

        setItem(data);

      } catch (error) {
        console.error("Error fetching item:", error);

        setError(
          error.response?.data?.message ||
          "Unable to load item details."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [id]);

  // Update form fields
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Submit claim
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.proof.trim()) {
      setError("Please provide proof of ownership.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      const claimData = {
        itemId: Number(id),
        proof: formData.proof,
        additionalInfo: formData.additionalInfo,
      };

      const response = await submitClaim(claimData);

      console.log("Claim submitted:", response);

      setSubmitted(true);

    } catch (error) {
      console.error("Claim submission failed:", error);

      setError(
        error.response?.data?.message ||
        "Unable to submit claim. Please try again."
      );

    } finally {
      setSubmitting(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <StudentLayout>
        <div className="py-20 text-center text-gray-500">
          Loading item details...
        </div>
      </StudentLayout>
    );
  }

  // Item not found or invalid
  if (!item) {
    return (
      <StudentLayout>
        <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
          <Package size={55} className="mb-4 text-gray-300" />

          <h2 className="text-2xl font-bold text-[#20213A]">
            Unable to Claim Item
          </h2>

          <p className="mt-2 text-gray-500">
            {error || "The requested item could not be found."}
          </p>

          <Link
            to="/search-items"
            className="mt-6 rounded-xl bg-[#6254C7] px-6 py-3 font-semibold text-white"
          >
            Browse Items
          </Link>
        </div>
      </StudentLayout>
    );
  }

  return (
    <StudentLayout>
      <div className="mx-auto max-w-3xl">

        {/* Back Button */}
        <Link
          to={`/item/${item.id}`}
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-[#6254C7]"
        >
          <ArrowLeft size={17} />
          Back to Item Details
        </Link>

        {/* Page Heading */}
        <div className="mb-8">
          <p className="text-sm font-semibold text-[#6254C7]">
            CLAIM REQUEST
          </p>

          <h1 className="mt-2 text-3xl font-bold text-[#20213A]">
            Claim This Item
          </h1>

          <p className="mt-2 text-gray-500">
            Provide information that helps verify your ownership.
          </p>
        </div>

        {/* Item Information */}
        <div className="mb-7 flex items-center gap-4 rounded-2xl border border-purple-100 bg-purple-50 p-5">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white text-[#6254C7]">
            <Package size={28} />
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
              Item you are claiming
            </p>

            <h2 className="mt-1 text-lg font-bold text-[#20213A]">
              {item.itemName}
            </h2>

            <p className="text-sm text-gray-500">
              {item.category}
            </p>
          </div>
        </div>

        {/* Success Message */}
        {submitted ? (
          <div className="rounded-2xl border border-green-200 bg-green-50 p-8 text-center">
            <CheckCircle
              size={55}
              className="mx-auto mb-4 text-green-600"
            />

            <h2 className="text-2xl font-bold text-green-800">
              Claim Submitted!
            </h2>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-green-700">
              Your claim has been submitted successfully. The administrator
              will review your information and contact you regarding the
              verification process.
            </p>

            <button
              onClick={() => navigate("/my-claims")}
              className="mt-6 rounded-xl bg-green-600 px-6 py-3 font-semibold text-white transition hover:bg-green-700"
            >
              View My Claims
            </button>
          </div>
        ) : (
          <>
            {/* Claim Form */}
            <form
              onSubmit={handleSubmit}
              className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8"
            >
              <h2 className="text-xl font-bold text-[#20213A]">
                Your Information
              </h2>

              <p className="mb-6 mt-1 text-sm text-gray-500">
                Enter your details so the administrator can contact you.
              </p>


              {/* Proof of Ownership */}
              <div className="mb-5">
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Proof of Ownership *
                </label>

                <textarea
                  name="proof"
                  value={formData.proof}
                  onChange={handleChange}
                  rows="5"
                  placeholder="Describe specific details that prove this item belongs to you. For example, unique marks, stickers, contents, or other identifying features."
                  className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-[#6254C7] focus:ring-2 focus:ring-purple-100"
                />

                <p className="mt-2 text-xs text-gray-400">
                  Avoid sharing details that are already visible in the public listing.
                </p>
              </div>

              {/* Additional Information */}
              <div className="mb-6">
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Additional Information
                  <span className="ml-2 font-normal text-gray-400">
                    (Optional)
                  </span>
                </label>

                <textarea
                  name="additionalInfo"
                  value={formData.additionalInfo}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Anything else you would like the administrator to know?"
                  className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-[#6254C7] focus:ring-2 focus:ring-purple-100"
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-5 flex items-center gap-2 rounded-xl bg-red-50 p-4 text-sm text-red-600">
                  <AlertCircle size={18} />
                  {error}
                </div>
              )}

              {/* Privacy Notice */}
              <div className="mb-6 flex gap-3 rounded-xl bg-gray-50 p-4">
                <ShieldCheck
                  size={22}
                  className="shrink-0 text-[#6254C7]"
                />

                <p className="text-sm leading-6 text-gray-600">
                  Your claim information will be used by the administrator
                  for ownership verification. Submitting a claim does not
                  guarantee approval.
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#6254C7] py-3.5 font-semibold text-white transition hover:bg-[#5143B5] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Send size={18} />
                {submitting ? "Submitting Claim..." : "Submit Claim"}
              </button>
            </form>
          </>
        )}
      </div>
    </StudentLayout>
  );
}

export default ClaimItem;