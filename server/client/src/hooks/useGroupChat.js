/* eslint-disable no-unused-vars */
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios'; // Assuming you're using axios for API calls

export const useGroupChat = (groupId) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMessages = useCallback(async () => {
    try {
      setLoading(true);
      // Replace with your actual API endpoint
      const response = await axios.get(`/api/groups/${groupId}/messages`);
      setMessages(response.data);
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
      // Replace with your actual API endpoint
      const response = await axios.post(`/api/groups/${groupId}/messages`, { content });
      setMessages([...messages, response.data]);
    } catch (err) {
      setError('Failed to send message');
    }
  };

  const deleteMessage = async (messageId) => {
    try {
      // Replace with your actual API endpoint
      await axios.delete(`/api/groups/${groupId}/messages/${messageId}`);
      setMessages(messages.filter(message => message.id !== messageId));
    } catch (err) {
      setError('Failed to delete message');
    }
  };

  // If you're implementing real-time updates, you could add a function like this:
  const addIncomingMessage = (message) => {
    setMessages(prevMessages => [...prevMessages, message]);
  };

  return {
    messages,
    loading,
    error,
    sendMessage,
    deleteMessage,
    addIncomingMessage, // Include this if you're using real-time updates
    refreshMessages: fetchMessages
  };
};
