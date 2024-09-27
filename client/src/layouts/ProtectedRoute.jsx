import { Outlet, Navigate, Link } from "react-router-dom";
import useAuthContext from "../hooks/useAuthContext";
import { GoHomeFill } from "react-icons/go";
import { FaUserGroup } from "react-icons/fa6";
export default function ProtectedRoute() {
  const { isAuthenticated } = useAuthContext();

  return isAuthenticated ? (
    <main className="flex flex-col min-h-screen justify-between">
      <div className="mx-6">
        <Outlet />
      </div>
      <footer className="w-full py-5 fixed bottom-0 bg-white">
        <menu className="flex items-center justify-evenly">
          <Link className="flex flex-col items-center gap-2">
            <GoHomeFill className="text-2xl text-app-secondary" />
            <span className="text-sm">Home</span>
          </Link>

          <Link className="flex flex-col items-center gap-2">
            <FaUserGroup className="text-2xl" />
            <span className="text-sm">My Groups</span>
          </Link>
        </menu>
      </footer>
    </main>
  ) : (
    <Navigate to="/login" replace />
  );
}
