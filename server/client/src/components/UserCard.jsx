import { Box, Text, Button, Flex, Badge } from "@chakra-ui/react";
import PropTypes from "prop-types";

export default function UserCard({ user, onAddFriend, isLoading = false }) {
  return (
    <Box p={4} borderWidth={1} borderRadius="md">
      <Flex justify="space-between" align="center">
        <Box>
          <Text fontWeight="bold">
            {user.firstName} {user.lastName}
          </Text>
          <Text>@{user.username}</Text>
        </Box>
        {user.hasPendingRequest ? (
          <Badge colorScheme="yellow">Pending</Badge>
        ) : (
          <Button
            size="sm"
            colorScheme="blue"
            onClick={() => onAddFriend(user._id)}
            isLoading={isLoading}
          >
            Add Friend
          </Button>
        )}
      </Flex>
    </Box>
  );
}

UserCard.propTypes = {
  user: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    hasPendingRequest: PropTypes.bool.isRequired,
  }).isRequired,
  onAddFriend: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
};
