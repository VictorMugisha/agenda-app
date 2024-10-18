import { useState, useEffect, useCallback, useRef } from "react";
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
  const pendingMessages = useRef(new Set());

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
    if (!currentUser || !friendId) return;

    socket.connect();

    console.log(`Joining private chat room for ${currentUser._id} and ${friendId}`);
    socket.emit("join_private_chat", { userId: currentUser._id, friendId });

    const handleReceiveMessage = (message) => {
      console.log("Received private message:", message);
      setMessages((prevMessages) => {
        if (pendingMessages.current.has(message._id)) {
          pendingMessages.current.delete(message._id);
          return prevMessages.map(msg => 
            msg._id === message._id ? message : msg
          );
        } else if (!prevMessages.some(m => m._id === message._id)) {
          return [...prevMessages, message];
        }
        return prevMessages;
      });
    };

    socket.on("receive_private_message", handleReceiveMessage);

    fetchMessages();
    fetchFriendInfo();

    return () => {
      console.log("Cleaning up private chat...");
      socket.off("receive_private_message", handleReceiveMessage);
      socket.emit("leave_private_chat", { userId: currentUser._id, friendId });
    };
  }, [currentUser, friendId, fetchMessages, fetchFriendInfo]);

  const sendMessage = useCallback(
    async (content) => {
      if (!currentUser || !currentUser._id) {
        toast({
          title: "Error",
          description: "User not authenticated or user ID is missing",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      const tempId = `temp-${Date.now()}`;
      const optimisticMessage = {
        _id: tempId,
        content,
        sender: {
          _id: currentUser._id,
          firstName: currentUser.firstName,
          lastName: currentUser.lastName,
          username: currentUser.username
        },
        recipient: friendId,
        createdAt: new Date().toISOString()
      };

      try {
        console.log("Sending private message:", content);
        
        setMessages(prevMessages => [...prevMessages, optimisticMessage]);
        pendingMessages.current.add(tempId);

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

        pendingMessages.current.delete(tempId);
        pendingMessages.current.add(responseData._id);

        setMessages(prevMessages => 
          prevMessages.map(msg => 
            msg._id === tempId ? { ...responseData, _id: responseData._id } : msg
          )
        );

      } catch (err) {
        console.error("Error sending private message:", err);
        pendingMessages.current.delete(tempId);
        setMessages(prevMessages => 
          prevMessages.filter(msg => msg._id !== tempId)
        );
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
