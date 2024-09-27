import { useState, useCallback } from "react";
import { BACKEND_URL } from "../constants/constants";
import { getAuthToken } from "../utils/utils";

export default function useAvailableGroups() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const availableGroups = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${BACKEND_URL}/groups/all`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message ?? "Failed to fetch groups");
      }

      const data = await response.json();
      setGroups(data);
      setLoading(false);
      return data;
    } catch (error) {
      setError(error.message);
      setLoading(false);
      return [];
    }
  }, []);

  return { groups, loading, error, availableGroups };
}
