import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useGroupChat } from "../../hooks/useGroupChat";
import Loading from "../../components/Loading";

export default function GroupChat() {
  const { groupId } = useParams();
  const { messages, loading, error, sendMessage } = useGroupChat(groupId);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    // Scroll to bottom of chat
    const chatContainer = document.getElementById("chat-container");
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      sendMessage(newMessage);
      setNewMessage("");
    }
  };

  if (loading) return <Loading />;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="flex flex-col h-[calc(100vh-64px)]">
      <div id="chat-container" className="flex-1 overflow-y-auto p-4">
        {messages.map((message) => (
          <div key={message._id} className="mb-4">
            <p className="font-bold">{message.sender.username}</p>
            <p>{message.content}</p>
          </div>
        ))}
      </div>
      <form onSubmit={handleSendMessage} className="p-4 bg-white">
        <div className="flex">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1 input input-bordered"
            placeholder="Type a message..."
          />
          <button type="submit" className="btn btn-primary ml-2">Send</button>
        </div>
      </form>
    </div>
  );
}
