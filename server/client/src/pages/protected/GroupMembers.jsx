import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useGroupMembers } from "../../hooks/useGroupMembers";
import { useGroupDetails } from "../../hooks/useGroupDetails";
import Loading from "../../components/Loading";
import {
  Box,
  VStack,
  Text,
  Heading,
  Button,
  Badge,
  Flex,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";

export default function GroupMembers() {
  const { groupId } = useParams();
  const { members, loading, error, fetchMembers, removeMember } = useGroupMembers(groupId);
  const { group } = useGroupDetails(groupId);
  const [memberToRemove, setMemberToRemove] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

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

  const isAdmin = group?.admin?._id === group?.members?.find(member => member.isAdmin)?._id;

  const handleRemoveMember = (member) => {
    setMemberToRemove(member);
    onOpen();
  };

  const confirmRemoveMember = async () => {
    if (memberToRemove) {
      await removeMember(memberToRemove._id);
      onClose();
    }
  };

  if (loading) return <Loading />;
  if (error) return <Box textAlign="center" color="red.500">{error}</Box>;

  return (
    <Box maxW="xl" mx="auto" p={4}>
      <Heading as="h1" size="xl" mb={4}>Group Members</Heading>
      <VStack spacing={4} align="stretch">
        {sortedMembers.map((member) => (
          <Box key={member._id} p={4} borderWidth={1} borderRadius="md">
            <Flex justify="space-between" align="center">
              <Box>
                <Text fontWeight="bold">{member.firstName} {member.lastName}</Text>
                <Text>@{member.username}</Text>
              </Box>
              <Flex align="center">
                {member.isAdmin && <Badge colorScheme="green" mr={2}>Admin</Badge>}
                {isAdmin && !member.isAdmin && (
                  <Button size="sm" colorScheme="red" onClick={() => handleRemoveMember(member)}>
                    Remove
                  </Button>
                )}
              </Flex>
            </Flex>
          </Box>
        ))}
      </VStack>
      <Button as={Link} to={`/app/group/${groupId}`} mt={4}>Back to Group</Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm Member Removal</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Are you sure you want to remove {memberToRemove?.firstName} {memberToRemove?.lastName} from the group?
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="gray" mr={3} onClick={onClose}>Cancel</Button>
            <Button colorScheme="red" onClick={confirmRemoveMember}>Remove</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
