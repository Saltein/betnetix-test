import { Navigate, Outlet } from "react-router-dom";
import Cookies from "js-cookie";

export const ProtectedRoute = () => {
    const accessToken = Cookies.get("accessToken");

    if (!accessToken) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};
