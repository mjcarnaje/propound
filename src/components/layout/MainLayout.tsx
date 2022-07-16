import {
  Box,
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useBreakpointValue,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../hooks/redux";
import { selectAuth } from "../../store/reducer/auth";
import { Logo } from "../Logo";
import { Navbar } from "./Navbar";
import NotAuthNavbar from "./NotAuthNavbar";
import { Sidebar } from "./SideBar";

interface MainLayoutProps {
  children: React.ReactNode;
  unAuthenticated?: boolean;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  unAuthenticated,
}) => {
  const { user } = useAppSelector(selectAuth);
  const isDesktop = useBreakpointValue({ base: false, lg: true });
  const navigate = useNavigate();
  const { isOpen, onClose, onOpen } = useDisclosure();
  return (
    <Flex
      as="section"
      direction={{ base: "column", lg: "row" }}
      minH="100vh"
      bg="gray.100"
      overflowY="auto"
    >
      {user && <>{isDesktop ? <Sidebar /> : <Navbar />}</>}
      <Box bg="gray.50" flex={1}>
        {unAuthenticated && (
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
            <NotAuthNavbar onOpen={onOpen} />
          </>
        )}
        {children}
      </Box>
    </Flex>
  );
};
