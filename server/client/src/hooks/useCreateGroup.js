import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CLOUD_NAME, UPLOAD_PRESET } from "../constants/constants";
import { getAuthToken } from "../utils/utils";
import { useToast } from "@chakra-ui/react";

export const useCreateGroup = () => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

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

  const createGroup = async (formData) => {
    setError("");
    setLoading(true);

    if (!formData.name) {
      setError("Please provide a group name.");
      setLoading(false);
      toast({
        title: "Error",
        description: "Please provide a group name.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      let coverImgUrl = null;

      if (formData.coverImg) {
        setUploadingImage(true);
        coverImgUrl = await uploadImageToCloudinary(formData.coverImg);
        setUploadingImage(false);
      }

      const finalFormData = {
        name: formData.name,
        description: formData.description,
        coverImg: coverImgUrl,
      };

      const response = await fetch("/api/groups/new", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify(finalFormData),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.message || "Something went wrong");
        setLoading(false);
        toast({
          title: "Error",
          description: result.message || "Something went wrong",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      toast({
        title: "Group created",
        description: "Your new group has been created successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      navigate(`/app/group/${result._id}`);
    } catch (error) {
      console.error("Error creating group:", error);
      setError("Internal server error");
      setLoading(false);
      toast({
        title: "Error",
        description: "Internal server error",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return { createGroup, error, loading, uploadingImage };
};
