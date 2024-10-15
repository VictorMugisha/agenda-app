import { useState } from "react";
import { useToast } from "@chakra-ui/react";
import { CLOUD_NAME, UPLOAD_PRESET } from "../constants/constants";
import useLogin from "./useLogin";

export default function useRegister() {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const { login } = useLogin();

  async function register(formData, profileImage) {
    try {
      setLoading(true);
      let profileImageUrl = null;

      if (profileImage) {
        const fileData = new FormData();
        fileData.append("file", profileImage);
        fileData.append("cloud_name", CLOUD_NAME);
        fileData.append("upload_preset", UPLOAD_PRESET);

        const res = await fetch(
          "https://api.cloudinary.com/v1_1/victormugisha/image/upload",
          {
            method: "POST",
            body: fileData,
          }
        );

        const data = await res.json();
        profileImageUrl = data.url;
      }

      const finalFormData = {
        ...formData,
        profilePicture: profileImageUrl,
      };

      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(finalFormData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Something went wrong!");
      }

      toast({
        title: "Registration Successful",
        description: "Your account has been created. Logging you in...",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      // Use the login function from useLogin hook
      await login(formData.username, formData.password);
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: error.message || "An error occurred during registration.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      throw error;
    } finally {
      setLoading(false);
    }
  }

  return { loading, register };
}
