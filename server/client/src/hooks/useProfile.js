import { useState, useCallback } from "react";
import { useAuth } from "./useAuth";

export const useProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useAuth();

  const fetchProfile = useCallback(async () => {
    if (!isAuthenticated) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/users/profile", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("agenda_token")}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch profile");
      }

      const data = await response.json();
      setProfile(data);
    } catch (err) {
      setError(err.message || "Failed to fetch profile");
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const updateProfile = useCallback(
    async (updatedData) => {
      if (!isAuthenticated) return;

      setLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/users/profile", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("agenda_token")}`,
          },
          body: JSON.stringify(updatedData),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to update profile");
        }

        const data = await response.json();
        setProfile(data);
      } catch (err) {
        setError(err.message || "Failed to update profile");
      } finally {
        setLoading(false);
      }
    },
    [isAuthenticated]
  );

  return { profile, loading, error, fetchProfile, updateProfile };
};
