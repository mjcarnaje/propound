import { Box, Button, Container, Input, Text } from "@chakra-ui/react";
import { useFirestoreDocument } from "@react-query-firebase/firestore";
import { doc } from "firebase/firestore";
import React from "react";
import { useParams } from "react-router-dom";
import JoinGame from "../../components/game/JoinGame";
import { Navbar } from "../../components/navbar";
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
      <div>
        <Navbar />
        <Box h="1px" minH="100vh">
          <Container py={4}>
            <Text>Loading...</Text>
          </Container>
        </Box>
      </div>
    );
  }

  if (activity.isError) {
    return (
      <div>
        <Navbar />
        <Box h="1px" minH="100vh">
          <Container py={4}>
            <Text>Error</Text>
          </Container>
        </Box>
      </div>
    );
  }

  const data = activity.data.data();

  const isJoined = data.studentIds.some((id) => id === user.uid);

  return (
    <Box as="section" h="1px" minH="100vh">
      <Navbar />
      <Container py={{ base: "4", md: "8" }} minH="100vh" h="1px">
        {!isJoined ? (
          <JoinGame id={id} studentIds={data.studentIds} code={data.code} />
        ) : (
          <Box>
            <Text>Take the activity!</Text>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default Take;
