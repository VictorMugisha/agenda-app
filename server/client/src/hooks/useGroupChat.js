/* eslint-disable no-unused-vars */
import { useState, useEffect, useCallback } from "react";
import { getAuthToken } from "../utils/utils";
import { useCurrentUser } from "./useCurrentUser";
import { useToast } from "@chakra-ui/react";
import socket from "../socket";

export const useGroupChat = (groupId) => {
  const toast = useToast();
  const [messages, setMessages] = useState([]);
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useCurrentUser();

  const fetchGroupDetails = useCallback(async () => {
    try {
      const response = await fetch(`/api/groups/group/${groupId}`, {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch group details");
      }
      const data = await response.json();
      setGroup(data);
    } catch (err) {
      setError(err.message);
    }
  }, [groupId]);

  const fetchMessages = useCallback(async () => {
    try {
      const response = await fetch(`/api/messages/${groupId}`, {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch messages");
      }
      const data = await response.json();
      setMessages(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [groupId]);

  useEffect(() => {
    fetchGroupDetails();
    fetchMessages();

    // Join the group's socket room
    socket.emit("join_group", groupId);

    // Listen for new messages
    socket.on("receive_message", (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    return () => {
      // Leave the group's socket room when component unmounts
      socket.emit("leave_group", groupId);
      socket.off("receive_message");
    };
  }, [groupId, fetchGroupDetails, fetchMessages]);

  const sendMessage = async (content) => {
    try {
      const response = await fetch(`/api/messages/${groupId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify({ content }),
      });
      if (!response.ok) {
        throw new Error("Failed to send message");
      }
      const newMessage = await response.json();
      // No need to update messages here, as it will be handled by the socket event
      toast({
        title: "Message sent",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } catch (err) {
      setError("Failed to send message");
      toast({
        title: "Error",
        description: "Failed to send message",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return {
    group,
    messages,
    loading,
    error,
    sendMessage,
    currentUserId: currentUser?._id,
  };
};
