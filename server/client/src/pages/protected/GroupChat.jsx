/* eslint-disable no-unused-vars */
import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { useGroupChat } from "../../hooks/useGroupChat";
import Loading from "../../components/Loading";
import { formatDistanceToNow } from "date-fns";
import { ArrowLeftIcon, InformationCircleIcon } from "@heroicons/react/24/solid";
import { 
  Modal, 
  ModalOverlay, 
  ModalContent, 
  ModalHeader, 
  ModalFooter, 
  ModalBody, 
  ModalCloseButton,
  Button,
  useDisclosure
} from "@chakra-ui/react";

export default function GroupChat() {
  const { groupId } = useParams();
  const { group, messages, loading, error, sendMessage, currentUserId, markAsRead } = useGroupChat(groupId);
  const [newMessage, setNewMessage] = useState("");
  const chatContainerRef = useRef(null);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      sendMessage(newMessage.trim());
      setNewMessage("");
    }
  };

  const handleReadReceipt = (message) => {
    setSelectedMessage(message);
    onOpen();
  };

  if (loading) return <Loading />;
  if (error) return <div className="text-center text-red-500">{error}</div>;
  if (!group) return <div className="text-center">Group not found.</div>;

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      {/* Header */}
      <div className="bg-white shadow-md p-4 flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/app/mygroups" className="mr-4">
            <ArrowLeftIcon className="h-6 w-6 text-gray-600" />
          </Link>
          <Link to={`/app/group/${groupId}`} className="flex items-center">
            <h1 className="text-xl font-semibold">{group.name}</h1>
            <InformationCircleIcon className="h-5 w-5 ml-2 text-gray-600" />
          </Link>
        </div>
      </div>

      {/* Chat messages */}
      <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4">
        {messages.map((message) => (
          <div 
            key={message._id}
            className={`mb-4 flex ${message.sender._id === currentUserId ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[75%] rounded-lg p-3 ${
                message.sender._id === currentUserId 
                  ? 'bg-blue-500 text-white ml-auto' 
                  : 'bg-gray-200 text-black mr-auto'
              }`}
            >
              <p className="font-bold text-sm">{message.sender.username}</p>
              <p className="break-words">{message.content}</p>
              <div className="flex justify-between items-center mt-1">
                <p className="text-xs opacity-75">
                  {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
                </p>
                <button 
                  onClick={() => handleReadReceipt(message)} 
                  className="text-xs opacity-75 hover:opacity-100"
                >
                  {message.readBy.length} read
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Message input */}
      <form onSubmit={handleSendMessage} className="p-4 bg-white border-t">
        <div className="flex justify-center items-center max-w-4xl mx-auto">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1 input input-bordered min-w-0"
            placeholder="Type a message..."
          />
          <button type="submit" className="btn btn-primary ml-2 whitespace-nowrap">
            Send
          </button>
        </div>
      </form>

      {/* Read Receipt Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Read by</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedMessage && (
              <ul>
                {selectedMessage.readBy.map((userId) => {
                  const user = group.members.find(member => member._id === userId);
                  return user ? (
                    <li key={userId}>{`${user.firstName} ${user.lastName}`}</li>
                  ) : null;
                })}
              </ul>
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}