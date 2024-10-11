import { create } from "zustand";

const useUserStore = create((set) => ({
  profile: null,
  loading: false,
  error: null,
  fetchProfile: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetch("/api/users/profile", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("agenda_token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch profile");
      }

      const data = await response.json();
      set({ profile: data, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },
  updateProfile: async (updatedData) => {
    set({ loading: true, error: null });
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
        throw new Error("Failed to update profile");
      }

      const data = await response.json();
      set({ profile: data, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },
  clearProfile: () => set({ profile: null, loading: false, error: null }),
}));

export default useUserStore;
