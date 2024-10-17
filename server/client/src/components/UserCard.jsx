import { Box, Text, Button, Flex, Badge, IconButton } from "@chakra-ui/react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { FiMessageSquare } from "react-icons/fi";

export default function UserCard({ user, onAddFriend, isLoading = false, navigateTo, showChatButton = false }) {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(navigateTo || `/app/profile/${user._id}`);
  };

  const handleChatClick = (e) => {
    e.stopPropagation();
    navigate(`/app/chat/${user._id}`);
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
            <>
              <Badge
                colorScheme="green"
                fontSize="sm"
                px={2}
                py={1}
                borderRadius="full"
              >
                Friends
              </Badge>
              {showChatButton && (
                <IconButton
                  icon={<FiMessageSquare />}
                  aria-label="Chat"
                  onClick={handleChatClick}
                  ml={2}
                  colorScheme="blue"
                />
              )}
            </>
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
  navigateTo: PropTypes.string,
  showChatButton: PropTypes.bool,
};
