import { AcitivityDocType, AcitivityStudentDocType } from "@propound/types";
import { useFocusEffect } from "@react-navigation/native";
import { StackScreenProps } from "@react-navigation/stack";
import { doc, getDoc } from "firebase/firestore";
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
  const [activity, setActivity] = useState<AcitivityDocType | null>(null);
  const [studentRecord, setStudentRecord] =
    useState<AcitivityStudentDocType | null>(null);
  const [loading, setLoading] = useState(true);

  async function getActivity() {
    try {
      const docRef = doc(firestore, "activity", route.params.id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const studentRef = doc(
          firestore,
          "activity",
          route.params.id,
          "students",
          user?.uid
        );
        const studentSnap = await getDoc(studentRef);

        if (studentSnap.exists()) {
          const studentData = studentSnap.data() as AcitivityStudentDocType;
          setStudentRecord(studentData);
        }

        const data = docSnap.data() as AcitivityDocType;
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
          title="Pre - Game"
          description="Tap here to visualize the computed scores of the exam"
          svg={<SvgPreGame />}
          bg="#4B5563"
          onPress={() => {
            navigation.navigate("PreGame", { id: route.params.id });
          }}
        />

        <NavCard
          title="Learning Materials"
          description="Tap here to visualize the computed scores of the exam"
          svg={<SvgLearningMaterials />}
          bg="#525252"
          onPress={() => {
            navigation.navigate("Learn", { id: route.params.id });
          }}
          disabled={!studentRecord?.status.preGameDone}
        />

        <NavCard
          title="Post - Game"
          description="Tap here to visualize the computed scores of the exam"
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
  description: string;
  svg: JSX.Element;
  onPress: () => void;
  disabled?: boolean;
}

const NavCard: React.FC<NavCardProps> = ({
  bg,
  title,
  description,
  svg: SVG,
  onPress,
  disabled,
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
          <Text fontSize={13} color="white" fontFamily="Inter-Regular">
            {description}
          </Text>
        </VStack>
        <Box px={4} flex={1}>
          <AspectRatio ratio={1}>{SVG}</AspectRatio>
        </Box>
      </HStack>
    </TouchableOpacity>
  );
};
