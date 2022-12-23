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
import {
  isGameShowTemplate,
  isMatchUpTemplate,
  isMissingWordTemplate,
} from "../../utils/template";

const DashboardPreGame: React.FC = () => {
  const { id } = useParams();
  const [gameTemplate, setGameTemplate] = useState<GameTemplate | null>(null);

  // @ts-ignore
  const ref: any = doc(firestore, "activity", id, "games", "PRE_TEST");

  const gamePreTest = useFirestoreDocument<GameDocTemplate>(
    ["activity", id, "games", "PRE_TEST"],
    ref
  );

  const GameTemplates: Record<GameTemplate, JSX.Element> = {
    GAME_SHOW: <GameShow activityId={id!} type="PRE_TEST" />,
    MATCH_UP: <MatchUp activityId={id!} type="PRE_TEST" />,
    MISSING_WORD: <MissingWord activityId={id!} type="PRE_TEST" />,
  };

  if (gamePreTest.isLoading) {
    return (
      <Center w="full" py={12}>
        <Spinner />
      </Center>
    );
  }

  if (gamePreTest.isError) {
    return (
      <Center w="full" py={12}>
        <Text>Error</Text>
      </Center>
    );
  }

  const data = gamePreTest.data;

  const gameData = data?.data();

  return (
    <VStack w="full" py={4}>
      {!gameData && !gameTemplate && (
        <Box textAlign="center">
          <SetGameType setGameTemplate={setGameTemplate} />
        </Box>
      )}
      {gameData && isGameShowTemplate(gameData) && (
        <GameShow activityId={id!} gameData={gameData} type="PRE_TEST" />
      )}
      {gameData && isMissingWordTemplate(gameData) && (
        <MissingWord activityId={id!} gameData={gameData} type="PRE_TEST" />
      )}
      {gameData && isMatchUpTemplate(gameData) && (
        <MatchUp activityId={id!} gameData={gameData} type="PRE_TEST" />
      )}
      {!gameData && gameTemplate && GameTemplates[gameTemplate]}
    </VStack>
  );
};

export default DashboardPreGame;
