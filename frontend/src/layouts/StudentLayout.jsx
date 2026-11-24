import { Link, NavLink } from "react-router-dom";
import { logout } from "../utils/auth";
import {
  LayoutDashboard,
  Search,
  Package,
  FileText,
  ClipboardList,
  Bell,
  Settings,
  LogOut,
  Menu,
  UserRound,
} from "lucide-react";
import { useEffect, useState } from "react";
import { getUserProfile } from "../api/userService";

const navigation = [
  {
    title: "MAIN MENU",
    links: [
      { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
      { name: "Browse Items", path: "/search-items", icon: Search },
    ],
  },
  {
    title: "MY ACTIVITY",
    links: [
      { name: "Report Lost", path: "/report-lost", icon: Package },
      { name: "Report Found", path: "/report-found", icon: FileText },
      { name: "My Reports", path: "/my-reports", icon: ClipboardList },
      { name: "My Claims", path: "/my-claims", icon: ClipboardList },
    ],
  },
];

function StudentLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user") || "{}")
  );

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await getUserProfile();
        setUser(profile);

        // Keep local user information updated
        localStorage.setItem("user", JSON.stringify(profile));
      } catch (error) {
        console.error("Unable to load student profile:", error);
      }
    };

    fetchProfile();
  }, []);

  return (
    <div className="min-h-screen bg-[#F8F7FC] text-[#20213A]">

      {/* MOBILE OVERLAY */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-gray-100 bg-white transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >

        {/* LOGO */}
        <div className="flex h-20 items-center justify-between border-b border-gray-100 px-6">
          <Link to="/" className="text-2xl font-extrabold tracking-tight">
            retrievo<span className="text-[#6254C7]">.</span>
          </Link>

          <button
            onClick={() => setSidebarOpen(false)}
            className="rounded-lg p-2 hover:bg-gray-100 lg:hidden"
          >
            ✕
          </button>
        </div>

        {/* NAVIGATION */}
        <div className="flex-1 overflow-y-auto px-4 py-6">

          {navigation.map((group) => (
            <div key={group.title} className="mb-8">

              <p className="mb-3 px-3 text-xs font-bold tracking-widest text-gray-400">
                {group.title}
              </p>

              <div className="space-y-1">
                {group.links.map((link) => {
                  const Icon = link.icon;

                  return (
                    <NavLink
                      key={link.name}
                      to={link.path}
                      onClick={() => setSidebarOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition ${isActive
                          ? "bg-[#6254C7] text-white shadow-lg shadow-purple-200"
                          : "text-gray-500 hover:bg-purple-50 hover:text-[#6254C7]"
                        }`
                      }
                    >
                      <Icon size={19} />
                      {link.name}
                    </NavLink>
                  );
                })}
              </div>

            </div>
          ))}

          {/* EXTRA LINKS */}
          <div>
            <p className="mb-3 px-3 text-xs font-bold tracking-widest text-gray-400">
              PREFERENCES
            </p>

            <Link
              to="/settings"
              onClick={() => setSidebarOpen(false)}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-gray-500 transition hover:bg-purple-50 hover:text-[#6254C7]"
            >
              <Settings size={19} />
              Settings
            </Link>
          </div>

        </div>

        {/* SIDEBAR BOTTOM */}
        <div className="border-t border-gray-100 p-4">

          <div className="mb-4 flex items-center gap-3 rounded-xl bg-purple-50 p-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#6254C7] text-white">
              <UserRound size={21} />
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-bold">
                {user.fullName || "Student"}
              </p>

              <p className="text-xs text-gray-500">
                {user.role || "STUDENT"}
              </p>
            </div>
          </div>

          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-gray-500 transition hover:bg-red-50 hover:text-red-500"
          >
            <LogOut size={19} />
            Logout
          </button>

        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className="min-h-screen lg:pl-64">

        {/* TOP NAVBAR */}
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-gray-100 bg-white/90 px-5 backdrop-blur-md sm:px-8">

          <div className="flex items-center gap-3">

            <button
              onClick={() => setSidebarOpen(true)}
              className="rounded-xl p-2 hover:bg-gray-100 lg:hidden"
            >
              <Menu size={23} />
            </button>

            <div>
              <p className="text-sm font-bold">Student Portal</p>
              <p className="text-xs text-gray-400">Retrievo / Dashboard</p>
            </div>

          </div>

          <div className="flex items-center gap-3">

            <button className="relative rounded-xl border border-gray-100 p-3 text-gray-500 transition hover:bg-purple-50 hover:text-[#6254C7]">
              <Bell size={20} />

              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
            </button>

            <div
              title={user.fullName || "Student"}
              className="hidden h-10 w-10 items-center justify-center rounded-full bg-purple-100 font-bold text-[#6254C7] sm:flex"
            >
              {user.fullName?.charAt(0).toUpperCase() || "S"}
            </div>

          </div>

        </header>

        {/* PAGE CONTENT */}
        <main className="p-5 sm:p-8">
          {children}
        </main>

      </div>
    </div>
  );
}

export default StudentLayout;