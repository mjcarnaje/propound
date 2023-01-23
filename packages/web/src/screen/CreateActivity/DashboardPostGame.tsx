import { ArrowBackIcon } from "@chakra-ui/icons";
import {
  Box,
  Center,
  HStack,
  IconButton,
  Spinner,
  VStack,
} from "@chakra-ui/react";
import {
  ActivityCollectionNames,
  CollectionNames,
  GameDocTemplate,
  GameStatus,
  GameTemplate,
  GameType,
} from "@propound/types";
import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
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

const DashboardPostGame: React.FC = () => {
  const { id } = useParams() as { id: string };
  const [gameTemplate, setGameTemplate] = useState<GameTemplate | null>(null);
  const [activityData, setActivityData] = useState<GameDocTemplate | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [status, setStatus] = useState<GameStatus>("DRAFT");

  const getActivityData = async () => {
    const activityRef = doc(firestore, CollectionNames.ACTIVITIES, id);
    const activitySnap = await getDoc(activityRef);
    if (activitySnap.exists()) {
      setStatus(activitySnap.data()?.status as GameStatus);
    }

    const postGameRef = doc(
      firestore,
      CollectionNames.ACTIVITIES,
      id,
      ActivityCollectionNames.GAMES,
      GameType.POST_TEST
    );
    setIsLoading(true);
    const docSnap = await getDoc(postGameRef);

    if (docSnap.exists()) {
      setActivityData(docSnap.data() as GameDocTemplate);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    getActivityData();
  }, []);
  const GameTemplates: Record<GameTemplate, JSX.Element> = {
    GAME_SHOW: (
      <GameShow
        activityId={id!}
        type={GameType.POST_TEST}
        refetch={getActivityData}
      />
    ),
    MATCH_UP: (
      <MatchUp
        activityId={id!}
        type={GameType.POST_TEST}
        refetch={getActivityData}
      />
    ),
    MISSING_WORD: (
      <MissingWord
        activityId={id!}
        type={GameType.POST_TEST}
        refetch={getActivityData}
      />
    ),
  };

  if (isLoading) {
    return (
      <Center w="full" py={12}>
        <Spinner />
      </Center>
    );
  }

  return (
    <VStack w="full" spacing={4}>
      {!activityData && gameTemplate && (
        <HStack py={2} justify="flex-start" w="full">
          <IconButton
            onClick={() => setGameTemplate(null)}
            icon={<ArrowBackIcon />}
            aria-label="arrow-back"
          />
        </HStack>
      )}
      {!activityData && !gameTemplate && (
        <Box textAlign="center">
          <SetGameType
            setGameTemplate={setGameTemplate}
            id={id!}
            refetch={getActivityData}
          />
        </Box>
      )}
      {activityData && isGameShowTemplate(activityData) && (
        <GameShow
          activityId={id!}
          gameData={activityData}
          type={GameType.POST_TEST}
          refetch={getActivityData}
          isPublished={status === "PUBLISHED"}
        />
      )}
      {activityData && isMissingWordTemplate(activityData) && (
        <MissingWord
          activityId={id!}
          gameData={activityData}
          type={GameType.POST_TEST}
          refetch={getActivityData}
          isPublished={status === "PUBLISHED"}
        />
      )}
      {activityData && isMatchUpTemplate(activityData) && (
        <MatchUp
          activityId={id!}
          gameData={activityData}
          type={GameType.POST_TEST}
          refetch={getActivityData}
          isPublished={status === "PUBLISHED"}
        />
      )}
      {!activityData && gameTemplate && GameTemplates[gameTemplate]}
    </VStack>
  );
};

export default DashboardPostGame;
