import { useState, useCallback } from 'react';
import { getAuthToken } from '../utils/utils';

export const useGroupDetails = (groupId) => {
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchGroupDetails = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/groups/group/${groupId}`, {
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch group details');
      }
      const data = await response.json();
      setGroup(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [groupId]);

  return { group, loading, error, fetchGroupDetails };
};
