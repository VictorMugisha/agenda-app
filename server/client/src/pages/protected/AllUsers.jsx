import { useAllUsers } from "../../hooks/useAllUsers";
import Loading from "../../components/Loading";
import { Box, VStack, Text, Heading, Button, Flex } from "@chakra-ui/react";

export default function AllUsers() {
  const { users, loading, error } = useAllUsers();

  if (loading) return <Loading />;
  if (error)
    return (
      <Box textAlign="center" color="red.500">
        {error}
      </Box>
    );

  return (
    <Box maxW="xl" mx="auto" p={4}>
      <Heading as="h1" size="xl" mb={4}>
        All Users
      </Heading>
      <VStack spacing={4} align="stretch">
        {users.map((user) => (
          <Box key={user._id} p={4} borderWidth={1} borderRadius="md">
            <Flex justify="space-between" align="center">
              <Box>
                <Text fontWeight="bold">
                  {user.firstName} {user.lastName}
                </Text>
                <Text>@{user.username}</Text>
              </Box>
              <Button size="sm" colorScheme="blue">
                Add Friend
              </Button>
            </Flex>
          </Box>
        ))}
      </VStack>
    </Box>
  );
}
