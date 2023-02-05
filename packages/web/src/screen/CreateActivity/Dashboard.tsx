import { Box, Center, Container, HStack, Stack, Text } from "@chakra-ui/react";
import React from "react";
import {
  Navigate,
  Outlet,
  useMatch,
  useNavigate,
  useParams,
} from "react-router-dom";
import { MainLayout } from "../../components/layout/MainLayout";
import { useAppSelector } from "../../hooks/redux";
import { selectAuth } from "../../store/reducer/auth";

interface DashboardProps {}

const Dashboard: React.FC<DashboardProps> = () => {
  const { user } = useAppSelector(selectAuth);
  const { id } = useParams();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <MainLayout>
      <Container py={{ base: "4", md: "8" }} minH="100vh" h="1px">
        <Stack w="full" flexDir="column" spacing={{ base: "4", lg: "6" }}>
          <DashboardNavigation id={id!} />
          <Box flexGrow={1} p={8} borderRadius="lg" shadow="sm" bg="white">
            <Outlet />
          </Box>
        </Stack>
      </Container>
    </MainLayout>
  );
};

export default Dashboard;

const DashboardNavigation: React.FC<{ id: string }> = ({ id }) => {
  const navigate = useNavigate();
  const hideNavigation = useMatch("/g/:id/results");

  const links = [
    {
      label: "Settings",
      to: `/g/${id}/settings`,
      show: !hideNavigation,
    },
    {
      label: "Pre-quiz",
      to: `/g/${id}/pre-quiz`,
      show: !hideNavigation,
    },
    {
      label: "Learn",
      to: `/g/${id}/learn`,
      show: !hideNavigation,
    },
    {
      label: "Post-quiz",
      to: `/g/${id}/post-quiz`,
      show: !hideNavigation,
    },
    {
      label: "Learners and their Statistics",
      to: `/g/${id}/results`,
      show: hideNavigation,
    },
  ];
  return (
    <HStack w="full" bg="white" p={4} borderRadius="lg" shadow="sm">
      {links
        .filter((link) => link.show)
        .map((link) => {
          const isActive = useMatch(link.to);
          return (
            <Center
              flex={1}
              cursor="pointer"
              as="a"
              py={2.5}
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
            </Center>
          );
        })}
    </HStack>
  );
};
