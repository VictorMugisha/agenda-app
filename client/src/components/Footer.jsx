import { GoHomeFill } from "react-icons/go";
import { FaUserGroup } from "react-icons/fa6";
import { IoIosNotifications } from "react-icons/io";
import { FaUser } from "react-icons/fa";
import { NavLink } from "react-router-dom";
export default function Footer() {
  return (
    <footer className="w-full py-5 fixed bottom-0 bg-app-primary">
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
          <span className="text-sm">Home</span>
        </NavLink>

        <NavLink
          className={({ isActive }) =>
            `flex flex-col items-center gap-2 ${
              isActive ? "text-app-secondary" : ""
            }`
          }
          to="notifications"
        >
          <IoIosNotifications className="text-2xl" />
          <span className="text-sm">Notification</span>
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
          <span className="text-sm">My Groups</span>
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
          <span className="text-sm">Profile</span>
        </NavLink>
      </menu>
    </footer>
  );
}
