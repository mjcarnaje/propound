import { Box, Spinner, Text, VStack } from "@chakra-ui/react";
import { useFirestoreDocument } from "@react-query-firebase/firestore";
import { doc } from "firebase/firestore";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import SetGameType from "../../components/SetGameType";
import GameShow from "../../components/templates/game-show/GameShow";
import { firestore } from "../../firebase/config";
import { GameDocTemplate, GameTemplate } from "../../types/game";
import { isGameShowTemplate } from "../../utils/template";

const DashboardPreGame: React.FC = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [gameTemplate, setGameTemplate] = useState<GameTemplate>(null);

  const ref = doc(
    firestore,
    "game",
    id,
    "games",
    "PRE_TEST"
  ).withConverter<GameDocTemplate>(null);

  const preTest = useFirestoreDocument<GameDocTemplate>(
    ["game", id, "games", "PRE_TEST"],
    ref
  );

  if (preTest.isLoading) {
    return (
      <Box py={8}>
        <Spinner />
      </Box>
    );
  }

  if (preTest.isError) {
    return (
      <Box py={8}>
        <Text>Error</Text>
      </Box>
    );
  }

  const data = preTest.data;

  return (
    <VStack w="full" py={4}>
      {!data.exists() && (
        <Box textAlign="center">
          <SetGameType setGameTemplate={setGameTemplate} />
        </Box>
      )}
      {data.exists() && isGameShowTemplate(data.data()) && (
        <GameShow activityId={id} gameShowData={data.data()} />
      )}
    </VStack>
  );
};

export default DashboardPreGame;
