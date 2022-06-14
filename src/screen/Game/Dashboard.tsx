import { Box, Container, Stack, Text } from "@chakra-ui/react";
import React from "react";
import {
  Navigate,
  Outlet,
  useMatch,
  useNavigate,
  useParams,
} from "react-router-dom";
import { Navbar } from "../../components/navbar";
import { useAppSelector } from "../../hooks/redux";
import { selectAuth } from "../../store/reducer/auth";

interface DashboardProps {}

const Dashboard: React.FC<DashboardProps> = () => {
  const { user } = useAppSelector(selectAuth);
  const { id } = useParams();
  const navigate = useNavigate();

  if (!user || user.role !== "TEACHER") {
    return <Navigate to="/s/login" replace />;
  }

  const links = [
    {
      label: "Settings",
      to: `/g/${id}/settings`,
    },
    {
      label: "Pre-game",
      to: `/g/${id}/pre-game`,
    },
    {
      label: "Learn",
      to: `/g/${id}/learn`,
    },
    {
      label: "Post-game",
      to: `/g/${id}/post-game`,
    },
    {
      label: "Students",
      to: `/g/${id}/students`,
    },
  ];

  return (
    <Box as="section" h="1px" minH="100vh">
      <Navbar />
      <Container py={{ base: "4", md: "8" }} minH="calc(100vh - 86px)" h="1px">
        <Stack
          w="full"
          direction={{ base: "column", lg: "row" }}
          spacing={{ base: "4", lg: "6" }}
        >
          <Box minW="250px" flexShrink={0}>
            <Stack bg="white" p={4} borderRadius="lg" shadow="sm">
              {links.map((link) => {
                const isActive = useMatch(link.to);
                return (
                  <Box
                    cursor="pointer"
                    as="a"
                    py={2.5}
                    px={4}
                    borderRadius="md"
                    bg={isActive ? "gray.50" : "transparent"}
                    onClick={() => navigate(link.to)}
                  >
                    <Text
                      fontWeight={isActive ? "semibold" : "medium"}
                      color={isActive ? "orange.500" : "gray.700"}
                    >
                      {link.label}
                    </Text>
                  </Box>
                );
              })}
            </Stack>
          </Box>
          <Box flexGrow={1} p={8} borderRadius="lg" shadow="sm" bg="white">
            <Outlet />
          </Box>
        </Stack>
      </Container>
    </Box>
  );
};

export default Dashboard;
