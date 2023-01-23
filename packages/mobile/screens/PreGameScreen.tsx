import {
  ActivityCollectionNames,
  CollectionNames,
  GameDocTemplate,
  GameType,
} from "@propound/types";
import {
  isGameShowTemplate,
  isMatchUpTemplate,
  isMissingWordTemplate,
} from "@propound/utils";
import { StackScreenProps } from "@react-navigation/stack";
import { doc, DocumentReference, getDoc } from "firebase/firestore";
import { Center, Spinner, Text, useToast } from "native-base";
import React, { useEffect, useState } from "react";
import BaseScreen from "../components/BaseScreen";
import GameShowQuiz from "../components/games/game-show/GameShowGame";
import MatchUpGame from "../components/games/match-up/MatchUpGame";
import MissingWordGame from "../components/games/missing-word/MissingWordGame";
import { firestore } from "../configs/firebase";
import { RootStackParamList } from "../navigation";
import Toast from "react-native-toast-message";
import { useAuthStore } from "../store/auth";

const PreGameScreen: React.FC<
  StackScreenProps<RootStackParamList, "PreGame">
> = ({ route, navigation }) => {
  const { user } = useAuthStore();
  const [activity, setActivity] = useState<GameDocTemplate | null>(null);
  const [loading, setLoading] = useState(true);

  async function getActivity() {
    try {
      const docRef = doc(
        firestore,
        CollectionNames.ACTIVITIES,
        route.params.id,
        ActivityCollectionNames.GAMES,
        GameType.PRE_TEST
      ) as DocumentReference<GameDocTemplate>;
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        navigation.setOptions({ title: data.title });
        setActivity(data);
      } else {
        Toast.show({
          type: "error",
          text1: "Activity not found",
          text2: "The activity you are looking for does not exist",
        });
      }
    } catch (err) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "There was an error fetching the activity",
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getActivity();
  }, []);

  if (loading) {
    return (
      <BaseScreen>
        <Center flexGrow={1}>
          <Spinner size="lg" colorScheme="orange" />
        </Center>
      </BaseScreen>
    );
  }

  if (!activity) {
    return (
      <BaseScreen>
        <Center flexGrow={1}>
          <Text>Pre Game Not Found</Text>
        </Center>
      </BaseScreen>
    );
  }

  return (
    <BaseScreen isScrollable>
      {isMatchUpTemplate(activity) && (
        <MatchUpGame
          data={activity}
          activityId={route.params.id}
          gameType={GameType.PRE_TEST}
          userId={user.uid}
        />
      )}
      {isMissingWordTemplate(activity) && (
        <MissingWordGame
          data={activity}
          activityId={route.params.id}
          gameType={GameType.PRE_TEST}
          userId={user.uid}
        />
      )}
      {isGameShowTemplate(activity) && (
        <GameShowQuiz
          data={activity}
          activityId={route.params.id}
          gameType={GameType.PRE_TEST}
          userId={user.uid}
        />
      )}
    </BaseScreen>
  );
};

export default PreGameScreen;
