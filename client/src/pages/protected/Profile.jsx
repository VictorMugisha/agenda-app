import { FiLogOut } from "react-icons/fi";
import useAuthContext from "../../hooks/useAuthContext";

export default function Profile() {
    const { removeToken } = useAuthContext();
  return (
    <div className="mt-4">
      <h1 className="text-2xl font-semibold pb-3">My Profile</h1>

      <button className="flex items-center btn gap-2 app-danger-btn">
        <FiLogOut className="text-2xl" />
        <span onClick={removeToken}>Logout</span>
      </button>
    </div>
  );
}
