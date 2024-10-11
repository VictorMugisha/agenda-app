import { Link } from "react-router-dom";
import {
  FiUsers,
  FiPlusCircle,
  FiBell,
  FiSearch,
  FiUser,
} from "react-icons/fi";

const mockUserData = {
  name: "John Doe",
  recentGroups: [
    { id: 1, name: "Project Alpha", unreadMessages: 3 },
    { id: 2, name: "Team Brainstorm", unreadMessages: 0 },
    { id: 3, name: "Book Club", unreadMessages: 1 },
  ],
  notifications: 2,
};

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <main className="flex-grow container mx-auto px-4 py-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6">
          Welcome, {mockUserData.name}!
        </h1>

        <div className="space-y-6">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-3">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-3">
              <Link
                to="/app/mygroups"
                className="flex flex-col items-center justify-center p-3 bg-blue-100 rounded-md hover:bg-blue-200 transition-colors"
              >
                <FiUsers className="text-xl mb-1" />
                <span className="text-sm text-center">My Groups</span>
              </Link>
              <Link
                to="/app/create"
                className="flex flex-col items-center justify-center p-3 bg-green-100 rounded-md hover:bg-green-200 transition-colors"
              >
                <FiPlusCircle className="text-xl mb-1" />
                <span className="text-sm text-center">Create Group</span>
              </Link>
              <Link
                to="/app/home"
                className="flex flex-col items-center justify-center p-3 bg-yellow-100 rounded-md hover:bg-yellow-200 transition-colors"
              >
                <FiSearch className="text-xl mb-1" />
                <span className="text-sm text-center">Browse Groups</span>
              </Link>
              <Link
                to="/app/notifications"
                className="flex flex-col items-center justify-center p-3 bg-red-100 rounded-md hover:bg-red-200 transition-colors relative"
              >
                <FiBell className="text-xl mb-1" />
                <span className="text-sm text-center">Notifications</span>
                {mockUserData.notifications > 0 && (
                  <span className="absolute top-1 right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                    {mockUserData.notifications}
                  </span>
                )}
              </Link>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-3">Recent Groups</h2>
            <ul className="space-y-2">
              {mockUserData.recentGroups.map((group) => (
                <li
                  key={group.id}
                  className="flex items-center justify-between p-2 hover:bg-gray-100 rounded-md transition-colors"
                >
                  <Link to={`/app/group/${group.id}`} className="flex-grow text-sm">
                    {group.name}
                  </Link>
                  {group.unreadMessages > 0 && (
                    <span className="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      {group.unreadMessages}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-3">Explore More</h2>
            <p className="text-sm mb-3">
              Discover new groups, connect with people, and collaborate on
              exciting projects!
            </p>
            <Link to="/app/home" className="btn app-primary-btn w-full text-center py-2">
              Browse All Groups
            </Link>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-3">Your Profile</h2>
            <p className="text-sm mb-3">View and edit your profile information.</p>
            <Link
              to="/app/profile"
              className="flex items-center justify-center p-3 bg-purple-100 rounded-md hover:bg-purple-200 transition-colors"
            >
              <FiUser className="mr-2" /> Go to Profile
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
