import { Box, Container, SimpleGrid, Spinner } from "@chakra-ui/react";
import { useFirestoreQuery } from "@react-query-firebase/firestore";
import { collection, limit, query, where } from "firebase/firestore";
import StudentGameCard from "../components/game/StudentGameCard";
import { Navbar } from "../components/navbar";
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
      <div>
        <Navbar />
        <Spinner />
      </div>
    );
  }

  if (games.isError) {
    return (
      <div>
        <Navbar />
        <h1>Error</h1>
      </div>
    );
  }

  const snapshot = games.data;

  return (
    <div>
      <Navbar />
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
    </div>
  );
};

export default ExploreStudentPage;
