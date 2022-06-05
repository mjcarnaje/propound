import {
  Box,
  Button,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { FaLightbulb } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
// @ts-expect-error
import LandingPageSvg from "../assets/svgs/landing_page.svg?component";
import { Logo } from "../components/Logo";
import { Navbar } from "../components/navbar";

export const LandingPage = () => {
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Modal isCentered isOpen={isOpen} onClose={onClose}>
        <ModalOverlay
          style={{
            background:
              "url(https://www.ice.org.uk/media/osmpo3wv/how-does-civil-engineering-exploit-technology-to-eliminate-error.jpg) center/cover no-repeat",
          }}
          filter="auto"
          blur="20px"
          opacity="0.5"
        />
        <ModalContent>
          <ModalHeader></ModalHeader>
          <ModalCloseButton />
          <ModalBody py={8}>
            <VStack>
              <Box pb={8}>
                <Logo boxSize={28} />
              </Box>
              <Button
                onClick={() => navigate("/t/login")}
                colorScheme="orange"
                size="lg"
                w="full"
              >
                Teacher
              </Button>
              <Button
                onClick={() => navigate("/s/login")}
                colorScheme="orange"
                size="lg"
                w="full"
              >
                Student
              </Button>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>

      <Navbar isLanding />

      <Box as="section">
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
            <Box w={{ base: "full", md: "50%" }} flex="1">
              <Heading
                as="h1"
                size="3xl"
                color="orange.500"
                mt="8"
                fontWeight="extrabold"
                letterSpacing="tight"
              >
                Welcome to proPound
              </Heading>
              <Text
                color="gray.500"
                mt="4"
                fontSize="xl"
                fontStyle="italic"
                fontWeight="medium"
              >
                A fun learning medium for Civil Technology
              </Text>

              <Stack
                direction={{ base: "column", md: "row" }}
                spacing="4"
                mt="8"
              >
                <Button
                  size="lg"
                  minW="210px"
                  colorScheme="orange"
                  height="14"
                  px="8"
                  onClick={onOpen}
                >
                  Login
                </Button>
                <Button
                  size="lg"
                  onClick={() => navigate("/about")}
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
            <Box w={{ base: "full", md: "50%" }} pos="relative">
              <LandingPageSvg style={{ width: "100%" }} />
            </Box>
          </Stack>
        </Box>
      </Box>
    </>
  );
};
