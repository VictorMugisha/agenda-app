import { Box, Text, Button, Flex, Badge } from "@chakra-ui/react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

export default function UserCard({ user, onAddFriend, isLoading = false }) {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/app/profile/${user._id}`);
  };

  return (
    <Box 
      p={4} 
      borderWidth={1} 
      borderRadius="md" 
      onClick={handleCardClick}
      cursor="pointer"
      _hover={{ backgroundColor: "gray.50" }}
    >
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
              onClick={(e) => {
                e.stopPropagation();
                onAddFriend(user._id);
              }}
              isLoading={isLoading}
            >
              Add Friend
            </Button>
          )}
          {user.friendStatus === "pending" && (
            <Badge colorScheme="yellow">Pending</Badge>
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
  }).isRequired,
  onAddFriend: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
};
