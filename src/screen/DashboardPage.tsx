import { Box, Container } from "@chakra-ui/react";
import Classes from "../components/Class/TeacherClasses";
import { Navbar } from "../components/Navbar";
import { useAppSelector } from "../hooks/redux";
import { selectAuth } from "../store/reducer/auth";

export const DashboardPage = () => {
  const { user } = useAppSelector(selectAuth);

  return (
    <Box as="section" height="100vh" overflowY="auto">
      <Navbar />
      <Container py={{ base: "16", md: "24" }}>
        {user && user.role === "TEACHER" && <Classes user={user} />}
      </Container>
    </Box>
  );
};
