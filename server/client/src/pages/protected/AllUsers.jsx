import { useState } from "react";
import { useAllUsers } from "../../hooks/useAllUsers";
import { useFriendRequests } from "../../hooks/useFriendRequests";
import UserCard from "../../components/UserCard";
import { Box, VStack, Heading, Input, InputGroup, InputLeftElement, Button } from "@chakra-ui/react";
import { IoSearchOutline } from "react-icons/io5";
import { Link } from "react-router-dom";

export default function AllUsers() {
  const { users, loading: usersLoading, error: usersError } = useAllUsers();
  const { sendFriendRequest, acceptFriendRequest, loadingUsers, error: requestError } = useFriendRequests();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredUsers = users.filter((user) =>
    `${user.firstName} ${user.lastName} ${user.username}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box maxW="xl" mx="auto" p={4}>
      <Heading as="h1" size="xl" mb={4}>
        All Users
      </Heading>
      <Button as={Link} to="/app/friend-requests" colorScheme="yellow" mb={4}>
        View Pending Friend Requests
      </Button>
      <Box mb={4}>
        <InputGroup>
          <InputLeftElement pointerEvents="none">
            <IoSearchOutline />
          </InputLeftElement>
          <Input
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </InputGroup>
      </Box>
      {usersLoading ? (
        <VStack spacing={4} align="stretch">
          {[...Array(5)].map((_, index) => (
            <Box key={index} height="80px" bg="gray.100" borderRadius="md" />
          ))}
        </VStack>
      ) : usersError ? (
        <Box textAlign="center" color="red.500">
          {usersError}
        </Box>
      ) : (
        <VStack spacing={4} align="stretch">
          {filteredUsers.map((user) => (
            <UserCard
              key={user._id}
              user={user}
              onAddFriend={sendFriendRequest}
              onAcceptFriend={acceptFriendRequest}
              isLoading={loadingUsers[user._id] || false}
              navigateTo={`/app/profile/${user._id}`}
            />
          ))}
        </VStack>
      )}
      {requestError && (
        <Box textAlign="center" color="red.500" mt={4}>
          {requestError}
        </Box>
      )}
    </Box>
  );
}
