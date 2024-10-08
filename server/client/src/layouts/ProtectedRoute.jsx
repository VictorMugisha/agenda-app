import { Outlet, Navigate } from "react-router-dom";
import useAuthContext from "../hooks/useAuthContext";
import Footer from "../components/Footer";

export default function ProtectedRoute() {
  const { isAuthenticated } = useAuthContext();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 overflow-y-auto pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  );
}
