import { BACKEND_URL } from "../constants/constants";
import { getAuthToken } from "../utils/utils";
import { useToast } from "@chakra-ui/react";

export default function useJoinGroup(groupId) {
  const toast = useToast();

  async function joinGroup(password) {

    try {
      const response = await fetch(`${BACKEND_URL}/groups/join/${groupId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify({ password }),
      });

      if (!response.ok) {
        console.log("Response after joining group error: ", response);
        const errorData = await response.json();
        toast({
          title: "Error",
          description: errorData.message || "Failed to join group",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        throw new Error(errorData.message || "Failed to join group");
      }

      const data = await response.json();
      console.log("Response after joining group success: ", data);
      toast({
        title: "Success",
        description: "Joined group successfully",
        status: "success",
        duration: 5000,
        isClosable: true,
      })

      return data;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  return { joinGroup };
}
