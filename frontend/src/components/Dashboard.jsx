import { useEffect, useState } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";
import { getMyReports } from "../api/itemService";
import { getMyClaims } from "../api/claimService";
import StudentLayout from "../layouts/StudentLayout";
import {
  Package,
  Search,
  CheckCircle2,
  Clock,
  Plus,
  ArrowUpRight,
  ArrowRight,
  MapPin,
  CalendarDays,
  TrendingUp,
  FileText,
} from "lucide-react";


function Dashboard() {
  const [reports, setReports] = useState([]);
  const [claims, setClaims] = useState([]);

  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      const [reportsData, claimsData] = await Promise.all([
        getMyReports(),
        getMyClaims()
      ]);

      setReports(reportsData);
      setClaims(claimsData);

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

  const statistics = [
    {
      title: "Total Reports",
      value: reports.length,
      description: "All submitted reports",
      icon: FileText,
      color: "bg-purple-100 text-[#6254C7]",
    },
    {
      title: "Lost Items",
      value: reports.filter(
        (item) => item.itemType === "LOST"
      ).length,
      description: "Items reported lost",
      icon: Package,
      color: "bg-red-100 text-red-500",
    },
    {
      title: "Found Items",
      value: reports.filter(
        (item) => item.itemType === "FOUND"
      ).length,
      description: "Items reported found",
      icon: Search,
      color: "bg-blue-100 text-blue-500",
    },
    {
      title: "Recovered",
      value: reports.filter(
        (item) => item.status === "RETURNED"
      ).length,
      description: "Successfully recovered",
      icon: CheckCircle2,
      color: "bg-green-100 text-green-600",
    },
  ];

  const recentReports = [...reports]
    .sort(
      (a, b) =>
        new Date(b.createdAt) - new Date(a.createdAt)
    )
    .slice(0, 3)
    .map((item) => ({
      id: item.id,
      name: item.itemName,
      category: item.category,
      location: item.location,
      date: item.itemDate
        ? new Date(item.itemDate).toLocaleDateString("en-IN")
        : "N/A",
      status: item.itemType === "LOST" ? "Lost" : "Found",
      progress:
        item.status === "RETURNED"
          ? "Recovered"
          : item.status === "CLAIMED"
            ? "Claimed"
            : item.status === "CLOSED"
              ? "Closed"
              : "Active",
      image: item.imageUrl || "",
    }));

  const activities = [
    ...claims.map((claim) => ({
      id: `claim-${claim.id}`,
      createdAt: claim.createdAt,
      title:
        claim.status === "APPROVED"
          ? "Your claim was approved"
          : claim.status === "REJECTED"
            ? "Your claim was rejected"
            : "Your claim is awaiting review",
      description: claim.itemName,
      icon:
        claim.status === "APPROVED"
          ? CheckCircle2
          : Clock,
      color:
        claim.status === "APPROVED"
          ? "bg-green-100 text-green-600"
          : claim.status === "REJECTED"
            ? "bg-red-100 text-red-600"
            : "bg-yellow-100 text-yellow-600",
    })),

    ...reports.map((item) => ({
      id: `report-${item.id}`,
      createdAt: item.createdAt,
      title: "New item report submitted",
      description: item.itemName,
      icon: Package,
      color: "bg-purple-100 text-[#6254C7]",
    })),
  ]
    .sort(
      (a, b) =>
        new Date(b.createdAt) - new Date(a.createdAt)
    )
    .slice(0, 3)
    .map((activity) => ({
      ...activity,
      time: activity.createdAt
        ? new Date(activity.createdAt).toLocaleString("en-IN")
        : "Date unavailable",
    }));


  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");

  const studentName = storedUser.fullName || "Student";

  const currentDate = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).toUpperCase();

  return (
    <StudentLayout>

      {/* WELCOME SECTION */}
      <section className="flex flex-col justify-between gap-6 rounded-3xl bg-gradient-to-r from-[#6254C7] to-[#8D80F0] p-7 text-white shadow-xl shadow-purple-100 sm:p-9 md:flex-row md:items-center">

        <div>
          <p className="text-sm font-medium text-purple-100">
            {currentDate}
          </p>

          <h1 className="mt-3 text-3xl font-extrabold sm:text-4xl">
            Welcome back, {studentName}! 👋
          </h1>

          <p className="mt-3 max-w-lg leading-7 text-purple-100">
            Here's what's happening with your lost and found
            items. Let's get your belongings back!
          </p>
        </div>

        <Link
          to="/report-lost"
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3.5 font-bold text-[#6254C7] shadow-lg transition hover:-translate-y-1"
        >
          <Plus size={20} />
          Report an Item
        </Link>

      </section>

      {/* STATISTICS */}
      <section className="mt-9">

        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold">Your Overview</h2>
            <p className="mt-1 text-sm text-gray-500">
              A summary of your activity on Retrievo.
            </p>
          </div>

          <span className="hidden items-center gap-1 text-sm font-semibold text-green-600 sm:flex">
            <TrendingUp size={17} />
            Your activity
          </span>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">

          {statistics.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.title}
                className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >

                <div className="flex items-center justify-between">
                  <div className={`rounded-xl p-3 ${stat.color}`}>
                    <Icon size={23} />
                  </div>

                  <ArrowUpRight size={19} className="text-gray-300" />
                </div>

                <h3 className="mt-5 text-3xl font-extrabold">
                  {loading ? "..." : stat.value}
                </h3>

                <p className="mt-1 font-semibold text-gray-700">
                  {stat.title}
                </p>

                <p className="mt-1 text-xs text-gray-400">
                  {stat.description}
                </p>

              </div>
            );
          })}

        </div>
      </section>

      {/* QUICK ACTIONS */}
      <section className="mt-10">

        <h2 className="text-xl font-extrabold">Quick Actions</h2>

        <p className="mt-1 text-sm text-gray-500">
          What would you like to do today?
        </p>

        <div className="mt-5 grid gap-4 sm:grid-cols-3">

          <Link
            to="/report-lost"
            className="group flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-5 transition hover:border-red-200 hover:shadow-lg"
          >
            <div className="rounded-xl bg-red-100 p-4 text-red-500">
              <Package size={25} />
            </div>

            <div className="flex-1">
              <h3 className="font-bold">Report Lost Item</h3>
              <p className="mt-1 text-xs text-gray-500">
                Missing something?
              </p>
            </div>

            <ArrowRight size={19} className="text-gray-300 transition group-hover:translate-x-1 group-hover:text-red-500" />
          </Link>

          <Link
            to="/report-found"
            className="group flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-5 transition hover:border-green-200 hover:shadow-lg"
          >
            <div className="rounded-xl bg-green-100 p-4 text-green-600">
              <Plus size={25} />
            </div>

            <div className="flex-1">
              <h3 className="font-bold">Report Found Item</h3>
              <p className="mt-1 text-xs text-gray-500">
                Found someone's item?
              </p>
            </div>

            <ArrowRight size={19} className="text-gray-300 transition group-hover:translate-x-1 group-hover:text-green-500" />
          </Link>

          <Link
            to="/search-items"
            className="group flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-5 transition hover:border-purple-200 hover:shadow-lg"
          >
            <div className="rounded-xl bg-purple-100 p-4 text-[#6254C7]">
              <Search size={25} />
            </div>

            <div className="flex-1">
              <h3 className="font-bold">Browse Items</h3>
              <p className="mt-1 text-xs text-gray-500">
                Search reported items.
              </p>
            </div>

            <ArrowRight size={19} className="text-gray-300 transition group-hover:translate-x-1 group-hover:text-[#6254C7]" />
          </Link>

        </div>
      </section>

      {/* RECENT REPORTS + ACTIVITY */}
      <section className="mt-10 grid gap-7 xl:grid-cols-3">

        {/* RECENT REPORTS */}
        <div className="rounded-2xl border border-gray-100 bg-white p-5 sm:p-6 xl:col-span-2">

          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-extrabold">Recent Reports</h2>
              <p className="mt-1 text-sm text-gray-500">
                Your recently submitted items.
              </p>
            </div>

            <Link
              to="/my-reports"
              className="flex items-center gap-1 text-sm font-bold text-[#6254C7] hover:gap-2"
            >
              View All
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="mt-6 space-y-4">

            {loading ? (
              <p className="py-6 text-center text-gray-500">
                Loading your reports...
              </p>
            ) : errorMessage ? (
              <div className="py-6 text-center">
                <p className="text-sm text-red-500">
                  {errorMessage}
                </p>

                <button
                  onClick={fetchDashboardData}
                  className="mt-2 text-sm font-semibold text-[#6254C7] hover:underline"
                >
                  Try Again
                </button>
              </div>
            ) : recentReports.length > 0 ? (
              recentReports.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col gap-4 rounded-xl border border-gray-100 p-3 transition hover:bg-purple-50/40 sm:flex-row sm:items-center"
                >

                  <img
                    src={
                      item.image
                        ? item.image.startsWith("http")
                          ? item.image
                          : `${api.defaults.baseURL.replace("/api", "")}${item.image}`
                        : "https://placehold.co/300x200?text=No+Image"
                    }
                    alt={item.name}
                    className="h-20 w-full rounded-xl object-cover sm:w-20"
                  />

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-bold">{item.name}</h3>

                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-bold ${item.status === "Lost"
                          ? "bg-red-100 text-red-600"
                          : "bg-green-100 text-green-600"
                          }`}
                      >
                        {item.status}
                      </span>
                    </div>

                    <p className="mt-1 text-xs text-gray-500">
                      {item.category}
                    </p>

                    <div className="mt-2 flex flex-wrap gap-3 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <MapPin size={13} />
                        {item.location}
                      </span>

                      <span className="flex items-center gap-1">
                        <CalendarDays size={13} />
                        {item.date}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`w-fit shrink-0 rounded-lg px-3 py-2 text-xs font-bold ${item.progress === "Recovered"
                      ? "bg-green-50 text-green-600"
                      : item.progress === "Under Review"
                        ? "bg-yellow-50 text-yellow-600"
                        : "bg-blue-50 text-blue-600"
                      }`}
                  >
                    {item.progress}
                  </span>

                </div>
              ))
            ) : (
              <p className="py-6 text-center text-gray-500">
                You haven't submitted any reports yet.
              </p>
            )}

          </div>
        </div>

        {/* RECENT ACTIVITY */}
        <div className="rounded-2xl border border-gray-100 bg-white p-5 sm:p-6">

          <h2 className="text-xl font-extrabold">Recent Activity</h2>

          <p className="mt-1 text-sm text-gray-500">
            Latest updates on your account.
          </p>

          <div className="mt-7 space-y-7">

            {loading ? (
              <p className="text-sm text-gray-500">
                Loading activity...
              </p>
            ) : errorMessage ? (
              <p className="text-sm text-red-500">
                Unable to load recent activity.
              </p>
            ) : activities.length > 0 ? (
              activities.map((activity) => {
                const Icon = activity.icon;

                return (
                  <div key={activity.id} className="flex gap-3">

                    <div className={`h-fit rounded-xl p-3 ${activity.color}`}>
                      <Icon size={19} />
                    </div>

                    <div>
                      <h3 className="text-sm font-bold">
                        {activity.title}
                      </h3>

                      <p className="mt-1 text-xs text-gray-500">
                        {activity.description}
                      </p>

                      <p className="mt-2 text-xs text-gray-400">
                        {activity.time}
                      </p>
                    </div>

                  </div>
                );
              })
            ) : (
              <p className="text-sm text-gray-500">
                No recent activity yet.
              </p>
            )}

          </div>

          <Link
            to="/my-claims"
            className="mt-8 flex items-center justify-center gap-2 rounded-xl border border-purple-100 py-3 text-sm font-bold text-[#6254C7] transition hover:bg-purple-50"
          >
            View My Claims
            <ArrowRight size={17} />
          </Link>

        </div>

      </section>

      {/* BOTTOM INFORMATION */}
      <section className="mt-9 flex flex-col justify-between gap-4 rounded-2xl border border-purple-100 bg-purple-50 p-6 sm:flex-row sm:items-center">

        <div>
          <h3 className="font-bold text-[#34305F]">
            Need help recovering an item?
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            Browse the reported items and submit an ownership claim.
          </p>
        </div>

        <Link
          to="/search-items"
          className="flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#6254C7] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#5143B5]"
        >
          Find My Item
          <Search size={17} />
        </Link>

      </section>

    </StudentLayout>
  );
}

export default Dashboard;