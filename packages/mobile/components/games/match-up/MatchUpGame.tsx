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
  Actionsheet,
  Box,
  Button,
  Heading,
  HStack,
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

  const keywords = data.items.map((item) => item.keyword);
  const definitions = data.items.map((item) => item.definition);

  const [activeId, setActiveId] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const trackTime = React.useRef(0);

  const modal = useModalState();

  function onPressDefinition(id: string) {
    setActiveId(id);
    disclose.onOpen();
  }

  function onPressKeyword(id: string, selected: boolean) {
    setAnswers((prev) => {
      const sameAnswer = prev[activeId] && prev[activeId] === id;

      if (sameAnswer) {
        return { ...prev, [activeId]: null };
      }

      if (selected) {
        const [key] = Object.entries(prev).find(([_, value]) => value === id);
        return { ...prev, [activeId]: id, [key]: null };
      }

      return { ...prev, [activeId]: id };
    });
    setActiveId(null);
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
        <VStack space={4} borderRadius={20}>
          {definitions.map((definition) => {
            const userAnswer = answers[definition.id];

            return (
              <TouchableOpacity
                key={definition.id}
                onPress={() => onPressDefinition(definition.id)}
              >
                <VStack space={2} bg="white" py={4} px={4} borderRadius="lg">
                  <HStack>
                    <Text fontFamily="Inter-Bold" fontSize={20}>
                      {definition.text}
                    </Text>
                  </HStack>
                  <HStack
                    bg="#f9f9fb"
                    minH={12}
                    borderRadius="lg"
                    borderWidth={1}
                    borderColor="muted.200"
                    borderStyle="dashed"
                    justifyContent="center"
                    alignItems="center"
                  >
                    {!!userAnswer ? (
                      <Text fontFamily="Inter-Regular" color="muted.500">
                        {
                          keywords.find((keyword) => keyword.id === userAnswer)
                            ?.text
                        }
                      </Text>
                    ) : (
                      <Text fontFamily="Inter-Regular" color="muted.500">
                        Select your answer
                      </Text>
                    )}
                  </HStack>
                </VStack>
              </TouchableOpacity>
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

      <MatchUpActionSheet
        activeId={activeId}
        disclose={disclose}
        keywords={keywords}
        onPressKeyword={onPressKeyword}
        answer={answers}
      />
    </>
  );
};

export default MatchUpGame;

interface MatchUpActionSheetProps {
  activeId: string | null;
  disclose: ReturnType<typeof useDisclose>;
  keywords: { id: string; text: string }[];
  onPressKeyword: (id: string, selected: boolean) => void;
  answer: Record<string, string>;
}

const MatchUpActionSheet: React.FC<MatchUpActionSheetProps> = ({
  disclose,
  keywords,
  onPressKeyword,
  answer,
}) => {
  const { isOpen, onClose } = disclose;

  return (
    <Actionsheet isOpen={isOpen} onClose={onClose}>
      <Actionsheet.Content px={4}>
        <Box w="full" py={4}>
          <Heading>Choose your answer</Heading>
        </Box>
        <VStack w="full" space={4} pb={4}>
          {keywords.map((keyword) => {
            const selected = Object.values(answer).includes(keyword.id);

            return (
              <TouchableOpacity
                key={keyword.id}
                onPress={() => onPressKeyword(keyword.id, selected)}
              >
                <HStack
                  position="relative"
                  bg="#f9f9fb"
                  minH={12}
                  borderRadius="lg"
                  borderWidth={1}
                  borderColor="muted.200"
                  borderStyle="dashed"
                  justifyContent="center"
                  alignItems="center"
                >
                  {selected && (
                    <Box
                      h={5}
                      w={16}
                      px={2}
                      borderRadius="lg"
                      position="absolute"
                      top={-10}
                      right={-8}
                      bg="orange.500"
                      justifyContent={"center"}
                      alignItems={"center"}
                    >
                      <Text fontFamily="Inter-Bold" fontSize={10} color="white">
                        Selected
                      </Text>
                    </Box>
                  )}
                  <Text>{keyword.text}</Text>
                </HStack>
              </TouchableOpacity>
            );
          })}
        </VStack>
      </Actionsheet.Content>
    </Actionsheet>
  );
};
