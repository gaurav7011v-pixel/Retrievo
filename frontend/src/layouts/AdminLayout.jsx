import { useEffect, useState } from "react";
import { getUserProfile } from "../api/userService";
import { logout } from "../utils/auth";
import { Settings } from "lucide-react";

import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  FileText,
  Users,
  ClipboardCheck,
  Menu,
  X,
  LogOut,
  ShieldCheck,
} from "lucide-react";

function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user") || "{}")
  );

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await getUserProfile();

        setUser(profile);
        localStorage.setItem("user", JSON.stringify(profile));
      } catch (error) {
        console.error("Unable to load admin profile:", error);
      }
    };

    fetchProfile();
  }, []);

  const location = useLocation();

  const navigation = [
    {
      name: "Dashboard",
      path: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Manage Items",
      path: "/admin/items",
      icon: Package,
    },
    {
      name: "Manage Claims",
      path: "/admin/claims",
      icon: ClipboardCheck,
    },
    {
      name: "Manage Reports",
      path: "/admin/reports",
      icon: FileText,
    },
    {
      name: "Manage Users",
      path: "/admin/users",
      icon: Users,
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8F7FC]">

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-[#20213A] text-white transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        {/* Logo */}
        <div className="flex h-20 items-center justify-between border-b border-white/10 px-6">
          <div className="flex h-20 items-center gap-3 px-6">
            <Link to="/admin/dashboard" className="flex items-center gap-3">
              {/* Keep your existing logo/icon here */}
            </Link>

            <Link to="/" className="text-xl font-bold">
              Retrievo
            </Link>
          </div>

          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden"
          >
            <X size={22} />
          </button>
        </div>

        {/* Admin Profile */}
        <div className="mx-4 mt-6 flex items-center gap-3 rounded-xl bg-white/5 p-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#6254C7]">
            <ShieldCheck size={22} />
          </div>

          <div>
            <p className="font-semibold">
              {user.fullName || "Administrator"}
            </p>

            <p className="text-xs text-gray-400">
              {user.role || "ADMIN"}
            </p>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 px-4 py-7">
          <p className="mb-4 px-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
            Administration
          </p>

          <nav className="space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${isActive
                    ? "bg-[#6254C7] text-white"
                    : "text-gray-300 hover:bg-white/10 hover:text-white"
                    }`}
                >
                  <Icon size={19} />
                  {item.name}
                </Link>
              );
            })}

            <Link
              to="/admin/settings"
              onClick={() => setSidebarOpen(false)}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-300 transition  hover:bg-white/10  hover:text-white"
            >
              <Settings size={19} />
              Settings
            </Link>
          </nav>
        </div>

        {/* Logout */}
        <div className="border-t border-white/10 p-4">
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-300 transition hover:bg-red-500/10 hover:text-red-400"
          >
            <LogOut size={19} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="min-h-screen lg:pl-72">

        {/* Top Navbar */}
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-gray-100 bg-white px-5 sm:px-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-gray-600 lg:hidden"
            >
              <Menu size={24} />
            </button>

            <div>
              <h2 className="font-bold text-[#20213A]">
                Administration
              </h2>

              <p className="text-xs text-gray-400">
                Retrievo Management System
              </p>
            </div>
          </div>

          <div
            title={user.fullName || "Administrator"}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 font-bold text-[#6254C7]"
          >
            {user.fullName?.charAt(0).toUpperCase() || "A"}
          </div>
        </header>

        {/* Page Content */}
        <main className="p-5 sm:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;