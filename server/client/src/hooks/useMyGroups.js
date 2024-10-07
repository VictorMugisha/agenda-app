import { useState, useCallback } from "react";
import { getAuthToken } from "../utils/utils";

export const useMyGroups = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMyGroups = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/groups/my-groups", {
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) throw new Error('Failed to fetch your groups');
      const data = await response.json();
      setGroups(data);
    } catch (err) {
      setError(err.message || "Failed to fetch your groups");
    } finally {
      setLoading(false);
    }
  }, []);

  const joinGroup = useCallback(async (groupId) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/groups/${groupId}/join`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) throw new Error('Failed to join the group');
      const data = await response.json();
      setGroups(prevGroups => [...prevGroups, data]);
    } catch (err) {
      setError(err.message || "Failed to join the group");
    } finally {
      setLoading(false);
    }
  }, []);

  const leaveGroup = useCallback(async (groupId) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/groups/${groupId}/leave`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) throw new Error('Failed to leave the group');
      setGroups(prevGroups => prevGroups.filter(group => group._id !== groupId));
    } catch (err) {
      setError(err.message || "Failed to leave the group");
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    groups,
    loading,
    error,
    fetchMyGroups,
    joinGroup,
    leaveGroup
  };
};
