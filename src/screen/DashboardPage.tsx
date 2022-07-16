import { Container } from "@chakra-ui/react";
import Classes from "../components/game/TeacherGames";
import { MainLayout } from "../components/layout/MainLayout";
import { useAppSelector } from "../hooks/redux";
import { selectAuth } from "../store/reducer/auth";

export const DashboardPage = () => {
  const { user } = useAppSelector(selectAuth);

  return (
    <MainLayout>
      <Container py={{ base: "16", md: "24" }}>
        {user && user.role === "TEACHER" && <Classes user={user} />}
      </Container>
    </MainLayout>
  );
};
