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
import LandingPageSvg from "../assets/svgs/landing_page_1.svg?component";
import { MainLayout } from "../components/layout/MainLayout";
import { Logo } from "../components/Logo";

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

      <MainLayout>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minH="calc(100vh - 86px)"
          as="section"
        >
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
              <Box w={{ base: "full", md: "40%" }} flex="1">
                <Heading
                  as="h1"
                  size="4xl"
                  color="orange.500"
                  mt="8"
                  fontWeight="extrabold"
                  letterSpacing="tight"
                >
                  Welcome to proPound
                </Heading>
                <Text
                  color="gray.600"
                  mt="4"
                  fontSize="xl"
                  fontStyle="italic"
                  fontWeight="medium"
                >
                  A fun learning medium for Civil Technology
                </Text>
              </Box>
              <Box
                display="flex"
                w={{ base: "full", md: "60%" }}
                justifyContent="center"
                pos="relative"
              >
                <LandingPageSvg style={{ width: "90%" }} />
              </Box>
            </Stack>
          </Box>
        </Box>
      </MainLayout>
    </>
  );
};
