import { Box, Container, Spinner, Text } from "@chakra-ui/react";
import { useFirestoreDocument } from "@react-query-firebase/firestore";
import { doc } from "firebase/firestore";
import React from "react";
import { useParams } from "react-router-dom";
import JoinGame from "../../components/game/JoinGame";
import { MainLayout } from "../../components/layout/MainLayout";
import { firestore } from "../../firebase/config";
import { useAppSelector } from "../../hooks/redux";
import { selectAuth } from "../../store/reducer/auth";
import { AcitivityDocType } from "../../types/game";

interface TakeProps {}

const Take: React.FC<TakeProps> = () => {
  const { user } = useAppSelector(selectAuth);
  const { id } = useParams();

  const ref = doc(firestore, "game", id).withConverter<AcitivityDocType>(null);
  const activity = useFirestoreDocument(["game", id], ref);

  if (activity.isLoading) {
    return (
      <MainLayout>
        <Spinner />
      </MainLayout>
    );
  }

  if (activity.isError) {
    return (
      <MainLayout>
        <h1>Error</h1>
      </MainLayout>
    );
  }

  const data = activity.data.data();

  const isJoined = data.studentIds.some((id) => id === user.uid);

  return (
    <MainLayout>
      <Container py={{ base: "4", md: "8" }} minH="100vh" h="1px">
        {!isJoined ? (
          <JoinGame id={id} studentIds={data.studentIds} code={data.code} />
        ) : (
          <Box>
            <Text>Take the activity!</Text>
          </Box>
        )}
      </Container>
    </MainLayout>
  );
};

export default Take;
