import { Outlet, Navigate } from "react-router-dom";
import useAuthContext from "../hooks/useAuthContext";
export default function AuthLayout() {
  const { isAuthenticated } = useAuthContext();

  return isAuthenticated ? <Navigate to="/app" replace /> : <Outlet />;
}
