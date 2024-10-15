import { useState, useCallback } from "react";
import { getAuthToken } from "../utils/utils";
import { useToast } from "@chakra-ui/react";

export const useFriendRequests = () => {
  const [loadingUsers, setLoadingUsers] = useState({});
  const [error, setError] = useState(null);
  const toast = useToast();

  const sendFriendRequest = useCallback(
    async (recipientId) => {
      setLoadingUsers(prev => ({ ...prev, [recipientId]: true }));
      setError(null);
      try {
        const response = await fetch("/api/friends/request", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getAuthToken()}`,
          },
          body: JSON.stringify({ recipientId }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to send friend request");
        }

        toast({
          title: "Friend request sent",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } catch (err) {
        setError(err.message);
        toast({
          title: "Error",
          description: err.message,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setLoadingUsers(prev => ({ ...prev, [recipientId]: false }));
      }
    },
    [toast]
  );

  return { sendFriendRequest, loadingUsers, error };
};
