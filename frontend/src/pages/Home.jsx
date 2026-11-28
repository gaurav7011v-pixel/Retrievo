import { useEffect, useState } from "react";
import api from "../api/axios";
import { getAllItems } from "../api/itemService";
import { Link } from "react-router-dom";
import {
  Search,
  ArrowRight,
  MapPin,
  CalendarDays,
  Package,
  ShieldCheck,
  Users,
  Heart,
  Plus,
  ArrowUpRight,
} from "lucide-react";


const categories = ["All Items", "Lost", "Found"];

function Home() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All Items");
  const [user] = useState(() => {
    const storedUser =
      localStorage.getItem("user") ||
      sessionStorage.getItem("user");

    try {
      return JSON.parse(storedUser || "null");
    } catch {
      return null;
    }
  });

  const token =
    localStorage.getItem("token") ||
    sessionStorage.getItem("token");

  const isLoggedIn = Boolean(token && user);

  const isStudent = isLoggedIn && user?.role === "STUDENT";

  const dashboardPath =
    user?.role === "ADMIN" ? "/admin/dashboard" : "/dashboard";

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);

        const data = await getAllItems();

        setItems(data);
      } catch (err) {
        console.error("Failed to fetch items:", err);
        setError("Unable to load items. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  const filteredItems = items.filter((item) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      (item.itemName || "").toLowerCase().includes(searchText) ||
      (item.location || "").toLowerCase().includes(searchText) ||
      (item.category || "").toLowerCase().includes(searchText);

    const matchesCategory =
      activeCategory === "All Items" ||
      item.itemType === activeCategory.toUpperCase();

    return matchesSearch && matchesCategory;
  });

  const totalItems = items.length;

  const recoveredItems = items.filter(
    (item) => item.status === "RETURNED"
  ).length;

  return (
    <div className="min-h-screen bg-[#F8F7FC] text-[#20213A]">

      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 border-b border-gray-100 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#6254C7] text-white">
              <Package size={23} />
            </div>

            <span className="text-2xl font-bold tracking-tight">
              retrievo<span className="text-[#6254C7]">.</span>
            </span>
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            <a href="#" className="font-medium text-[#6254C7]">
              Home
            </a>

            <a
              href="#recent"
              className="font-medium text-gray-500 transition hover:text-[#6254C7]"
            >
              Browse Items
            </a>

            <a
              href="#how-it-works"
              className="font-medium text-gray-500 transition hover:text-[#6254C7]"
            >
              How It Works
            </a>
          </div>

          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              <>
                <span className="hidden text-sm font-medium text-gray-600 sm:block">
                  Welcome, {user.fullName}
                </span>

                <Link
                  to={dashboardPath}
                  className="rounded-xl bg-[#6254C7] px-5 py-2.5 font-semibold text-white shadow-lg shadow-purple-200 transition hover:bg-[#5143B5]"
                >
                  Dashboard
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="hidden rounded-xl px-4 py-2.5 font-semibold text-gray-700 transition hover:bg-gray-100 sm:block"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="rounded-xl bg-[#6254C7] px-5 py-2.5 font-semibold text-white shadow-lg shadow-purple-200 transition hover:bg-[#5143B5]"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative overflow-hidden">
        <div className="absolute -right-40 -top-40 h-96 w-96 rounded-full bg-purple-300/40 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-indigo-300/40 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 md:grid-cols-2 md:py-28">

          {/* LEFT CONTENT */}
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-purple-100 bg-white px-4 py-2 text-sm font-semibold text-[#6254C7]">
              <ShieldCheck size={17} />
              Your Campus Lost & Found Community
            </div>

            <h1 className="max-w-xl text-5xl font-extrabold leading-tight tracking-tight md:text-6xl">
              Lost something?
              <span className="block text-[#6254C7]">
                Let's find it.
              </span>
            </h1>

            <p className="mt-6 max-w-lg text-lg leading-8 text-gray-500">
              A smarter way to reconnect students with their lost
              belongings. Report an item, discover found belongings
              and help make your campus a better place.
            </p>

            {/* SEARCH BAR */}
            <div className="mt-9 flex max-w-xl items-center rounded-2xl border border-gray-200 bg-white p-2 shadow-xl shadow-purple-100/50">
              <Search className="ml-3 text-gray-400" size={22} />

              <input
                type="text"
                placeholder="Search for an item..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  document
                    .getElementById("recent")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
                className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm outline-none placeholder:text-gray-400"
              />

              <button
                onClick={() =>
                  document
                    .getElementById("recent")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="rounded-xl bg-[#6254C7] px-5 py-3 font-semibold text-white transition hover:bg-[#5143B5]"
              >
                Search
              </button>
            </div>

            {/* ACTION BUTTONS */}
            <div className="mt-6 flex flex-wrap gap-4">
              {isStudent ? (
                <>
                  <Link
                    to="/report-lost"
                    className="flex items-center gap-2 rounded-xl bg-[#20213A] px-6 py-3.5 font-semibold text-white transition hover:bg-[#343653]"
                  >
                    <Plus size={19} />
                    Report Lost Item
                  </Link>

                  <Link
                    to="/report-found"
                    className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3.5 font-semibold text-gray-700 transition hover:border-purple-300"
                  >
                    Report Found Item
                    <ArrowRight size={18} />
                  </Link>
                </>
              ) : isLoggedIn ? (
                <Link
                  to={dashboardPath}
                  className="flex items-center gap-2 rounded-xl bg-[#20213A] px-6 py-3.5 font-semibold text-white transition hover:bg-[#343653]"
                >
                  Go to Dashboard
                  <ArrowRight size={18} />
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="flex items-center gap-2 rounded-xl bg-[#20213A] px-6 py-3.5 font-semibold text-white transition hover:bg-[#343653]"
                  >
                    <Plus size={19} />
                    Report Lost Item
                  </Link>

                  <Link
                    to="/login"
                    className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3.5 font-semibold text-gray-700 transition hover:border-purple-300"
                  >
                    Report Found Item
                    <ArrowRight size={18} />
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* RIGHT VISUAL */}
          <div className="relative mx-auto w-full max-w-lg">

            <div className="rounded-[2rem] bg-gradient-to-br from-[#6254C7] to-[#9386E9] p-8 shadow-2xl shadow-purple-200">

              <div className="mb-8 flex items-center justify-between text-white">
                <div>
                  <p className="text-sm text-purple-100">
                    Campus community
                  </p>
                  <h2 className="mt-1 text-2xl font-bold">
                    Together, we find.
                  </h2>
                </div>

                <div className="rounded-2xl bg-white/20 p-3">
                  <Heart size={27} />
                </div>
              </div>

              <div className="space-y-4">

                <div className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-lg">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-purple-100 text-3xl">
                    🎧
                  </div>

                  <div className="flex-1">
                    <p className="font-bold">Wireless Headphones</p>
                    <p className="mt-1 text-xs text-gray-500">
                      Library · Reported today
                    </p>
                  </div>

                  <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-red-500">
                    Lost
                  </span>
                </div>

                <div className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-lg">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-100 text-3xl">
                    🎒
                  </div>

                  <div className="flex-1">
                    <p className="font-bold">Blue Backpack</p>
                    <p className="mt-1 text-xs text-gray-500">
                      Cafeteria · Reported today
                    </p>
                  </div>

                  <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-600">
                    Found
                  </span>
                </div>

              </div>

              <div className="mt-7 flex items-center gap-3 text-white">
                <div className="flex -space-x-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-purple-500 bg-orange-200">
                    👨
                  </div>
                  <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-purple-500 bg-blue-200">
                    👩
                  </div>
                  <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-purple-500 bg-green-200">
                    👨
                  </div>
                </div>

                <p className="text-sm text-purple-50">
                  Students helping students
                </p>
              </div>

            </div>

            <div className="absolute -bottom-5 -left-5 hidden items-center gap-3 rounded-2xl bg-white p-4 shadow-xl sm:flex">
              <div className="rounded-xl bg-green-100 p-3 text-green-600">
                <ShieldCheck size={24} />
              </div>

              <div>
                <p className="font-bold">Safe & Simple</p>
                <p className="text-xs text-gray-500">
                  Built for your campus
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* STATISTICS */}
      <section className="border-y border-gray-100 bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-6 py-10 sm:grid-cols-3">

          <div className="flex items-center justify-center gap-4">
            <div className="rounded-2xl bg-purple-100 p-4 text-[#6254C7]">
              <Package size={27} />
            </div>
            <div>
              <h3 className="text-3xl font-extrabold">
                {totalItems}
              </h3>
              <p className="text-sm text-gray-500">Items Reported</p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4">
            <div className="rounded-2xl bg-green-100 p-4 text-green-600">
              <Heart size={27} />
            </div>
            <div>
              <h3 className="text-3xl font-extrabold">
                {recoveredItems}
              </h3>
              <p className="text-sm text-gray-500">Items Recovered</p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4">
            <div className="rounded-2xl bg-blue-100 p-4 text-blue-600">
              <Users size={27} />
            </div>
            <div>
              <h3 className="text-3xl font-extrabold">500+</h3>
              <p className="text-sm text-gray-500">Campus Members</p>
            </div>
          </div>

        </div>
      </section>

      {/* RECENT ITEMS */}
      <section id="recent" className="mx-auto max-w-7xl scroll-mt-24 px-6 py-20">

        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-bold uppercase tracking-widest text-[#6254C7]">
              Recently reported
            </p>

            <h2 className="mt-3 text-3xl font-extrabold md:text-4xl">
              Lost something? Start here.
            </h2>

            <p className="mt-3 text-gray-500">
              Explore items recently reported by your campus community.
            </p>
          </div>

          <button
            onClick={() => {
              setSearch("");
              setActiveCategory("All Items");

              document
                .getElementById("recent")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
            className="flex items-center gap-2 font-semibold text-[#6254C7] hover:gap-3"
          >
            Explore all items
            <ArrowUpRight size={19} />
          </button>
        </div>

        {/* FILTERS */}
        <div className="mt-9 flex flex-wrap gap-3">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`rounded-xl px-5 py-2.5 text-sm font-semibold transition ${activeCategory === category
                ? "bg-[#6254C7] text-white shadow-lg shadow-purple-200"
                : "border border-gray-200 bg-white text-gray-600 hover:border-purple-300"
                }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* ITEM CARDS */}
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

          {loading ? (
            <div className="col-span-full py-16 text-center">
              <p className="font-semibold text-gray-500">
                Loading recent items...
              </p>
            </div>
          ) : error ? (
            <div className="col-span-full py-16 text-center">
              <p className="text-red-500">{error}</p>
            </div>
          ) : filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <div
                key={item.id}
                className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="relative h-48 overflow-hidden bg-gray-100">
                  {item.imageUrl ? (
                    <img
                      src={
                        item.imageUrl.startsWith("http")
                          ? item.imageUrl
                          : `${api.defaults.baseURL.replace("/api", "")}${item.imageUrl}`
                      }
                      alt={item.itemName}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-purple-50">
                      <Package size={50} className="text-[#6254C7]" />
                    </div>
                  )}

                  <span
                    className={`absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-bold ${item.itemType === "LOST"
                      ? "bg-red-100 text-red-600"
                      : "bg-green-100 text-green-600"
                      }`}
                  >
                    {item.itemType}
                  </span>
                </div>

                <div className="p-5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#6254C7]">
                    {item.category}
                  </p>

                  <h3 className="mt-2 text-lg font-bold">
                    {item.itemName}
                  </h3>

                  <div className="mt-4 space-y-2 text-sm text-gray-500">
                    <p className="flex items-center gap-2">
                      <MapPin size={16} />
                      {item.location}
                    </p>

                    <p className="flex items-center gap-2">
                      <CalendarDays size={16} />
                      {item.itemDate}
                    </p>
                  </div>

                  <Link
                    to={`/item/${item.id}`}
                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-purple-100 py-3 text-sm font-bold text-[#6254C7] transition hover:bg-[#6254C7] hover:text-white"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full rounded-2xl border border-dashed border-gray-300 bg-white py-16 text-center">
              <Package size={35} className="mx-auto text-gray-400" />
              <h3 className="mt-4 text-lg font-bold">
                No items found
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                Try searching with a different name or category.
              </p>
            </div>
          )}

        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6">

          <div className="mx-auto max-w-2xl text-center">
            <p className="font-bold uppercase tracking-widest text-[#6254C7]">
              Simple process
            </p>

            <h2 className="mt-3 text-3xl font-extrabold md:text-4xl">
              Three steps. One happy reunion.
            </h2>

            <p className="mt-4 text-gray-500">
              Getting your belongings back shouldn't be complicated.
            </p>
          </div>

          <div className="mt-14 grid gap-10 md:grid-cols-3">

            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-100 text-[#6254C7]">
                <Plus size={30} />
              </div>
              <h3 className="mt-6 text-xl font-bold">01. Report an Item</h3>
              <p className="mt-3 leading-7 text-gray-500">
                Lost or found something? Submit its details and
                upload a picture to help others identify it.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
                <Search size={30} />
              </div>
              <h3 className="mt-6 text-xl font-bold">02. Search & Discover</h3>
              <p className="mt-3 leading-7 text-gray-500">
                Browse reported items and use search filters to
                find belongings that match yours.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-green-100 text-green-600">
                <Heart size={30} />
              </div>
              <h3 className="mt-6 text-xl font-bold">03. Get It Back</h3>
              <p className="mt-3 leading-7 text-gray-500">
                Submit an ownership claim and follow its status
                until your item is safely recovered.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-7xl rounded-[2rem] bg-[#252440] px-8 py-14 text-center text-white md:px-16">

          <h2 className="text-3xl font-extrabold md:text-4xl">
            Be part of a campus that cares.
          </h2>

          <p className="mx-auto mt-4 max-w-xl leading-7 text-gray-300">
            Join your campus community and help make lost belongings
            a thing of the past.
          </p>

          <Link
            to={isLoggedIn ? dashboardPath : "/register"}
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[#8D80F0] px-7 py-3.5 font-bold text-white transition hover:bg-[#7566DF]"
          >
            {isLoggedIn ? "Go to Dashboard" : "Join Retrievo"}
            <ArrowRight size={19} />
          </Link>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-gray-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-8 sm:flex-row">

          <Link to="/" className="text-xl font-extrabold">
            retrievo<span className="text-[#6254C7]">.</span>
          </Link>

          <p className="text-center text-sm text-gray-500">
            © 2026 Retrievo. Built for students, by students.
          </p>

          <div className="flex gap-5 text-sm font-medium text-gray-500">
            {isLoggedIn ? (
              <Link to={dashboardPath} className="hover:text-[#6254C7]">
                Dashboard
              </Link>
            ) : (
              <>
                <Link to="/login" className="hover:text-[#6254C7]">
                  Login
                </Link>

                <Link to="/register" className="hover:text-[#6254C7]">
                  Register
                </Link>
              </>
            )}
          </div>

        </div>
      </footer>

    </div>
  );
}

export default Home;