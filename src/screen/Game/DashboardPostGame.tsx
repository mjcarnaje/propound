import { Box, Center, Spinner, Text, VStack } from "@chakra-ui/react";
import { useFirestoreDocument } from "@react-query-firebase/firestore";
import { doc } from "firebase/firestore";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import SetGameType from "../../components/SetGameType";
import GameShow from "../../components/templates/game-show/GameShow";
import MatchUp from "../../components/templates/match-up/MatchUp";
import MissingWord from "../../components/templates/missing-word/MissingWord";
import { firestore } from "../../firebase/config";
import { GameDocTemplate, GameTemplate } from "../../types/game";
import { isGameShowTemplate } from "../../utils/template";

const DashboardPostGame: React.FC = () => {
  const { id } = useParams();
  const [gameTemplate, setGameTemplate] = useState<GameTemplate>(null);

  const ref = doc(
    firestore,
    "game",
    id,
    "games",
    "POST_TEST"
  ).withConverter<GameDocTemplate>(null);

  const preTest = useFirestoreDocument<GameDocTemplate>(
    ["game", id, "games", "POST_TEST"],
    ref
  );

  const GameTemplates: Record<GameTemplate, JSX.Element> = {
    GAME_SHOW: <GameShow activityId={id} type="POST_TEST" />,
    MATCH_UP: <MatchUp />,
    MISSING_WORD: <MissingWord />,
  };

  if (preTest.isLoading) {
    return (
      <Center w="full" py={12}>
        <Spinner />
      </Center>
    );
  }

  if (preTest.isError) {
    return (
      <Center w="full" py={12}>
        <Text>Error</Text>
      </Center>
    );
  }

  const data = preTest.data;

  return (
    <VStack w="full" py={4}>
      {!data.exists() && !gameTemplate && (
        <Box textAlign="center">
          <SetGameType setGameTemplate={setGameTemplate} />
        </Box>
      )}
      {data.exists() && isGameShowTemplate(data.data()) && (
        <GameShow activityId={id} gameShowData={data.data()} type="POST_TEST" />
      )}
      {!data.exists() && gameTemplate && GameTemplates[gameTemplate]}
    </VStack>
  );
};

export default DashboardPostGame;
