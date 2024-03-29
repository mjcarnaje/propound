import {
  ActivityCollectionNames,
  ActivityDocType,
  ActivityStudentResultDocType,
  CollectionNames,
} from "@propound/types";
import { useFocusEffect } from "@react-navigation/native";
import { StackScreenProps } from "@react-navigation/stack";
import { doc, DocumentReference, getDoc } from "firebase/firestore";
import {
  AspectRatio,
  Box,
  Center,
  HStack,
  Spinner,
  Text,
  useToast,
  VStack,
} from "native-base";
import React, { useCallback, useState } from "react";
import { TouchableOpacity } from "react-native";
import BaseScreen from "../components/BaseScreen";
import SvgLearningMaterials from "../components/svgs/LearningMaterials";
import SvgPostGame from "../components/svgs/PostGame";
import SvgPreGame from "../components/svgs/PreGame";
import { firestore } from "../configs/firebase";
import { RootStackParamList } from "../navigation";
import { useAuthStore } from "../store/auth";

const ActivityScreen: React.FC<
  StackScreenProps<RootStackParamList, "Activity">
> = ({ route, navigation }) => {
  const { user } = useAuthStore();
  const toast = useToast();
  const [activity, setActivity] = useState<ActivityDocType | null>(null);
  const [studentRecord, setStudentRecord] =
    useState<ActivityStudentResultDocType | null>(null);
  const [loading, setLoading] = useState(true);

  async function getActivity() {
    try {
      const activityRef = doc(
        firestore,
        CollectionNames.ACTIVITIES,
        route.params.id
      ) as DocumentReference<ActivityDocType>;
      const activityDoc = await getDoc(activityRef);

      if (activityDoc.exists()) {
        const studentRef = doc(
          firestore,
          CollectionNames.ACTIVITIES,
          route.params.id,
          ActivityCollectionNames.STUDENTS,
          user?.uid
        ) as DocumentReference<ActivityStudentResultDocType>;
        const studentSnap = await getDoc(studentRef);

        if (studentSnap.exists()) {
          const studentData = studentSnap.data();
          setStudentRecord(studentData);
        }

        const data = activityDoc.data();
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

  useFocusEffect(
    useCallback(() => {
      getActivity();
    }, [])
  );

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
          <Text>Activity not found</Text>
        </Center>
      </BaseScreen>
    );
  }

  return (
    <BaseScreen>
      <VStack space={4} mx="auto" alignItems="center" w="90%">
        <NavCard
          title="Pre - Quiz"
          description="Tap to take the pre-quiz"
          svg={<SvgPreGame />}
          bg="#4B5563"
          onPress={() => {
            navigation.navigate("PreGame", { id: route.params.id });
          }}
        />

        <NavCard
          title="Learning Materials"
          description="Tap to view the learning materials"
          svg={<SvgLearningMaterials />}
          bg="#525252"
          onPress={() => {
            navigation.navigate("Learn", { id: route.params.id });
          }}
          disabled={!studentRecord?.status.preGameDone}
        />

        <NavCard
          title="Post - Quiz"
          description="Tap to take the post-quiz"
          svg={<SvgPostGame />}
          bg="#FB923C"
          onPress={() => {
            navigation.navigate("PostGame", { id: route.params.id });
          }}
          disabled={!studentRecord?.status.learningDone}
        />
      </VStack>
    </BaseScreen>
  );
};

export default ActivityScreen;

interface NavCardProps {
  bg: string;
  title: string;
  svg: JSX.Element;
  onPress: () => void;
  disabled?: boolean;
  description?: string;
}

const NavCard: React.FC<NavCardProps> = ({
  bg,
  title,
  svg: SVG,
  onPress,
  disabled,
  description,
}) => {
  return (
    <TouchableOpacity disabled={disabled} onPress={onPress}>
      <HStack
        p={4}
        borderRadius="xl"
        w="full"
        bg={bg}
        opacity={disabled ? 0.5 : 1}
      >
        <VStack space={2} flex={1}>
          <Text color="white" fontFamily="Inter-Bold" fontSize={22}>
            {title}
          </Text>
          {description && (
            <Text color="white" fontFamily="Inter-Medium">
              {description}
            </Text>
          )}
        </VStack>
        <Box px={4} flex={1}>
          <AspectRatio ratio={1}>{SVG}</AspectRatio>
        </Box>
      </HStack>
    </TouchableOpacity>
  );
};
