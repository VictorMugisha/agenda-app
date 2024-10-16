import { useState, useEffect } from "react";
import { getAuthToken } from "../utils/utils";

export const useUserProfile = (userId) => {
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/users/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${getAuthToken()}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch user profile");
        }
        const userData = await response.json();

        setUserProfile(userData);
        setError(null);
      } catch (err) {
        setError(err.message || "An error occurred while fetching the user profile");
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserProfile();
    }
  }, [userId]);

  return { userProfile, loading, error };
};
