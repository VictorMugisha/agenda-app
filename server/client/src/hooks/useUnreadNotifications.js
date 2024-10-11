import { useState, useEffect } from "react";
import { getAuthToken } from "../utils/utils";

export const useUnreadNotifications = () => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const response = await fetch("/api/notifications/unread-count", {
          headers: {
            Authorization: `Bearer ${getAuthToken()}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch unread notifications count");
        }
        const data = await response.json();
        setUnreadCount(data.count);
      } catch (error) {
        console.error("Error fetching unread notifications count:", error);
        setError(error.message);
        setUnreadCount(0); // Set to 0 in case of error
      }
    };

    fetchUnreadCount();

    // Set up an interval to fetch the count every minute
    const intervalId = setInterval(fetchUnreadCount, 60000);

    // Clean up the interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  return { unreadCount, error };
};
