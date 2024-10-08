import { useState } from "react";
import { useToast } from "@chakra-ui/react";
import { getAuthToken } from "../utils/utils";

export const useLeaveGroup = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const toast = useToast();

  const leaveGroup = async (groupId) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/groups/${groupId}/leave`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to leave the group");
      }

      const data = await response.json();

      toast({
        title: "Successfully Left Group",
        description: data.message || "You have left the group",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      return true;
    } catch (err) {
      setError(err.message);
      toast({
        title: "Error Leaving Group",
        description: err.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { leaveGroup, loading, error };
};
