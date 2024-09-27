import { Outlet, Navigate } from "react-router-dom";
import useAuthContext from "../hooks/useAuthContext";
export default function ProtectedRoute() {
  const { isAuthenticated } = useAuthContext();
  console.log("isAuthenticated in ProtectedRoute", isAuthenticated);

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}
