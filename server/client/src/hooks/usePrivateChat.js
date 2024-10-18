import { useState, useEffect, useCallback } from "react";
import { useCurrentUser } from "./useCurrentUser";
import { useToast } from "@chakra-ui/react";
import socket from "../socket";
import { getAuthToken } from "../utils/utils";

export const usePrivateChat = (friendId) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [friendInfo, setFriendInfo] = useState(null);
  const { currentUser } = useCurrentUser();
  const toast = useToast();

  const fetchMessages = useCallback(async () => {
    try {
      const response = await fetch(`/api/private-messages/${friendId}`, {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch messages");
      }

      const data = await response.json();
      setMessages(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      toast({
        title: "Error",
        description: err.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  }, [friendId, toast]);

  const fetchFriendInfo = useCallback(async () => {
    try {
      const response = await fetch(`/api/users/user/${friendId}`, {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch friend info");
      }

      const data = await response.json();
      setFriendInfo(data);
    } catch (err) {
      console.error("Error fetching friend info:", err);
      toast({
        title: "Error",
        description: "Failed to load friend information",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  }, [friendId, toast]);

  useEffect(() => {
    fetchMessages();
    fetchFriendInfo();
  }, [fetchMessages, fetchFriendInfo]);

  useEffect(() => {
    const handleReceiveMessage = (message) => {
      console.log("Received message:", message);
      if (message.sender._id === friendId || message.recipient === friendId) {
        setMessages((prevMessages) => [...prevMessages, message]);
      }
    };

    socket.on("receive_private_message", handleReceiveMessage);

    return () => {
      socket.off("receive_private_message", handleReceiveMessage);
    };
  }, [friendId]);

  const sendMessage = useCallback(
    async (content) => {
      if (!currentUser) {
        toast({
          title: "Error",
          description: "User not authenticated",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      try {
        const response = await fetch("/api/private-messages/send", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getAuthToken()}`,
          },
          body: JSON.stringify({
            recipientId: friendId,
            content,
          }),
        });

        const responseData = await response.json();
        console.log('Server response:', responseData);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        setMessages((prevMessages) => [...prevMessages, responseData]);

        // We don't need to emit the message here, as the server is already doing it
      } catch (err) {
        console.error("Error sending message:", err);
        toast({
          title: "Error",
          description: "Failed to send message. Please try again.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    },
    [currentUser, friendId, toast]
  );

  return {
    messages,
    loading,
    error,
    sendMessage,
    friendInfo,
    setMessages,
  };
};
