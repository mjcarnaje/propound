import { Box, Center, Spinner, Text, VStack } from "@chakra-ui/react";
import {
  ActivityCollectionNames,
  CollectionNames,
  GameDocTemplate,
  GameTemplate,
  GameType,
} from "@propound/types";
import { useFirestoreDocument } from "@react-query-firebase/firestore";
import { doc } from "firebase/firestore";
import React, { useState } from "react";
import { QueryKey } from "react-query";
import { useParams } from "react-router-dom";
import SetGameType from "../../components/SetGameType";
import GameShow from "../../components/templates/game-show/GameShow";
import MatchUp from "../../components/templates/match-up/MatchUp";
import MissingWord from "../../components/templates/missing-word/MissingWord";
import { firestore } from "../../firebase/config";
import {
  isGameShowTemplate,
  isMatchUpTemplate,
  isMissingWordTemplate,
} from "../../utils/template";

const DashboardPreGame: React.FC = () => {
  const { id } = useParams();
  const [gameTemplate, setGameTemplate] = useState<GameTemplate | null>(null);

  const queryKey: QueryKey = [
    CollectionNames.ACTIVITIES,
    id,
    ActivityCollectionNames.GAMES,
    GameType.PRE_TEST,
  ];

  // @ts-ignore
  const ref: any = doc(firestore, ...queryKey);

  const gamePreTest = useFirestoreDocument<GameDocTemplate>(queryKey, ref);

  const GameTemplates: Record<GameTemplate, JSX.Element> = {
    GAME_SHOW: <GameShow activityId={id!} type={GameType.PRE_TEST} />,
    MATCH_UP: <MatchUp activityId={id!} type={GameType.PRE_TEST} />,
    MISSING_WORD: <MissingWord activityId={id!} type={GameType.PRE_TEST} />,
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
        <GameShow
          activityId={id!}
          gameData={gameData}
          type={GameType.PRE_TEST}
        />
      )}
      {gameData && isMissingWordTemplate(gameData) && (
        <MissingWord
          activityId={id!}
          gameData={gameData}
          type={GameType.PRE_TEST}
        />
      )}
      {gameData && isMatchUpTemplate(gameData) && (
        <MatchUp
          activityId={id!}
          gameData={gameData}
          type={GameType.PRE_TEST}
        />
      )}
      {!gameData && gameTemplate && GameTemplates[gameTemplate]}
    </VStack>
  );
};

export default DashboardPreGame;
