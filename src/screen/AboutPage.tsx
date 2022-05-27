import { Box, Stack, Text, useDisclosure } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../components/Navbar";

export const AboutPage = () => {
  const navigate = useNavigate();

  return (
    <>
      <Navbar isLanding />
      <Box as="section" bg="gray.50" pt="8" pb="24">
        <Box
          maxW={{ base: "xl", md: "8xl" }}
          px={{ base: "6", md: "8" }}
          mx="auto"
        >
          <Stack
            direction={{ base: "column", lg: "row" }}
            spacing={{ base: "3rem", lg: "2rem" }}
            align={{ lg: "center" }}
            justify="space-between"
          >
            <Text>About proPound</Text>
          </Stack>
        </Box>
      </Box>
    </>
  );
};
