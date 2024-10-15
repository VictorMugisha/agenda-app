import { useState, useEffect, useCallback } from "react";
import { getAuthToken } from "../utils/utils";

export const usePendingFriendRequests = () => {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPendingRequests = useCallback(async () => {
    try {
      const response = await fetch("/api/friends/pending-requests", {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch pending friend requests");
      }

      const data = await response.json();
      setPendingRequests(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPendingRequests();
  }, [fetchPendingRequests]);

  const handleFriendRequest = async (requestId, action) => {
    try {
      const response = await fetch("/api/friends/handle-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify({ requestId, action }),
      });

      if (!response.ok) {
        throw new Error(`Failed to ${action} friend request`);
      }

      // Remove the handled request from the list
      setPendingRequests((prev) => prev.filter((req) => req._id !== requestId));
    } catch (err) {
      setError(err.message);
    }
  };

  return {
    pendingRequests,
    loading,
    error,
    handleFriendRequest,
    fetchPendingRequests,
  };
};
