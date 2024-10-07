import { useState, useEffect } from "react";
import { getAuthToken } from "../utils/utils";

export const useCurrentUser = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await fetch("/api/users/me", {
          headers: {
            Authorization: `Bearer ${getAuthToken()}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch current user");
        }
        const userData = await response.json();
        setCurrentUser(userData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, []);

  return { currentUser, loading, error };
};
