import { useState, useCallback } from "react";
import { getAuthToken } from "../utils/utils";
import { useToast } from "@chakra-ui/react";

export const useMyGroups = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const toast = useToast();

  const fetchMyGroups = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/groups/my-groups", {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new Error("Failed to fetch your groups");
      const data = await response.json();
      setGroups(data);
    } catch (err) {
      setError(err.message || "Failed to fetch your groups");
      toast({
        title: "Error",
        description: "Failed to fetch your groups. Please try again later.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const joinGroup = useCallback(async (groupId) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/groups/${groupId}/join`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new Error("Failed to join the group");
      const data = await response.json();
      setGroups((prevGroups) => [...prevGroups, data]);
    } catch (err) {
      setError(err.message || "Failed to join the group");
    } finally {
      setLoading(false);
    }
  }, []);

  const leaveGroup = useCallback(
    async (groupId) => {
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
        if (!response.ok) throw new Error("Failed to leave the group");
        setGroups((prevGroups) =>
          prevGroups.filter((group) => group._id !== groupId)
        );
        toast({
          title: "Group left",
          description: "You have successfully left the group.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } catch (err) {
        setError(err.message || "Failed to leave the group");
        toast({
          title: "Error",
          description: err.message || "Failed to leave the group",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    },
    [toast]
  );

  return {
    groups,
    loading,
    error,
    fetchMyGroups,
    joinGroup,
    leaveGroup,
  };
};
