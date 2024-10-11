import { useState, useEffect, useCallback } from "react";
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

  const markAsRead = useCallback((messageId) => {
    if (currentUser && currentUser._id) {
      socket.emit("mark_as_read", { messageId, userId: currentUser._id, groupId });
    }
  }, [currentUser, groupId]);

  useEffect(() => {
    if (!currentUser || !groupId) return;

    socket.connect();

    socket.on("connect", () => {
      socket.emit("join_group", groupId);
      socket.emit("fetch_group_details", groupId);
      socket.emit("fetch_messages", groupId);
    });

    socket.on("group_details", (groupData) => {
      setGroup(groupData);
    });

    socket.on("messages", (messagesData) => {
      setMessages(messagesData);
      setLoading(false);
      // Mark unread messages as read
      messagesData.forEach(message => {
        if (!message.readBy.includes(currentUser._id)) {
          markAsRead(message._id);
        }
      });
    });

    socket.on("receive_message", (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      // Mark the new message as read if it's not from the current user
      if (newMessage.sender._id !== currentUser._id) {
        markAsRead(newMessage._id);
      }
    });

    socket.on("message_read", ({ messageId, userId }) => {
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg._id === messageId && !msg.readBy.includes(userId)
            ? { ...msg, readBy: [...msg.readBy, userId] }
            : msg
        )
      );
    });

    socket.on("error", (errorMessage) => {
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    });

    return () => {
      socket.emit("leave_group", groupId);
      socket.off("connect");
      socket.off("group_details");
      socket.off("messages");
      socket.off("receive_message");
      socket.off("message_read");
      socket.off("error");
      socket.disconnect();
    };
  }, [groupId, currentUser, toast, markAsRead]);

  const sendMessage = useCallback((content) => {
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

    socket.emit("send_message", { content, groupId, senderId: currentUser._id });
  }, [currentUser, groupId, toast]);

  return {
    group,
    messages,
    loading,
    error,
    sendMessage,
    currentUserId: currentUser?._id,
    markAsRead,
  };
};
