import { create } from "zustand";
import { CLOUD_NAME, UPLOAD_PRESET } from "../constants/constants";

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
      let profileImageUrl = null;

      if (updatedData.profilePicture instanceof File) {
        const fileData = new FormData();
        fileData.append("file", updatedData.profilePicture);
        fileData.append("cloud_name", CLOUD_NAME);
        fileData.append("upload_preset", UPLOAD_PRESET);

        const res = await fetch(
          `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
          {
            method: "POST",
            body: fileData,
          }
        );

        if (!res.ok) {
          throw new Error("Failed to upload image to Cloudinary");
        }

        const data = await res.json();
        profileImageUrl = data.secure_url;
      }

      const finalUpdatedData = {
        ...updatedData,
        profilePicture: profileImageUrl || updatedData.profilePicture,
      };

      const response = await fetch("/api/users/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("agenda_token")}`,
        },
        body: JSON.stringify(finalUpdatedData),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      const data = await response.json();
      set({ profile: data, loading: false });
      return data;
    } catch (err) {
      set({ error: err.message, loading: false });
      throw err;
    }
  },
  clearProfile: () => set({ profile: null, loading: false, error: null }),
}));

export default useUserStore;
