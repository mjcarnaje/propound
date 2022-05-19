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
import { FaLightbulb } from "react-icons/fa";

export const LandingPage = () => (
  <>
    <Navbar />
    <Box as="section" bg="gray.50" pt="16" pb="24">
      <Box
        maxW={{ base: "xl", md: "7xl" }}
        mx="auto"
        px={{ base: "6", md: "8" }}
      >
        <Stack
          direction={{ base: "column", lg: "row" }}
          spacing={{ base: "3rem", lg: "2rem" }}
          mt="8"
          align={{ lg: "center" }}
          justify="space-between"
        >
          <Box flex="1" maxW={{ lg: "520px" }}>
            <Text
              size="xs"
              textTransform="uppercase"
              fontWeight="semibold"
              color="orange.500"
              letterSpacing="wide"
            >
              Propound
            </Text>
            <Heading
              as="h1"
              size="3xl"
              color="orange.500"
              mt="8"
              fontWeight="extrabold"
              letterSpacing="tight"
            >
              Get world class talents for your project
            </Heading>
            <Text color="gray.500" mt="4" fontSize="lg" fontWeight="medium">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </Text>
            <Stack direction={{ base: "column", md: "row" }} spacing="4" mt="8">
              <Button
                size="lg"
                minW="210px"
                colorScheme="orange"
                height="14"
                px="8"
              >
                Get Started
              </Button>
              <Button
                size="lg"
                bg="white"
                color="gray.900"
                _hover={{ bg: "gray.50" }}
                height="14"
                px="8"
                shadow="base"
                leftIcon={<Box as={FaLightbulb} fontSize="xl" />}
              >
                Learn more
              </Button>
            </Stack>
          </Box>
          <Box
            pos="relative"
            w={{ base: "full", lg: "560px" }}
            h={{ base: "auto", lg: "560px" }}
          >
            <Image
              w="full"
              pos="relative"
              zIndex="1"
              h={{ lg: "100%" }}
              objectFit="cover"
              src="https://www.ice.org.uk/media/osmpo3wv/how-does-civil-engineering-exploit-technology-to-eliminate-error.jpg"
              alt="Screening talent"
            />
            <Box
              pos="absolute"
              w="100%"
              h="100%"
              top="-4"
              left="-4"
              bg="gray.200"
            />
          </Box>
        </Stack>
      </Box>
    </Box>
  </>
);
