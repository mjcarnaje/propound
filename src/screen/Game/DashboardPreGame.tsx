import { Box, Text, VStack } from "@chakra-ui/react";
import React, { useState } from "react";
import SetGameType from "../../components/SetGameType";
import GameShow from "../../components/templates/game-show/GameShow";
import MatchUp from "../../components/templates/match-up/MatchUp";
import MissingWord from "../../components/templates/missing-word/MissingWord";
import { GameTemplate } from "../../types/game";

const DashboardPreGame: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [gameTemplate, setGameTemplate] = useState<GameTemplate>(null);

  const GameTemplates: Record<GameTemplate, JSX.Element> = {
    GAME_SHOW: <GameShow />,
    MATCH_UP: <MatchUp />,
    MISSING_WORD: <MissingWord />,
  };

  return (
    <VStack w="full" py={4}>
      <Box textAlign="center">
        <Text fontWeight="bold" fontSize={24}>
          Pre-Game
        </Text>
        <SetGameType setGameTemplate={setGameTemplate} />
      </Box>
      {gameTemplate && GameTemplates[gameTemplate]}
    </VStack>
  );
};

export default DashboardPreGame;
