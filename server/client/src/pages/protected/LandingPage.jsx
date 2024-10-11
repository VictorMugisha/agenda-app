import { Link } from "react-router-dom";
import {
  FiUsers,
  FiPlusCircle,
  FiBell,
  FiSearch,
  FiUser,
} from "react-icons/fi";
import { useProfile } from "../../hooks/useProfile";
import { useMyGroups } from "../../hooks/useMyGroups";
import { useUnreadNotifications } from "../../hooks/useUnreadNotifications";
import Loading from "../../components/Loading";
import { useEffect } from "react";

export default function LandingPage() {
  const { profile, loading: profileLoading, error: profileError,fetchProfile } = useProfile();
  const { groups: recentGroups, loading: groupsLoading, error: groupsError, fetchMyGroups } = useMyGroups();
  const { unreadCount, error: notificationError } = useUnreadNotifications();

  useEffect(() => {
    fetchMyGroups();
    fetchProfile();
  }, [fetchMyGroups, fetchProfile]);

  if (groupsLoading || profileLoading) {
    return <Loading />;
  }

  if (profileError || groupsError || notificationError) {
    return <div>Error loading data</div>;
  }

  // Assuming we want to show only the 3 most recent groups
  const displayedGroups = recentGroups.slice(0, 3);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <main className="flex-grow container mx-auto px-4 py-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6">
          Welcome, {profile?.firstName ?? 'User'}!
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
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                    {unreadCount}
                  </span>
                )}
              </Link>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-3">Recent Groups</h2>
            {displayedGroups.length > 0 ? (
              <ul className="space-y-2">
                {displayedGroups.map((group) => (
                  <li
                    key={group._id}
                    className="flex items-center justify-between p-2 hover:bg-gray-100 rounded-md transition-colors"
                  >
                    <Link to={`/app/group/${group._id}`} className="flex-grow text-sm">
                      {group.name}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">You {"haven't"} joined any groups yet.</p>
            )}
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
