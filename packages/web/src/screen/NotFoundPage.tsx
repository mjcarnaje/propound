import { Box, Heading, Text, Button, Center } from "@chakra-ui/react";
import { NavLink } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <Center minHeight="100vh">
      <Box textAlign="center" py={10} px={6}>
        <Heading
          fontFamily="Inter"
          size="4xl"
          bgGradient="linear(to-r, orange.400, orange.600)"
          backgroundClip="text"
        >
          404
        </Heading>
        <Text fontSize="18px" mt={3} mb={2}>
          Page Not Found
        </Text>
        <Text color={"gray.500"} mb={6}>
          The page you're looking for does not seem to exist
        </Text>

        <Button colorScheme="orange" as={NavLink} to="/" size="lg">
          Go to Home
        </Button>
      </Box>
    </Center>
  );
}
