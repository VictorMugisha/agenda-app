import { useState, useCallback } from "react";
import { useAuth } from "./useAuth";
import { useToast } from "@chakra-ui/react"; // Add this import

export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useAuth();
  const toast = useToast(); // Add this line

  const fetchNotifications = useCallback(async () => {
    if (!isAuthenticated) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/notifications", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("agenda_token")}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch notifications");
      }

      const data = await response.json();
      setNotifications(data);
    } catch (err) {
      setError(err.message || "Failed to fetch notifications");
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const markAsRead = useCallback(
    async (notificationId) => {
      if (!isAuthenticated) return;

      try {
        const response = await fetch(
          `/api/notifications/${notificationId}/read`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("agenda_token")}`,
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.message || "Failed to mark notification as read"
          );
        }

        setNotifications((prevNotifications) =>
          prevNotifications.map((notification) =>
            notification._id === notificationId
              ? { ...notification, isRead: true }
              : notification
          )
        );
      } catch (err) {
        setError(err.message || "Failed to mark notification as read");
      }
    },
    [isAuthenticated]
  );

  const deleteNotification = useCallback(
    async (notificationId) => {
      if (!isAuthenticated) return;

      try {
        const response = await fetch(
          `/api/notifications/${notificationId}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("agenda_token")}`,
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.message || "Failed to delete notification"
          );
        }

        setNotifications((prevNotifications) =>
          prevNotifications.filter((notification) => notification._id !== notificationId)
        );

        toast({
          title: "Notification deleted",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } catch (err) {
        setError(err.message || "Failed to delete notification");
        toast({
          title: "Error",
          description: err.message || "Failed to delete notification",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    },
    [isAuthenticated, toast]
  );

  return { notifications, loading, error, fetchNotifications, markAsRead, deleteNotification };
};