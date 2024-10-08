import { Outlet, Navigate } from "react-router-dom";
import useAuthContext from "../hooks/useAuthContext";
export default function PublicRoutes() {
  const { isAuthenticated } = useAuthContext();
  
  return isAuthenticated ? (
    <Navigate to="/app" replace />
  ) : (
    <main className="flex flex-col min-h-screen justify-center">
      <Outlet />
    </main>
  );
}
