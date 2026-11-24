import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute({ allowedRoles }) {
    const localToken = localStorage.getItem("token");
    const localUser = localStorage.getItem("user");

    const sessionToken = sessionStorage.getItem("token");
    const sessionUser = sessionStorage.getItem("user");

    // Use localStorage first, otherwise sessionStorage
    const token = localToken || sessionToken;
    const storedUser = localUser || sessionUser;

    if (!token || !storedUser) {
        return <Navigate to="/login" replace />;
    }

    let user;

    try {
        user = JSON.parse(storedUser);
    } catch {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");

        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}

export default ProtectedRoute;