import { Link } from "react-router-dom";
import { Box, Heading, Text, Button, VStack } from "@chakra-ui/react";
import useAuthContext from "../hooks/useAuthContext";
import Footer from "../components/Footer";

export default function NotFound() {
  const { isAuthenticated } = useAuthContext();

  return (
    <Box className="flex flex-col min-h-screen">
      <VStack spacing={8} flex="1" justifyContent="center" alignItems="center" px={4}>
        <Heading as="h1" size="2xl">
          404 - Page Not Found
        </Heading>
        <Text fontSize="xl" textAlign="center">
          Oops! The page {"you're"} looking for {"doesn't"} exist.
        </Text>
        <Button
          as={Link}
          to="/"
          colorScheme="blue"
          size="lg"
          className="app-primary-btn"
        >
          Go Back to Home
        </Button>
      </VStack>
      {isAuthenticated && <Footer />}
    </Box>
  );
}
