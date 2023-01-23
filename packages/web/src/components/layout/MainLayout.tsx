import { Box, Flex, useBreakpointValue } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../hooks/redux";
import { selectAuth } from "../../store/reducer/auth";
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
  return (
    <Flex as="section" minH="100vh" direction={{ base: "column", lg: "row" }}>
      {user && <>{isDesktop ? <Sidebar /> : <Navbar />}</>}
      <Box overflowY="scroll" maxH="100vh" bg="gray.50" flex={1}>
        {unAuthenticated && <NotAuthNavbar />}
        {children}
      </Box>
    </Flex>
  );
};
