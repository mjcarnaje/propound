import { Container, SimpleGrid, Spinner } from "@chakra-ui/react";
import { useFirestoreQuery } from "@react-query-firebase/firestore";
import { collection, limit, query, where } from "firebase/firestore";
import StudentGameCard from "../components/game/StudentGameCard";
import { MainLayout } from "../components/layout/MainLayout";
import { firestore } from "../firebase/config";
import { useAppSelector } from "../hooks/redux";
import { selectAuth } from "../store/reducer/auth";
import { AcitivityDocType } from "../types/game";

const ExploreStudentPage = () => {
  const { user } = useAppSelector(selectAuth);

  const ref = query(
    collection(firestore, "game"),
    limit(16),
    where("status", "==", "PUBLISHED")
  ).withConverter<AcitivityDocType>(null);

  const games = useFirestoreQuery<AcitivityDocType>(["games"], ref);

  if (games.isLoading) {
    return (
      <MainLayout>
        <Spinner />
      </MainLayout>
    );
  }

  if (games.isError) {
    return (
      <MainLayout>
        <h1>Error</h1>
      </MainLayout>
    );
  }

  const snapshot = games.data;

  return (
    <MainLayout>
      <Container py={{ base: "16", md: "24" }}>
        <SimpleGrid gap={{ base: "4", md: "6" }} columns={{ base: 1, md: 3 }}>
          {snapshot.docs.map((docSnapshot) => {
            const gameDoc = docSnapshot.data();
            return (
              <StudentGameCard
                data={gameDoc}
                key={gameDoc.id}
                isJoined={gameDoc.studentIds.some((id) => id === user.uid)}
              />
            );
          })}
        </SimpleGrid>
      </Container>
    </MainLayout>
  );
};

export default ExploreStudentPage;
