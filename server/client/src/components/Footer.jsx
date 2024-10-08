import { GoHomeFill } from "react-icons/go";
import { FaUserGroup } from "react-icons/fa6";
import { IoIosNotifications } from "react-icons/io";
import { MdAddCircle } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import { useUnreadNotifications } from "../hooks/useUnreadNotifications";

export default function Footer() {
  const unreadCount = useUnreadNotifications();

  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 z-10">
      <menu className="flex items-center justify-evenly">
        <NavLink
          className={({ isActive }) =>
            `flex flex-col items-center gap-2 ${
              isActive ? "text-app-secondary" : ""
            }`
          }
          to=""
          end
        >
          <GoHomeFill className="text-2xl" />
          <span className="text-xs">Home</span>
        </NavLink>

        <NavLink
          className={({ isActive }) =>
            `flex flex-col items-center gap-2 ${
              isActive ? "text-app-secondary" : ""
            }`
          }
          to="notifications"
        >
          <div className="relative">
            <IoIosNotifications className="text-2xl" />
            {unreadCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </div>
          <span className="text-xs">Notification</span>
        </NavLink>

        <NavLink
          className={({ isActive }) =>
            `flex flex-col items-center gap-2 ${
              isActive ? "text-app-secondary" : ""
            }`
          }
          to="create"
        >
          <MdAddCircle className="text-4xl" />
        </NavLink>

        <NavLink
          className={({ isActive }) =>
            `flex flex-col items-center gap-2 ${
              isActive ? "text-app-secondary" : ""
            }`
          }
          to="mygroups"
        >
          <FaUserGroup className="text-2xl" />
          <span className="text-xs">My Groups</span>
        </NavLink>

        <NavLink
          className={({ isActive }) =>
            `flex flex-col items-center gap-2 ${
              isActive ? "text-app-secondary" : ""
            }`
          }
          to="profile"
        >
          <FaUser className="text-2xl" />
          <span className="text-xs">Profile</span>
        </NavLink>
      </menu>
    </footer>
  );
}
