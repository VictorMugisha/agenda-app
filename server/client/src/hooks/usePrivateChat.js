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
    socket.on("private_message", (message) => {
      if (message.sender === friendId || message.recipient === friendId) {
        setMessages((prevMessages) => [...prevMessages, message]);
      }
    });

    return () => {
      socket.off("private_message");
    };
  }, [friendId]);

  const sendMessage = useCallback(
    (content) => {
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

      socket.emit("send_private_message", {
        content,
        recipientId: friendId,
        senderId: currentUser._id,
      });
    },
    [currentUser, friendId, toast]
  );

  const markAsRead = useCallback(async (messageId) => {
    try {
      const response = await fetch(`/api/private-messages/${messageId}/read`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to mark message as read");
      }

      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg._id === messageId ? { ...msg, read: true } : msg
        )
      );
    } catch (err) {
      console.error("Error marking message as read:", err);
    }
  }, []);

  return {
    messages,
    loading,
    error,
    sendMessage,
    markAsRead,
    friendInfo,
  };
};
