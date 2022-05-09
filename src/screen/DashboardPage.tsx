import { Box, Container } from "@chakra-ui/react";
import { Navbar } from "../components/Navbar";

export const DashboardPage = () => {
  return (
    <Box as="section" height="100vh" overflowY="auto">
      <Navbar />
      <Container py={{ base: "16", md: "24" }}></Container>
    </Box>
  );
};
