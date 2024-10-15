import { useEffect } from "react";
import { useMyGroups } from "../../hooks/useMyGroups";
import GroupCard from "../../components/GroupCard";
import SkeletonLoader from "../../components/SkeletonLoader";
import { Box, Heading, SimpleGrid, Text } from "@chakra-ui/react";

export default function MyGroups() {
  const { groups, loading, error, fetchMyGroups } = useMyGroups();

  useEffect(() => {
    fetchMyGroups();
  }, [fetchMyGroups]);

  return (
    <Box className="px-2 py-4">
      <Heading as="h1" size="xl" mb={4}>
        My Groups
      </Heading>

      {loading ? (
        <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={4}>
          {Array.from({ length: 6 }).map((_, index) => (
            <SkeletonLoader key={index} />
          ))}
        </SimpleGrid>
      ) : error ? (
        <Box textAlign="center" color="red.500">
          {error}
        </Box>
      ) : groups.length === 0 ? (
        <Text
          fontStyle="italic"
          fontSize="lg"
          textAlign="center"
          color="gray.600"
        >
          You {"haven't"} joined any groups yet.
        </Text>
      ) : (
        <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={4}>
          {groups.map((group) => (
            <GroupCard key={group._id} group={group} />
          ))}
        </SimpleGrid>
      )}
    </Box>
  );
}
