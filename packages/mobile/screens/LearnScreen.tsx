import { AntDesign } from "@expo/vector-icons";
import {
  ActivityCollectionNames,
  ActivityStudentResultDocType,
  CollectionNames,
  LearningMaterial,
  LearningMaterialType,
} from "@propound/types";
import { StackScreenProps } from "@react-navigation/stack";
import * as WebBrowser from "expo-web-browser";
import {
  collection,
  CollectionReference,
  doc,
  DocumentReference,
  getDocs,
  query,
  updateDoc,
} from "firebase/firestore";
import {
  Box,
  Button,
  Center,
  HStack,
  Spinner,
  Text,
  useToast,
  useToken,
  VStack,
} from "native-base";
import React, { useEffect, useState } from "react";
import { FlatList, TouchableOpacity } from "react-native";
import BaseScreen from "../components/BaseScreen";
import { firestore } from "../configs/firebase";
import { RootStackParamList } from "../navigation";
import { useAuthStore } from "../store/auth";

const LearnScreen: React.FC<StackScreenProps<RootStackParamList, "Learn">> = ({
  route,
}) => {
  const { user } = useAuthStore();
  const { id: activityId } = route.params;
  const [orange] = useToken("colors", ["orange.600"]);
  const toast = useToast();
  const [materials, setMaterials] = useState<LearningMaterial[] | null>([]);
  const [loading, setLoading] = useState(true);
  const [markingAsDone, setMarkingAsDone] = useState(false);

  async function getActivity() {
    try {
      const q = query(
        collection(
          firestore,
          CollectionNames.ACTIVITIES,
          activityId,
          ActivityCollectionNames.MATERIALS
        ) as CollectionReference<LearningMaterial>
      );

      const querySnapshot = await getDocs(q);

      setMaterials(querySnapshot.docs.map((doc) => doc.data()));
    } catch (err) {
      toast.show({
        title: "Error",
        description: "There was an error fetching the activity",
      });
    } finally {
      setLoading(false);
    }
  }

  async function markAsDone() {
    setMarkingAsDone(true);

    const studentRef = doc(
      firestore,
      CollectionNames.ACTIVITIES,
      activityId,
      ActivityCollectionNames.STUDENTS,
      user.uid
    ) as DocumentReference<ActivityStudentResultDocType>;

    await updateDoc(studentRef, {
      "status.learningDone": true,
    });

    toast.show({
      title: "Success",
      description: "You have marked this activity as done",
    });

    setMarkingAsDone(false);
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

  if (!materials) {
    return (
      <BaseScreen>
        <Center flexGrow={1}>
          <Text>Something went wrong!</Text>
        </Center>
      </BaseScreen>
    );
  }

  const MaterialIcons: Record<LearningMaterialType, JSX.Element> = {
    PDF: <AntDesign name="pdffile1" size={28} color={orange} />,
    YOUTUBE: <AntDesign name="youtube" size={28} color={orange} />,
    LINK: <AntDesign name="link" size={28} color={orange} />,
    PPT: <AntDesign name="pptfile1" size={28} color={orange} />,
    WORD: <AntDesign name="wordfile1" size={28} color={orange} />,
  };

  return (
    <BaseScreen>
      <FlatList
        contentContainerStyle={{ width: "90%", alignSelf: "center" }}
        data={materials}
        renderItem={({ item }) => {
          const MaterialIcon = MaterialIcons[item.type];

          return (
            <TouchableOpacity
              onPress={() => {
                WebBrowser.openBrowserAsync(item.url);
              }}
            >
              <HStack
                p={4}
                space={4}
                alignItems="center"
                bg="gray.100"
                borderRadius="lg"
              >
                <Center boxSize="64px" bg="orange.100" borderRadius="lg">
                  {MaterialIcon}
                </Center>
                <VStack>
                  <Text fontSize={18} fontFamily="Inter-Bold" color="muted.700">
                    {item.title}
                  </Text>
                  <Text
                    fontSize={13}
                    fontFamily="Inter-Medium"
                    color="muted.500"
                  >
                    {item.type}
                  </Text>
                </VStack>
              </HStack>
            </TouchableOpacity>
          );
        }}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <Center flexGrow={1} py={8}>
            <Text fontFamily="Inter-Bold" fontSize={22}>
              No materials found.
            </Text>
          </Center>
        }
        ItemSeparatorComponent={() => <VStack py={2} />}
        ListFooterComponent={
          <Box py={4}>
            <Button
              isLoading={markingAsDone}
              onPress={markAsDone}
              isLoadingText="Marking as done"
              _text={{
                fontFamily: "Inter-Bold",
              }}
              colorScheme="orange"
              borderRadius="lg"
              py={4}
            >
              Mark as done!
            </Button>
          </Box>
        }
      />
    </BaseScreen>
  );
};

export default LearnScreen;
