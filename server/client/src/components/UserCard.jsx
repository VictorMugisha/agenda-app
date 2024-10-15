import { Box, Text, Button, Flex, Badge } from "@chakra-ui/react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

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
        <Flex>
          {user.friendStatus === "none" && (
            <Button
              size="sm"
              colorScheme="blue"
              onClick={() => onAddFriend(user._id)}
              isLoading={isLoading}
            >
              Add Friend
            </Button>
          )}
          {user.friendStatus === "pending" && (
            <>
              <Badge colorScheme="yellow" mr={2}>Pending</Badge>
              <Button
                size="sm"
                colorScheme="blue"
                as={Link}
                to={`/app/profile/${user._id}`}
              >
                View
              </Button>
            </>
          )}
          {user.friendStatus === "accepted" && (
            <Badge colorScheme="green">Friends</Badge>
          )}
        </Flex>
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
    friendStatus: PropTypes.oneOf(["none", "pending", "accepted"]).isRequired,
    friendRequestId: PropTypes.string,
    isRequester: PropTypes.bool,
  }).isRequired,
  onAddFriend: PropTypes.func.isRequired,
  onAcceptFriend: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
};
