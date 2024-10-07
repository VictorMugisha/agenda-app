/* eslint-disable no-unused-vars */
import { useState, useEffect, useCallback } from "react";
import { getAuthToken } from "../utils/utils";
import { useCurrentUser } from "./useCurrentUser";

export const useGroupChat = (groupId) => {
  const [messages, setMessages] = useState([]);
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useCurrentUser();

  const fetchGroupDetails = useCallback(async () => {
    try {
      const response = await fetch(`/api/groups/group/${groupId}`, {
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch group details');
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
          'Authorization': `Bearer ${getAuthToken()}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch messages');
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
  }, [fetchGroupDetails, fetchMessages]);

  const sendMessage = async (content) => {
    try {
      const response = await fetch(`/api/messages/${groupId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify({ content }),
      });
      if (!response.ok) {
        throw new Error('Failed to send message');
      }
      const newMessage = await response.json();
      setMessages([...messages, newMessage]);
    } catch (err) {
      setError('Failed to send message');
    }
  };

  const deleteMessage = async (messageId) => {
    try {
      const response = await fetch(`/api/messages/${messageId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to delete message');
      }
      setMessages(messages.filter(message => message._id !== messageId));
    } catch (err) {
      setError('Failed to delete message');
    }
  };

  return { group, messages, loading, error, sendMessage, currentUserId: currentUser?._id };
};
