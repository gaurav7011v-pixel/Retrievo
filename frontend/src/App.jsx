import { BrowserRouter, Routes, Route } from "react-router-dom";

// Public Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";

// Student Components
import Dashboard from "./components/Dashboard";
import ReportLost from "./components/ReportLost";
import ReportFound from "./components/ReportFound";
import SearchItems from "./components/SearchItems";
import ItemDetails from "./components/ItemDetails";
import ClaimItem from "./components/ClaimItem";
import MyClaims from "./components/MyClaims";
import MyReports from "./components/MyReports";
import StudentSettings from "./components/StudentSetting";

// Admin Components
import AdminDashboard from "./components/AdminDashboard";
import ManageClaims from "./components/ManageClaims";
import ManageItems from "./components/ManageItems";
import ManageUsers from "./components/ManageUsers";
import ManageReports from "./components/ManageReports";
import AdminSettings from "./components/AdminSettings";

// Route Protection
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/item/:id" element={<ItemDetails />} />

        {/* Password Recovery Routes */}
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Student Routes */}
        <Route element={<ProtectedRoute allowedRoles={["STUDENT"]} />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/report-lost" element={<ReportLost />} />
          <Route path="/report-found" element={<ReportFound />} />
          <Route path="/search-items" element={<SearchItems />} />
          <Route path="/claim/:id" element={<ClaimItem />} />
          <Route path="/my-claims" element={<MyClaims />} />
          <Route path="/my-reports" element={<MyReports />} />
          <Route path="/settings" element={<StudentSettings />} />
        </Route>

        {/* Admin Routes */}
        <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/claims" element={<ManageClaims />} />
          <Route path="/admin/items" element={<ManageItems />} />
          <Route path="/admin/users" element={<ManageUsers />} />
          <Route path="/admin/reports" element={<ManageReports />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;