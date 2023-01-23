import {
  ActivityCollectionNames,
  ActivityStudentResultDocType,
  CollectionNames,
  GameType,
  MatchUpTemplate,
  StudentCollectionNames,
  StudentResultDocType,
} from "@propound/types";
import {
  doc,
  DocumentReference,
  runTransaction,
  serverTimestamp,
} from "firebase/firestore";
import moment from "moment";
import {
  AspectRatio,
  Button,
  Center,
  HStack,
  Image,
  Text,
  useDisclose,
  VStack,
} from "native-base";
import React, { useEffect, useState } from "react";
import { TouchableOpacity } from "react-native";
import { firestore } from "../../../configs/firebase";
import ResultModal, { useModalState } from "../result-modal/ResultModal";

interface MatchUpGameProps {
  userId: string;
  activityId: string;
  gameType: GameType;
  data: MatchUpTemplate;
}

const MatchUpGame: React.FC<MatchUpGameProps> = ({
  activityId,
  gameType,
  userId,
  data,
}) => {
  const disclose = useDisclose();

  const photos = data.items.map((item) => item.photo);
  const definitions = data.items.map((item) => item.text);

  const [activePictureId, setActivePictureId] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const trackTime = React.useRef(0);

  const modal = useModalState();

  function onPressPicture(id: string) {
    setActivePictureId((prev) => (prev === id ? null : id));
  }

  function onPressText(id: string) {
    setAnswers((prev) => {
      const sameAnswer = prev[id] && prev[id] === activePictureId;

      if (sameAnswer) {
        return { ...prev, [id]: null };
      }

      const isAlreadyAnswered = Object.values(prev).includes(activePictureId);

      if (isAlreadyAnswered) {
        const prevId = Object.keys(prev).find(
          (key) => prev[key] === activePictureId
        );

        return { ...prev, [id]: activePictureId, [prevId!]: null };
      }

      return { ...prev, [id]: activePictureId };
    });
    setActivePictureId(null);
    disclose.onClose();
  }

  const checkAnswers = async () => {
    try {
      setIsLoading(true);

      const time = Date.now() - trackTime.current;

      const score = definitions.filter(
        (definition) => definition.id === answers[definition.id]
      ).length;

      const studentRef = doc(
        firestore,
        CollectionNames.ACTIVITIES,
        activityId,
        ActivityCollectionNames.STUDENTS,
        userId
      ) as DocumentReference<ActivityStudentResultDocType>;

      const studentUserRef = doc(
        firestore,
        CollectionNames.USERS,
        userId,
        StudentCollectionNames.RESULTS,
        activityId
      ) as DocumentReference<StudentResultDocType>;

      await runTransaction(firestore, async (transaction) => {
        const studentDoc = await transaction.get<ActivityStudentResultDocType>(
          studentRef
        );

        if (!studentDoc.exists()) {
          return;
        }

        const previousData = studentDoc.data().scores[gameType];

        const newAverageScores = [...previousData.scores, { score, time }];
        const newAverage = {
          score:
            newAverageScores.reduce((acc, curr) => acc + curr.score, 0) /
            newAverageScores.length,
          time:
            newAverageScores.reduce((acc, curr) => acc + curr.time, 0) /
            newAverageScores.length,
        };

        const newStatus = {
          ...studentDoc.data().status,
          [gameType === GameType.PRE_TEST ? "preGameDone" : "postGameDone"]:
            true,
        };

        const newScores = {
          ...studentDoc.data().scores,
          [gameType]: {
            ...previousData,
            scores: newAverageScores,
            latestScore: score,
            average: newAverage,
            latestDate: serverTimestamp(),
            baseDate: previousData?.baseDate || serverTimestamp(),
          },
        };

        transaction.update(studentRef, {
          status: newStatus,
          scores: newScores,
        });

        transaction.update(studentUserRef, {
          status: newStatus,
          scores: newScores,
        });
      });

      const passingScore = data.total * 0.5;

      modal.setModalData({
        score: `${score}/${data.items.length}`,
        time: moment(time).format("mm:ss"),
        status: score >= passingScore ? "PASS" : "FAIL",
      });

      modal.disclose.onOpen();
    } catch (error) {
      console.log(error);
    } finally {
      setIsFinished(true);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    trackTime.current = Date.now();
  }, []);

  return (
    <>
      <ResultModal modal={modal} />

      <VStack space={8} w="90%" mx="auto">
        <VStack>
          <Text fontFamily="Inter-Bold" fontSize={28}>
            {data.title}
          </Text>
          <Text fontFamily="Inter-Regular" color="muted.500">
            {data.instruction}
          </Text>
        </VStack>
        <HStack
          bg="coolGray.100"
          p={2}
          space={2}
          justifyContent="space-between"
          w="full"
          borderRadius="lg"
        >
          {photos.map((photo) => {
            const isActive = activePictureId === photo.id;
            return (
              <TouchableOpacity onPress={() => onPressPicture(photo.id)}>
                <AspectRatio
                  key={photo.id}
                  ratio={1}
                  maxW="100px"
                  w="full"
                  borderRadius="lg"
                  overflow="hidden"
                  borderWidth={2}
                  borderColor={isActive ? "orange.500" : "transparent"}
                >
                  <Image
                    source={{ uri: photo.photo }}
                    style={{ width: "100%", height: "100%" }}
                    alt={photo.id}
                  />
                </AspectRatio>
              </TouchableOpacity>
            );
          })}
        </HStack>
        <VStack space={4} borderRadius={20}>
          {definitions.map((text) => {
            const isSelecting = !!activePictureId;

            const userAnswer = answers[text.id];

            const photoURL = photos.find(
              (photo) => photo.id === userAnswer
            )?.photo;

            return (
              <HStack space={8} bg="coolGray.100" p={2} borderRadius="lg">
                <TouchableOpacity
                  disabled={!isSelecting}
                  onPress={() => onPressText(text.id)}
                >
                  <AspectRatio
                    key={text.id}
                    ratio={1}
                    maxW="100px"
                    w="full"
                    borderRadius="lg"
                    overflow="hidden"
                    borderWidth={2}
                    borderStyle="dashed"
                    bg="coolGray.200"
                    borderColor={!isSelecting ? "transparent" : "amber.500"}
                  >
                    <Image
                      source={{ uri: photoURL }}
                      style={{ width: "100%", height: "100%" }}
                      alt="user answer"
                    />
                  </AspectRatio>
                </TouchableOpacity>
                <Center>
                  <Text fontFamily="Inter-Bold" fontSize={18}>
                    {text.text}
                  </Text>
                </Center>
              </HStack>
            );
          })}
        </VStack>

        <Button
          isLoading={isLoading}
          isLoadingText="Checking..."
          onPress={checkAnswers}
          py={4}
          borderRadius="lg"
          colorScheme="orange"
          _text={{ fontFamily: "Inter-Bold" }}
        >
          Submit
        </Button>
      </VStack>
    </>
  );
};

export default MatchUpGame;
