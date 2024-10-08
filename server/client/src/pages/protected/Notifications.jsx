import { useEffect } from "react";
import { format } from "date-fns";
import { useNotifications } from "../../hooks/useNotifications";
import Loading from "../../components/Loading";
import { Button, Box, Text, VStack, HStack, Heading } from "@chakra-ui/react";

export default function Notifications() {
  const { notifications, loading, error, fetchNotifications, markAsRead, deleteNotification } = useNotifications();

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  if (loading) return <Loading />;
  if (error) return <Box textAlign="center" color="red.500">{error}</Box>;

  return (
    <Box mt={4}>
      <Heading as="h1" size="xl" mb={3}>Notifications</Heading>
      {notifications.length === 0 ? (
        <Text textAlign="center" color="gray.500">No notifications</Text>
      ) : (
        <VStack spacing={4}>
          {notifications.map((notification) => (
            <Box
              key={notification._id}
              p={4}
              borderRadius="lg"
              boxShadow="md"
              bg={notification.isRead ? "gray.100" : "white"}
              width="100%"
            >
              <Heading as="h2" size="md">{notification.title}</Heading>
              <Text color="gray.600" mt={2}>{notification.content}</Text>
              <HStack justifyContent="space-between" mt={2}>
                <Text fontSize="sm" color="gray.500">
                  {format(new Date(notification.createdAt), "PPpp")}
                </Text>
                <HStack>
                  {!notification.isRead && (
                    <Button
                      size="sm"
                      colorScheme="blue"
                      onClick={() => markAsRead(notification._id)}
                    >
                      Mark as read
                    </Button>
                  )}
                  <Button
                    size="sm"
                    colorScheme="red"
                    onClick={() => deleteNotification(notification._id)}
                  >
                    Delete
                  </Button>
                </HStack>
              </HStack>
            </Box>
          ))}
        </VStack>
      )}
    </Box>
  );
}