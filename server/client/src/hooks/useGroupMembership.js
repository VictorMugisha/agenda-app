import { useState, useEffect } from "react";
import { getAuthToken } from "../utils/utils";

export const useGroupMembership = (groupId) => {
  const [isMember, setIsMember] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [hasPendingRequest, setHasPendingRequest] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkMembership = async () => {
      if (!groupId) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/groups/${groupId}/membership/`, {
          headers: {
            Authorization: `Bearer ${getAuthToken()}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch membership status');
        }

        const data = await response.json();
        setIsMember(data.isMember);
        setIsAdmin(data.isAdmin);
        setHasPendingRequest(data.hasPendingRequest);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    checkMembership();
  }, [groupId]);

  return { isMember, isAdmin, hasPendingRequest, loading, error };
};
