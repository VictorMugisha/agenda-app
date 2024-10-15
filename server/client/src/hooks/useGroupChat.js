import { useState, useEffect, useCallback } from "react";
import { useCurrentUser } from "./useCurrentUser";
import { useToast } from "@chakra-ui/react";
import socket from "../socket";

const MESSAGES_PER_PAGE = 50;

export const useGroupChat = (groupId) => {
  const toast = useToast();
  const [messages, setMessages] = useState([]);
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useCurrentUser();
  const [connectionAttempts, setConnectionAttempts] = useState(0);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const maxRetries = 3;
  const connectionTimeout = 10000; // 10 seconds

  const markAsRead = useCallback((messageId) => {
    if (currentUser && currentUser._id) {
      socket.emit("mark_as_read", { messageId, userId: currentUser._id, groupId });
    }
  }, [currentUser, groupId]);

  const loadMoreMessages = useCallback(() => {
    if (hasMore && !loading) {
      setPage(prevPage => prevPage + 1);
      socket.emit("fetch_messages", { groupId, page: page + 1, limit: MESSAGES_PER_PAGE });
    }
  }, [groupId, hasMore, loading, page]);

  useEffect(() => {
    if (!currentUser || !groupId) return;

    let connectionTimer;

    const connectSocket = () => {
      console.log(`Attempting to connect to socket (Attempt ${connectionAttempts + 1})`);
      socket.connect();

      connectionTimer = setTimeout(() => {
        if (socket.connected) {
          console.log("Socket connected successfully");
          // Register user after successful connection
          socket.emit("register_user", { userId: currentUser._id, username: currentUser.username });
        } else {
          console.log("Socket connection timed out");
          if (connectionAttempts < maxRetries) {
            setConnectionAttempts(prev => prev + 1);
            socket.disconnect();
            connectSocket();
          } else {
            setError("Failed to connect to chat server after multiple attempts");
            setLoading(false);
          }
        }
      }, connectionTimeout);
    };

    connectSocket();

    socket.on("connect", () => {
      console.log(`Socket connected after ${connectionAttempts} attempts`);
      clearTimeout(connectionTimer);
      // Register user after connection
      socket.emit("register_user", { userId: currentUser._id, username: currentUser.username });
      socket.emit("join_group", groupId);
      socket.emit("fetch_group_details", groupId);
      socket.emit("fetch_messages", { groupId, page: 1, limit: MESSAGES_PER_PAGE });
    });

    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
      setError("Failed to connect to chat server");
      setLoading(false);
    });

    socket.on("group_details", (groupData) => {
      setGroup(groupData);
      setLoading(false);
    });

    socket.on("messages", ({ messages: newMessages, hasMore: moreMessages }) => {
      setMessages(prevMessages => [...prevMessages, ...newMessages]);
      setHasMore(moreMessages);
      setLoading(false);
      // Mark unread messages as read
      newMessages.forEach(message => {
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
      setLoading(false);
      toast({
        title: "Error",
        description: errorMessage,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    });

    return () => {
      clearTimeout(connectionTimer);
      socket.emit("leave_group", groupId);
      socket.off("connect");
      socket.off("group_details");
      socket.off("messages");
      socket.off("receive_message");
      socket.off("message_read");
      socket.off("error");
      socket.disconnect();
    };
  }, [groupId, currentUser, toast, markAsRead, connectionAttempts]);

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
    loadMoreMessages,
    hasMore
  };
};
