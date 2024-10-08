import { useEffect, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { useGroupMembers } from "../../hooks/useGroupMembers";
import Loading from "../../components/Loading";
import {
  Box,
  VStack,
  Text,
  Heading,
  Button,
  Badge,
  Flex,
} from "@chakra-ui/react";

export default function GroupMembers() {
  const { groupId } = useParams();
  const { members, loading, error, fetchMembers } = useGroupMembers(groupId);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  const sortedMembers = useMemo(() => {
    if (!members) return [];
    return [...members].sort((a, b) => {
      if (a.isAdmin && !b.isAdmin) return -1;
      if (!a.isAdmin && b.isAdmin) return 1;
      return 0;
    });
  }, [members]);

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
        Group Members
      </Heading>
      <VStack spacing={4} align="stretch">
        {sortedMembers.map((member) => (
          <Box key={member._id} p={4} borderWidth={1} borderRadius="md">
            <Flex justify="space-between" align="center">
              <Box>
                <Text fontWeight="bold">
                  {member.firstName} {member.lastName}
                </Text>
                <Text>@{member.username}</Text>
              </Box>
              {member.isAdmin && <Badge colorScheme="green">Admin</Badge>}
            </Flex>
          </Box>
        ))}
      </VStack>
      <Button as={Link} to={`/app/group/${groupId}`} mt={4}>
        Back to Group
      </Button>
    </Box>
  );
}
