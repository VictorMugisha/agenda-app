import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { usePrivateChat } from "../../hooks/usePrivateChat";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import {
  Box,
  VStack,
  HStack,
  Text,
  Input,
  Button,
  Flex,
  Avatar,
} from "@chakra-ui/react";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";

export default function ChatRoom() {
  const { friendId } = useParams();
  const { messages, loading, error, sendMessage, friendInfo } = usePrivateChat(friendId);
  const [newMessage, setNewMessage] = useState("");
  const { currentUser } = useCurrentUser();
  const chatContainerRef = useRef(null);

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

  if (loading) return <Box>Loading...</Box>;
  if (error) return <Box>Error: {error}</Box>;

  return (
    <Box h="calc(100vh - 4rem)" display="flex" flexDirection="column">
      <Flex align="center" p={4} bg="gray.100">
        <Link to="/app/friends" className="mr-4">
          <ArrowLeftIcon className="h-6 w-6 text-gray-600" />
        </Link>
        <Text fontWeight="bold">
          {friendInfo ? `${friendInfo.firstName} ${friendInfo.lastName}` : 'Chat with Friend'}
        </Text>
      </Flex>
      <VStack
        ref={chatContainerRef}
        flex={1}
        overflowY="auto"
        p={4}
        spacing={4}
        align="stretch"
      >
        {messages.map((message) => (
          <HStack
            key={message._id}
            alignSelf={
              message.sender._id === currentUser._id ? "flex-end" : "flex-start"
            }
          >
            {message.sender._id !== currentUser._id && (
              <Avatar size="sm" name={`${message.sender.firstName} ${message.sender.lastName}`} />
            )}
            <Box
              bg={message.sender._id === currentUser._id ? "blue.100" : "gray.100"}
              p={2}
              borderRadius="md"
            >
              <Text>{message.content}</Text>
            </Box>
          </HStack>
        ))}
      </VStack>
      <form onSubmit={handleSendMessage}>
        <HStack p={4} bg="gray.100">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
          />
          <Button type="submit" colorScheme="blue">
            Send
          </Button>
        </HStack>
      </form>
    </Box>
  );
}
