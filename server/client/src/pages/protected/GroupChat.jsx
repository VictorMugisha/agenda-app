import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useGroupChat } from "../../hooks/useGroupChat";
import Loading from "../../components/Loading";
import { formatDistanceToNow } from "date-fns";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";

export default function GroupChat() {
  const { groupId } = useParams();
  const { group, messages, loading, error, sendMessage, currentUserId } = useGroupChat(groupId);
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
  if (!group) return <div className="text-center">Group not found.</div>;

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="bg-white shadow-md p-4 flex items-center">
        <Link to="/app/mygroups" className="mr-4">
          <ArrowLeftIcon className="h-6 w-6 text-gray-600" />
        </Link>
        <h1 className="text-xl font-semibold">{group.name}</h1>
      </div>

      {/* Chat messages */}
      <div id="chat-container" className="flex-1 overflow-y-auto p-4">
        {messages.map((message) => (
          <div 
            key={message._id} 
            className={`mb-4 flex ${message.sender._id === currentUserId ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[70%] rounded-lg p-3 ${
                message.sender._id === currentUserId 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 text-black'
              }`}
            >
              <p className="font-bold">{message.sender.username}</p>
              <p>{message.content}</p>
              <p className="text-xs mt-1 opacity-75">
                {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Message input */}
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
