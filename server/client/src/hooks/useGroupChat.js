/* eslint-disable no-unused-vars */
import { useState, useEffect, useCallback } from 'react';
import { getAuthToken } from "../utils/utils";

export const useGroupChat = (groupId) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMessages = useCallback(async () => {
    if (!groupId) {
      setError('No group ID provided');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`/api/messages/${groupId}`, {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch messages');
      }
      const data = await response.json();
      setMessages(data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch messages');
      setLoading(false);
    }
  }, [groupId]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

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

  return {
    messages,
    loading,
    error,
    sendMessage,
    deleteMessage,
    refreshMessages: fetchMessages
  };
};
