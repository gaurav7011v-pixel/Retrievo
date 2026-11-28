import { useEffect, useState } from "react";
import api from "../api/axios";
import { useParams, Link } from "react-router-dom";
import StudentLayout from "../layouts/StudentLayout";
import { getItemById } from "../api/itemService";

import {
  ArrowLeft,
  MapPin,
  Calendar,
  Package,
  Tag,
  Info,
  ShieldCheck,
} from "lucide-react";


// Public layout for visitors who are not logged in
function PublicLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="border-b border-gray-100 bg-white px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-[#6254C7]">
            Retrievo
          </Link>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:text-[#6254C7]"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="rounded-lg bg-[#6254C7] px-4 py-2 text-sm font-semibold text-white hover:bg-[#5143B5]"
            >
              Register
            </Link>
          </div>
        </div>
      </nav>

      <main className="px-5 py-10 md:px-8">
        {children}
      </main>
    </div>
  );
}


function ItemDetails() {
  const { id } = useParams();

  // Get logged-in user information from both storage locations
  const token =
    localStorage.getItem("token") ||
    sessionStorage.getItem("token");

  const storedUser =
    localStorage.getItem("user") ||
    sessionStorage.getItem("user");

  let savedUser = null;

  try {
    savedUser = JSON.parse(storedUser || "null");
  } catch (error) {
    savedUser = null;
  }

  // Only logged-in students should see StudentLayout
  const isStudent = Boolean(token) && savedUser?.role === "STUDENT";

  // Select the layout
  const PageLayout = isStudent ? StudentLayout : PublicLayout;

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");


  // Fetch item details from backend
  useEffect(() => {
    const fetchItem = async () => {
      try {
        setLoading(true);
        setErrorMessage("");

        const data = await getItemById(id);
        setItem(data);

      } catch (error) {
        console.error("Error fetching item:", error);

        setErrorMessage(
          error.response?.data?.message ||
          "Unable to load item details. Please try again."
        );

      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [id]);


  // Loading state
  if (loading) {
    return (
      <PageLayout>
        <div className="py-20 text-center text-gray-500">
          Loading item details...
        </div>
      </PageLayout>
    );
  }


  // Error or item not found
  if (errorMessage || !item) {
    return (
      <PageLayout>
        <div className="mx-auto max-w-4xl rounded-2xl bg-white p-12 text-center shadow-sm">

          <Package
            size={40}
            className="mx-auto mb-4 text-gray-400"
          />

          <h2 className="text-xl font-bold text-gray-800">
            Item Not Found
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            {errorMessage ||
              "The item you're looking for does not exist."}
          </p>

          <Link
            to={isStudent ? "/search-items" : "/"}
            className="mt-6 inline-flex rounded-xl bg-[#6254C7] px-5 py-3 text-sm font-semibold text-white hover:bg-[#5143B5]"
          >
            Browse Items
          </Link>

        </div>
      </PageLayout>
    );
  }


  // Main item details page
  return (
    <PageLayout>
      <div className="mx-auto max-w-6xl">

        {/* Back Button */}
        <Link
          to={isStudent ? "/search-items" : "/"}
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-[#6254C7]"
        >
          <ArrowLeft size={17} />
          {isStudent ? "Back to Browse Items" : "Back to Home"}
        </Link>


        {/* Page Heading */}
        <div className="mb-7">
          <h1 className="text-2xl font-bold text-gray-800 md:text-3xl">
            Item Details
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            View complete information about this reported item.
          </p>
        </div>


        {/* Main Details Card */}
        <div className="grid gap-8 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm md:grid-cols-2 md:p-8">


          {/* Item Image */}
          <div>
            <div className="overflow-hidden rounded-2xl bg-gray-100">
              {item.imageUrl ? (
                <img
                  src={
                    item.imageUrl.startsWith("http")
                      ? item.imageUrl
                      : `${api.defaults.baseURL.replace("/api", "")}${item.imageUrl}`
                  }
                  alt={item.itemName}
                  className="h-72 w-full object-cover md:h-96"
                />
              ) : (
                <div className="flex h-72 w-full items-center justify-center bg-purple-50 md:h-96">
                  <Package size={70} className="text-[#6254C7]" />
                </div>
              )}
            </div>

            <div className="mt-4 flex items-center gap-2 rounded-xl bg-purple-50 p-4 text-sm text-[#6254C7]">
              <ShieldCheck size={20} />

              <p>
                Always verify item ownership before handing over belongings.
              </p>
            </div>
          </div>


          {/* Item Information */}
          <div>

            {/* Item Type and Category */}
            <div className="mb-5 flex flex-wrap items-center gap-3">

              <span
                className={`rounded-full px-4 py-1.5 text-xs font-semibold ${item.itemType === "LOST"
                  ? "bg-red-100 text-red-600"
                  : "bg-green-100 text-green-600"
                  }`}
              >
                {item.itemType} Item
              </span>

              <span className="rounded-full bg-purple-50 px-4 py-1.5 text-xs font-semibold text-[#6254C7]">
                {item.category}
              </span>

            </div>


            {/* Item Name */}
            <h2 className="text-2xl font-bold text-gray-800 md:text-3xl">
              {item.itemName}
            </h2>


            {/* Description */}
            <div className="mt-7">

              <h3 className="mb-3 flex items-center gap-2 font-semibold text-gray-800">
                <Info size={19} className="text-[#6254C7]" />
                Description
              </h3>

              <p className="text-sm leading-7 text-gray-500">
                {item.description || "No description provided."}
              </p>

            </div>


            {/* Additional Information */}
            <div className="mt-8 space-y-5 border-t border-gray-100 pt-6">

              {/* Location */}
              <div className="flex items-start gap-3">

                <div className="rounded-lg bg-purple-50 p-2 text-[#6254C7]">
                  <MapPin size={19} />
                </div>

                <div>
                  <p className="text-xs text-gray-400">
                    Location
                  </p>

                  <p className="mt-1 text-sm font-medium text-gray-700">
                    {item.location}
                  </p>
                </div>

              </div>


              {/* Date */}
              <div className="flex items-start gap-3">

                <div className="rounded-lg bg-purple-50 p-2 text-[#6254C7]">
                  <Calendar size={19} />
                </div>

                <div>
                  <p className="text-xs text-gray-400">
                    Date Reported
                  </p>

                  <p className="mt-1 text-sm font-medium text-gray-700">
                    {item.itemDate}
                  </p>
                </div>

              </div>


              {/* Category */}
              <div className="flex items-start gap-3">

                <div className="rounded-lg bg-purple-50 p-2 text-[#6254C7]">
                  <Tag size={19} />
                </div>

                <div>
                  <p className="text-xs text-gray-400">
                    Category
                  </p>

                  <p className="mt-1 text-sm font-medium text-gray-700">
                    {item.category}
                  </p>
                </div>

              </div>

            </div>


            {/* Action Button */}
            {item.itemType === "FOUND" ? (

              <Link
                to={isStudent ? `/claim/${item.id}` : "/login"}
                className="mt-8 flex w-full items-center justify-center rounded-xl bg-[#6254C7] px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-purple-200 transition hover:bg-[#5143B5]"
              >
                {isStudent ? "Claim This Item" : "Login to Claim This Item"}
              </Link>

            ) : (

              <div className="mt-8 rounded-xl bg-orange-50 p-4 text-sm text-orange-700">
                This item has been reported lost. Keep checking the Browse Items page for updates.
              </div>

            )}

          </div>

        </div>
      </div>
    </PageLayout>
  );
}

export default ItemDetails;