import { useState } from "react";
import { Box, Heading, Input, VStack, Text } from "@chakra-ui/react";
import UserCard from "../../components/UserCard";
import { useFriends } from "../../hooks/useFriends";
import SkeletonLoader from "../../components/SkeletonLoader";

export default function Friends() {
  const { friends, loading, error } = useFriends();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFriends = friends.filter((friend) =>
    `${friend.firstName} ${friend.lastName} ${friend.username}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  return (
    <Box maxW="xl" mx="auto" p={4}>
      <Heading as="h1" size="xl" mb={4}>
        My Friends
      </Heading>
      <Box mb={4}>
        <Input
          placeholder="Search friends..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </Box>
      {loading ? (
        <VStack spacing={4} align="stretch">
          {[...Array(5)].map((_, index) => (
            <SkeletonLoader key={index} />
          ))}
        </VStack>
      ) : error ? (
        <Text color="red.500" textAlign="center">
          {error}
        </Text>
      ) : (
        <VStack spacing={4} align="stretch">
          {filteredFriends.map((friend) => (
            <UserCard
              key={friend._id}
              user={{...friend, friendStatus: 'accepted'}}
              onAddFriend={() => {}}
              isLoading={false}
              navigateTo={`/app/profile/${friend._id}`}
              showChatButton={true}
            />
          ))}
        </VStack>
      )}
    </Box>
  );
}
