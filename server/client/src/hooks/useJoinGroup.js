import { getAuthToken } from "../utils/utils";
import { useToast } from "@chakra-ui/react";

export default function useJoinGroup(groupId) {
  const toast = useToast();

  async function joinGroup(password) {
    try {
      const response = await fetch(`/api/groups/join/${groupId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify({ password }),
      });

      if (!response.ok) {
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
      toast({
        title: "Success",
        description: "Joined group successfully",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      return data;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  return { joinGroup };
}
