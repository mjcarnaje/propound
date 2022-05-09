import {
  Box,
  Button,
  Container,
  Heading,
  Image,
  Stack,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import { Navbar } from "../components/Navbar";

export const LandingPage = () => (
  <Box as="section" height="100vh" overflowY="auto">
    <Navbar />
    <Container py={{ base: "16", md: "24" }}>
      <Stack
        direction={{ base: "column", md: "row" }}
        spacing={{ base: "12", lg: "16" }}
      >
        <Stack spacing={{ base: "8", md: "10" }} width="full" justify="center">
          <Stack spacing={{ base: "4", md: "6" }}>
            <Heading size={useBreakpointValue({ base: "sm", md: "lg" })}>
              Propound
            </Heading>
            <Text fontSize={{ base: "lg", md: "xl" }} color="muted">
              Educational technology is the combined use of computer hardware,
              software, and educational theory and practice to facilitate
              learning.
            </Text>
          </Stack>
          <Stack direction={{ base: "column-reverse", md: "row" }} spacing="3">
            <Button variant="secondary" size="lg">
              Learn more
            </Button>
            <Button size="lg">Sign up</Button>
          </Stack>
        </Stack>
        <Image
          width="full"
          height={{ base: "auto", md: "lg" }}
          objectFit="cover"
          src="https://www.msuiit.edu.ph/assets/img/colleges/ced/industrial-technology.png"
        />
      </Stack>
    </Container>
  </Box>
);
