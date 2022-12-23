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
  return (
    <Flex
      as="section"
      direction={{ base: "column", lg: "row" }}
      minH="100vh"
      bg="gray.100"
      overflowY="auto"
    >
      {user && <>{isDesktop ? <Sidebar /> : <Navbar />}</>}
      <Box overflowY="scroll" bg="gray.50" flex={1}>
        {unAuthenticated && <NotAuthNavbar />}
        {children}
      </Box>
    </Flex>
  );
};
