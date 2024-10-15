import { Box, VStack, Text, Button, Flex, Heading } from "@chakra-ui/react";
import { usePendingFriendRequests } from "../hooks/usePendingFriendRequests";

export default function PendingFriendRequests() {
  const { pendingRequests, loading, error, handleFriendRequest } =
    usePendingFriendRequests();

  if (loading) return <Text>Loading pending friend requests...</Text>;
  if (error) return <Text color="red.500">{error}</Text>;

  return (
    <Box>
      <Heading as="h2" size="lg" mb={4}>
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
                    onClick={() => handleFriendRequest(request._id, "accept")}
                  >
                    Accept
                  </Button>
                  <Button
                    size="sm"
                    colorScheme="red"
                    onClick={() => handleFriendRequest(request._id, "decline")}
                  >
                    Decline
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
