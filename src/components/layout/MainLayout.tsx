import { Box, Flex, useBreakpointValue } from "@chakra-ui/react";
import { useMatch } from "react-router-dom";
import { Navbar } from "./Navbar";
import { Sidebar } from "./SideBar";

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const isDesktop = useBreakpointValue({ base: false, lg: true });
  return (
    <Flex
      as="section"
      direction={{ base: "column", lg: "row" }}
      height="100vh"
      bg="gray.100"
      overflowY="auto"
    >
      {isDesktop ? <Sidebar /> : <Navbar />}
      <Box bg="gray.50" pt={{ base: "0", lg: "3" }} flex="1">
        {children}
      </Box>
    </Flex>
  );
};
