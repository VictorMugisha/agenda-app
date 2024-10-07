import { useEffect } from "react";
import { useNotifications } from "../../hooks/useNotifications";
import Loading from "../../components/Loading";
import { format } from "date-fns";

export default function Notifications() {
  const { notifications, loading, error, fetchNotifications, markAsRead } = useNotifications();

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  if (loading) return <Loading />;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="mt-4">
      <h1 className="text-2xl font-semibold pb-3">Notifications</h1>
      {notifications.length === 0 ? (
        <p className="text-center text-gray-500">No notifications</p>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification._id}
              className={`p-4 rounded-lg shadow ${
                notification.isRead ? "bg-gray-100" : "bg-white"
              }`}
            >
              <h2 className="text-lg font-semibold">{notification.title}</h2>
              <p className="text-gray-600">{notification.content}</p>
              <div className="flex justify-between items-center mt-2">
                <span className="text-sm text-gray-500">
                  {format(new Date(notification.createdAt), "PPpp")}
                </span>
                {!notification.isRead && (
                  <button
                    onClick={() => markAsRead(notification._id)}
                    className="text-sm text-blue-500 hover:text-blue-700"
                  >
                    Mark as read
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
