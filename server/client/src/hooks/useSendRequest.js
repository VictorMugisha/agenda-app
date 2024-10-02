import { useToast } from "@chakra-ui/react";
import { getAuthToken } from "../utils/utils";
import { useState } from "react";

export default function useSendRequest() {
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  async function sendRequest(groupId) {
    setLoading(true);
    try {
      const response = await fetch(`/api/request/create/${groupId}`, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAuthToken()}`,
        },
        body: null,
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast({
          title: "Something Went Wront",
          description: errorData.message ?? "Error Occured!",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        setLoading(false);
        return;
      }
      const data = await response.json();
      toast({
        title: "Joining Request Sent",
        description: "Request Sent",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      console.log("After sending the request", data);
      setLoading(false);
      return data.request;
    } catch (error) {
      console.log("Something went wrong while sending request: ", error);
      setLoading(false);
      return null;
    }
  }

  return { loading, sendRequest };
}
