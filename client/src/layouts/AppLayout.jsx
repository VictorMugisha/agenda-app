import { Outlet, Navigate } from "react-router-dom";
import useAuthContext from "../hooks/useAuthContext";
export default function AppLayout() {
  const { isAuthenticated } = useAuthContext();
  
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}
