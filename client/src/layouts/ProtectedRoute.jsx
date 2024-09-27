import { Outlet, Navigate } from "react-router-dom";
import useAuthContext from "../hooks/useAuthContext";
export default function ProtectedRoute() {
  const { isAuthenticated } = useAuthContext();

  return isAuthenticated ? (
    <main className="mx-6 mt-4 flex flex-col min-h-screen justify-between">
      <Outlet />
      <h1>Hello world</h1>
    </main>
  ) : (
    <Navigate to="/login" replace />
  );
}
