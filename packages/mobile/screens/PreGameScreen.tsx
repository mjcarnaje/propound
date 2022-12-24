import { GameDocTemplate } from "@propound/types";
import { StackScreenProps } from "@react-navigation/stack";
import { doc, getDoc } from "firebase/firestore";
import { Center, Spinner, Text, useToast } from "native-base";
import React, { useEffect, useState } from "react";
import BaseScreen from "../components/BaseScreen";
import GameShowQuiz from "../components/games/game-show/GameShowGame";
import MatchUpGame from "../components/games/match-up/MatchUpGame";
import { firestore } from "../configs/firebase";
import { RootStackParamList } from "../navigation";
import { isGameShowTemplate, isMatchUpTemplate } from "../utils/template";

const PreGameScreen: React.FC<
  StackScreenProps<RootStackParamList, "PreGame">
> = ({ route, navigation }) => {
  const toast = useToast();
  const [activity, setActivity] = useState<GameDocTemplate | null>(null);
  const [loading, setLoading] = useState(true);

  async function getActivity() {
    try {
      const docRef = doc(
        firestore,
        "activity",
        route.params.id,
        "games",
        "PRE_TEST"
      );
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data() as GameDocTemplate;
        navigation.setOptions({ title: data.title });
        setActivity(data);
      } else {
        toast.show({
          title: "Activity not found",
          description: "The activity you are looking for does not exist",
        });
      }
    } catch (err) {
      toast.show({
        title: "Error",
        description: "There was an error fetching the activity",
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
    <BaseScreen>
      {isMatchUpTemplate(activity) && <MatchUpGame data={activity} />}
      {isGameShowTemplate(activity) && (
        <GameShowQuiz activityId={route.params.id} type="PRE" data={activity} />
      )}
    </BaseScreen>
  );
};

export default PreGameScreen;
