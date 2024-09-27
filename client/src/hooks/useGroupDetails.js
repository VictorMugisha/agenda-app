import { useState, useCallback } from "react";
import { BACKEND_URL } from "../constants/constants";
import { getAuthToken } from "../utils/utils";

export default function useGroupDetails(groupId) {
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchGroupDetails = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${BACKEND_URL}/groups/group/${groupId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });

      console.log("Response received: ", response);
      
      if (!response.ok) {
          console.log("Response was not ok: ", response.status);
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch group details");
      }

      const data = await response.json();
      setGroup(data);
      setLoading(false);
      return data;
    } catch (error) {
      setError(error.message);
      setLoading(false);
      return null;
    }
  }, [groupId]);

  return { group, loading, error, fetchGroupDetails };
}
