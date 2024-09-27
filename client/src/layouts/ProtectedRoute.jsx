import { Outlet, Navigate } from "react-router-dom";
import useAuthContext from "../hooks/useAuthContext";
import Footer from "../components/Footer";
export default function ProtectedRoute() {
  const { isAuthenticated } = useAuthContext();

  return isAuthenticated ? (
    <main className="flex flex-col min-h-screen justify-between">
      <div className="mx-6">
        <Outlet />
      </div>
      <Footer />
    </main>
  ) : (
    <Navigate to="/login" replace />
  );
}
