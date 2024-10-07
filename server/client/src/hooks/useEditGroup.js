import { useState } from "react";
import { CLOUD_NAME, UPLOAD_PRESET } from "../constants/constants";
import { getAuthToken } from "../utils/utils";

export const useEditGroup = (groupId) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const uploadImageToCloudinary = async (image) => {
    const fileData = new FormData();
    fileData.append("file", image);
    fileData.append("upload_preset", UPLOAD_PRESET);
    fileData.append("cloud_name", CLOUD_NAME);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: fileData,
      }
    );

    const data = await res.json();
    return data.url;
  };

  const editGroup = async (formData) => {
    setLoading(true);
    setError(null);

    if (!formData.name) {
      setError("Please provide a group name.");
      setLoading(false);
      return null;
    }

    try {
      let coverImgUrl = formData.coverImg;

      if (formData.coverImg instanceof File) {
        setUploadingImage(true);
        coverImgUrl = await uploadImageToCloudinary(formData.coverImg);
        setUploadingImage(false);
      }

      const finalFormData = {
        name: formData.name,
        description: formData.description,
        coverImg: coverImgUrl,
      };

      const response = await fetch(`/api/groups/${groupId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(finalFormData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to update group");
      }

      return result;
    } catch (err) {
      console.error("Error updating group:", err);
      setError(err.message || "Internal server error");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { editGroup, loading, error, uploadingImage };
};
