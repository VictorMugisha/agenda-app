import { useState } from "react";
import { getAuthToken } from "../utils/utils";

const useDeleteGroup = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const deleteGroup = async (groupId) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/groups/${groupId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete group");
      }

      setLoading(false);
      return true;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      return false;
    }
  };

  return { deleteGroup, loading, error };
};

export default useDeleteGroup;
