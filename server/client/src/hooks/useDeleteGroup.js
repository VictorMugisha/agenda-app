import { useState } from "react";
import { getAuthToken } from "../utils/utils";
import { useToast } from "@chakra-ui/react";

const useDeleteGroup = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const toast = useToast();

  const deleteGroup = async (groupId) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/groups/${groupId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete group");
      }

      setLoading(false);
      toast({
        title: "Group deleted",
        description: "The group has been successfully deleted.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      return true;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      toast({
        title: "Error",
        description: err.message || "Failed to delete group",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return false;
    }
  };

  return { deleteGroup, loading, error };
};

export default useDeleteGroup;
