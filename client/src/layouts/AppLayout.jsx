import { Outlet } from "react-router-dom";
export default function AppLayout() {
  return (
    <div>
      <h2>Protected Route</h2>
      <Outlet />
    </div>
  );
}
