import { useParams } from "react-router-dom";
import { useUserProfile } from "../../hooks/useUserProfile";
import { Box, VStack, Heading, Text, Image, Flex, Badge, Avatar, AvatarGroup, Button, SimpleGrid, Container, Divider } from "@chakra-ui/react";
import { FaUsers, FaUserFriends } from "react-icons/fa";
import { FiMail, FiPhone, FiUserPlus } from "react-icons/fi";
import SkeletonProfile from "../../components/SkeletonProfile";
import { useFriendRequests } from "../../hooks/useFriendRequests";

export default function UserProfile() {
  const { userId } = useParams();
  const { userProfile, loading, error } = useUserProfile(userId);
  const { sendFriendRequest, loadingUsers } = useFriendRequests();

  if (loading) {
    return <SkeletonProfile />;
  }

  if (error) {
    return (
      <Box textAlign="center" color="red.500" fontSize="xl" mt={8}>
        {error}
      </Box>
    );
  }

  if (!userProfile) {
    return (
      <Box textAlign="center" fontSize="xl" mt={8}>
        User not found
      </Box>
    );
  }

  const showAddFriendButton = userProfile.friendStatus === "none";

  const handleAddFriend = () => {
    sendFriendRequest(userId);
  };

  return (
    <Box className="bg-gray-100 min-h-screen py-12">
      <Container maxW="6xl">
        <VStack spacing={8}>
          <Box bg="white" shadow="xl" rounded="2xl" overflow="hidden" w="full">
            <VStack p={8} spacing={4} align="center">
              <Image
                src={userProfile.profilePicture || "https://bit.ly/sage-adebayo"}
                alt={`${userProfile.firstName} ${userProfile.lastName}`}
                borderRadius="full"
                boxSize="200px"
                objectFit="cover"
                border="4px solid white"
                shadow="lg"
              />
              <VStack spacing={2}>
                <Heading as="h1" size="2xl" textAlign="center">
                  {userProfile.firstName} {userProfile.lastName}
                </Heading>
                <Text fontSize="xl" color="gray.500">
                  @{userProfile.username}
                </Text>
              </VStack>
              {userProfile.bio && (
                <Text fontSize="md" textAlign="center" maxW="2xl">
                  {userProfile.bio}
                </Text>
              )}
              <Flex wrap="wrap" justify="center" gap={2}>
                <Badge colorScheme="blue" fontSize="sm" px={3} py={1} borderRadius="full">
                  {userProfile.groupsCreated?.length || 0} Created Groups
                </Badge>
                <Badge colorScheme="green" fontSize="sm" px={3} py={1} borderRadius="full">
                  {userProfile.groupsJoined?.length || 0} Joined Groups
                </Badge>
                <Badge colorScheme="purple" fontSize="sm" px={3} py={1} borderRadius="full">
                  {userProfile.friends?.length || 0} Friends
                </Badge>
              </Flex>
              <VStack align="center" spacing={2}>
                <Flex align="center">
                  <FiMail className="mr-2 text-gray-600" />
                  <Text>{userProfile.email}</Text>
                </Flex>
                {userProfile.phoneNumber && (
                  <Flex align="center">
                    <FiPhone className="mr-2 text-gray-600" />
                    <Text>{userProfile.phoneNumber}</Text>
                  </Flex>
                )}
              </VStack>
              {showAddFriendButton && (
                <Button
                  leftIcon={<FiUserPlus />}
                  colorScheme="blue"
                  size="md"
                  onClick={handleAddFriend}
                  isLoading={loadingUsers[userId]}
                >
                  Add Friend
                </Button>
              )}
              {userProfile.friendStatus === "pending" && (
                <Badge colorScheme="yellow" fontSize="md" px={3} py={1} borderRadius="full">
                  Friend Request Pending
                </Badge>
              )}
              {userProfile.friendStatus === "accepted" && (
                <Badge colorScheme="green" fontSize="md" px={3} py={1} borderRadius="full">
                  Friends
                </Badge>
              )}
            </VStack>
          </Box>

          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8} w="full">
            <Box bg="white" shadow="md" rounded="xl" p={6}>
              <Heading as="h2" size="lg" mb={4}>
                <Flex alignItems="center">
                  <FaUsers className="mr-2 text-blue-500" />
                  Groups
                </Flex>
              </Heading>
              <Divider mb={4} />
              <VStack align="start" spacing={4}>
                <Box>
                  <Heading as="h3" size="md" mb={2}>
                    Created Groups
                  </Heading>
                  {userProfile.groupsCreated?.length > 0 ? (
                    userProfile.groupsCreated.map((group) => (
                      <Text key={`created-${group._id}`} py={1}>{group.name}</Text>
                    ))
                  ) : (
                    <Text color="gray.500">No created groups</Text>
                  )}
                </Box>
                <Box>
                  <Heading as="h3" size="md" mb={2}>
                    Joined Groups
                  </Heading>
                  {userProfile.groupsJoined?.length > 0 ? (
                    userProfile.groupsJoined.map((group) => (
                      <Text key={`joined-${group._id}`} py={1}>{group.name}</Text>
                    ))
                  ) : (
                    <Text color="gray.500">No joined groups</Text>
                  )}
                </Box>
              </VStack>
            </Box>
            <Box bg="white" shadow="md" rounded="xl" p={6}>
              <Heading as="h2" size="lg" mb={4}>
                <Flex alignItems="center">
                  <FaUserFriends className="mr-2 text-green-500" />
                  Friends
                </Flex>
              </Heading>
              <Divider mb={4} />
              <AvatarGroup size="md" max={5} mb={4}>
                {userProfile.friends?.map((friend) => (
                  <Avatar key={`avatar-${friend._id}`} name={`${friend.firstName} ${friend.lastName}`} src={friend.profilePicture} />
                ))}
              </AvatarGroup>
              <VStack align="start" spacing={2}>
                {userProfile.friends?.length > 0 ? (
                  userProfile.friends.map((friend) => (
                    <Text key={`friend-${friend._id}`}>{`${friend.firstName} ${friend.lastName}`}</Text>
                  ))
                ) : (
                  <Text color="gray.500">No friends yet</Text>
                )}
              </VStack>
            </Box>
          </SimpleGrid>
        </VStack>
      </Container>
    </Box>
  );
}
