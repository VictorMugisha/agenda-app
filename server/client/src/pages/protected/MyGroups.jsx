import { useEffect, useState } from "react";
import { useMyGroups } from "../../hooks/useMyGroups";
import useDeleteGroup from "../../hooks/useDeleteGroup";
import GroupCard from "../../components/GroupCard";
import Loading from "../../components/Loading";
import {
  Box,
  Heading,
  SimpleGrid,
  useDisclosure,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Button,
  Text,
} from "@chakra-ui/react";

export default function MyGroups() {
  const { groups, loading, error, fetchMyGroups } = useMyGroups();
  const { deleteGroup, loading: deleteLoading } = useDeleteGroup();
  const [groupToDelete, setGroupToDelete] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    fetchMyGroups();
  }, [fetchMyGroups]);

  const handleDeleteClick = (group) => {
    setGroupToDelete(group);
    onOpen();
  };

  const handleDeleteConfirm = async () => {
    if (groupToDelete) {
      const success = await deleteGroup(groupToDelete._id);
      if (success) {
        fetchMyGroups();
      }
      onClose();
    }
  };

  if (loading) return <Loading />;
  if (error)
    return (
      <Box textAlign="center" color="red.500">
        {error}
      </Box>
    );

  return (
    <Box>
      <Heading as="h1" size="xl" mb={4}>
        My Groups
      </Heading>
      {groups.length === 0 ? (
        <Text fontStyle="italic" fontSize="lg" textAlign="center" color="gray.600">
          You {"haven't"} joined any groups yet.
        </Text>
      ) : (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
          {groups.map((group) => (
            <GroupCard
              key={group._id}
              group={group}
              onDeleteClick={() => handleDeleteClick(group)}
            />
          ))}
        </SimpleGrid>
      )}

      <AlertDialog isOpen={isOpen} onClose={onClose}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader>Delete Group</AlertDialogHeader>
            <AlertDialogBody>
              Are you sure you want to delete this group? This action cannot be
              undone.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button onClick={onClose}>Cancel</Button>
              <Button
                colorScheme="red"
                onClick={handleDeleteConfirm}
                ml={3}
                isLoading={deleteLoading}
              >
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
}
