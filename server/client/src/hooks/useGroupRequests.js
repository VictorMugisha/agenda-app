import { useState, useEffect, useCallback } from "react";
import { useToast } from "@chakra-ui/react";
import { getAuthToken } from "../utils/utils";

export function useGroupRequests(groupId) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const toast = useToast();

  const fetchRequests = useCallback(async () => {
    try {
      const response = await fetch(`/api/groups/${groupId}/requests`, {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch requests");
      const data = await response.json();
      setRequests(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      toast({
        title: "Error",
        description: "Failed to fetch requests",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  }, [groupId, toast]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const handleRequest = async (requestId, action) => {
    try {
      const response = await fetch(`/api/groups/${groupId}/requests/${requestId}/${action}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });
      if (!response.ok) throw new Error(`Failed to ${action} request`);

      // Update the local state
      setRequests((prevRequests) =>
        prevRequests.filter((req) => req._id !== requestId)
      );

      toast({
        title: "Success",
        description: `Request ${action}ed successfully`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (err) {
      setError(err.message);
      toast({
        title: "Error",
        description: `Failed to ${action} request`,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return {
    requests,
    loading,
    error,
    handleRequest,
    refreshRequests: fetchRequests,
  };
}