import {
  Box,
  VStack,
  Text,
  Button,
  Flex,
  Heading,
  useToast,
} from "@chakra-ui/react";
import { usePendingFriendRequests } from "../../hooks/usePendingFriendRequests";
import { Link } from "react-router-dom";

export default function PendingFriendRequests() {
  const { pendingRequests, loading, error, handleFriendRequest } =
    usePendingFriendRequests();
  const toast = useToast();

  const onActionTaken = async (requestId, action) => {
    try {
      await handleFriendRequest(requestId, action);
      toast({
        title: `Friend request ${action}ed`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      toast({
        title: "Error",
        description: err.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  if (loading) return <Text>Loading pending friend requests...</Text>;
  if (error) return <Text color="red.500">{error}</Text>;

  return (
    <Box maxW="xl" mx="auto" p={4}>
      <Heading as="h1" size="xl" mb={4}>
        Pending Friend Requests
      </Heading>
      {pendingRequests.length === 0 ? (
        <Text>No pending friend requests</Text>
      ) : (
        <VStack spacing={4} align="stretch">
          {pendingRequests.map((request) => (
            <Box key={request._id} p={4} borderWidth={1} borderRadius="md">
              <Flex justify="space-between" align="center">
                <Box>
                  <Text fontWeight="bold">
                    {request.requester.firstName} {request.requester.lastName}
                  </Text>
                  <Text>@{request.requester.username}</Text>
                </Box>
                <Flex>
                  <Button
                    size="sm"
                    colorScheme="green"
                    mr={2}
                    onClick={() => onActionTaken(request._id, "accept")}
                  >
                    Accept
                  </Button>
                  <Button
                    size="sm"
                    colorScheme="red"
                    mr={2}
                    onClick={() => onActionTaken(request._id, "decline")}
                  >
                    Decline
                  </Button>
                  <Button
                    size="sm"
                    colorScheme="blue"
                    as={Link}
                    to={`/app/profile/${request.requester._id}`}
                  >
                    View
                  </Button>
                </Flex>
              </Flex>
            </Box>
          ))}
        </VStack>
      )}
    </Box>
  );
}
