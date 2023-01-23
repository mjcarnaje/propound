import { FontAwesome } from "@expo/vector-icons";
import {
  ActivityCollectionNames,
  ActivityStudentResultDocType,
  CollectionNames,
  GameType,
  MissingWordTemplate,
  StudentCollectionNames,
  StudentResultDocType,
} from "@propound/types";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import {
  doc,
  DocumentReference,
  runTransaction,
  serverTimestamp,
} from "firebase/firestore";
import moment from "moment";
import {
  Box,
  Button,
  Center,
  CheckIcon,
  CloseIcon,
  HStack,
  IconButton,
  Text,
  useToken,
  VStack,
} from "native-base";
import React, { useMemo, useState } from "react";
import { ScrollView } from "react-native";
import { firestore } from "../../../configs/firebase";
import { MainScreensParamList } from "../../../navigation";
import ResultModal, { useModalState } from "../result-modal/ResultModal";

interface MissingWordGameProps {
  data: MissingWordTemplate;
  activityId: string;
  gameType: GameType;
  userId: string;
}

const MissingWordGame: React.FC<MissingWordGameProps> = ({
  data,
  gameType,
  userId,
  activityId,
}) => {
  const navigation = useNavigation<NavigationProp<MainScreensParamList>>();
  const modal = useModalState();

  const [orange] = useToken("colors", ["orange.400"]);

  const [current, setCurrent] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const trackTime = React.useRef(0);

  const currentQuestion = useMemo(() => data.questions[current], [current]);
  const currentQuestionArr = useMemo(() => {
    const question = currentQuestion.question.split(" ");
    return question;
  }, [currentQuestion]);
  const choices = useMemo(() => {
    const answer =
      currentQuestion.question.split(" ")[currentQuestion.answerIdx];
    const _choices = [...currentQuestion.incorrect, answer];
    return _choices.sort(() => Math.random() - 0.5);
  }, [currentQuestion]);

  const handleAnswer = (questionId: string, answer: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const checkAnswers = async () => {
    try {
      setIsLoading(true);

      const timeSpent = Date.now() - trackTime.current;

      const score = Object.entries(answers).reduce(
        (acc, [questionId, answer]) => {
          const question = data.questions.find((q) => q.id === questionId);
          if (!question) {
            throw new Error("Question not found");
          }
          const correctAnswer =
            question.question.split(" ")[question.answerIdx];
          return acc + (answer === correctAnswer ? 1 : 0);
        },
        0
      );

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

        const newAverageScores = [
          ...previousData.scores,
          { score, time: timeSpent },
        ];
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
        score: `${score}/${data.questions.length}`,
        time: `${moment(timeSpent).format("mm:ss")}`,
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

  return (
    <>
      <ResultModal modal={modal} />
      <ScrollView
        contentContainerStyle={{ paddingBottom: 36, position: "relative" }}
      >
        <VStack space={8} w="90%" mx="auto">
          <VStack>
            <Text fontFamily="Inter-Bold" fontSize={28}>
              {data.title}
            </Text>
            <Text fontFamily="Inter-Regular" color="muted.500">
              {data.instruction}
            </Text>
          </VStack>
          {!isFinished && (
            <VStack space={2} alignItems="center">
              <Text fontFamily="Montserrat-Bold" color="muted.700">
                {`${current + 1} OF ${data.total}`}
              </Text>
              <Box borderRadius="xl" w="full" bg="gray.300" h={2.5}>
                <Box
                  bg="orange.400"
                  w={`${((current + 1) / data.total) * 100}%`}
                  h="full"
                  borderRadius="xl"
                />
              </Box>
            </VStack>
          )}

          <VStack borderRadius="xl" bg="#F5F5F5" p={4} space={6}>
            <Text
              fontFamily="Inter-Bold"
              fontSize={12}
              textTransform="uppercase"
            >
              Select an answer
            </Text>
            <HStack flexWrap="wrap">
              {choices.map((choice, idx) => {
                const correctAnswer =
                  currentQuestion.question.split(" ")[
                    currentQuestion.answerIdx
                  ];
                const isCorrect = choice === correctAnswer;
                return (
                  <Box p={2}>
                    <Button
                      disabled={isFinished}
                      opacity={isFinished ? 0.8 : 1}
                      key={idx}
                      borderRadius="lg"
                      onPress={() => handleAnswer(currentQuestion.id, choice)}
                      colorScheme="orange"
                      bg={["#E49557", "#2F3356"][idx % 2]}
                      _text={{ fontFamily: "Inter-Bold" }}
                      p={2}
                      position="relative"
                    >
                      {isFinished && isCorrect && (
                        <Center
                          position="absolute"
                          top={-16}
                          right={-16}
                          borderRadius="full"
                          boxSize={"20px"}
                          bg="green.600"
                        >
                          <CheckIcon size={3} style={{ color: "white" }} />
                        </Center>
                      )}
                      {choice}
                    </Button>
                  </Box>
                );
              })}
            </HStack>
            <HStack alignItems="center" flexWrap="wrap" textAlign="justify">
              {currentQuestionArr.map((text, idx) => {
                if (idx === currentQuestion.answerIdx) {
                  const questionId = currentQuestion.id;
                  const answer = answers[questionId];
                  if (answer) {
                    const isCorrect = answer === text;
                    return (
                      <Button
                        onPress={() => handleAnswer(currentQuestion.id, null)}
                        key={idx}
                        borderRadius="lg"
                        bg="#E49557"
                        _text={{ fontFamily: "Inter-Bold" }}
                        py={2}
                        position="relative"
                      >
                        {isFinished && isCorrect && (
                          <Center
                            position="absolute"
                            top={-16}
                            right={-16}
                            borderRadius="full"
                            boxSize={"20px"}
                            bg="green.600"
                          >
                            <CheckIcon size={3} style={{ color: "white" }} />
                          </Center>
                        )}
                        {isFinished && !isCorrect && (
                          <Center
                            position="absolute"
                            top={-16}
                            right={-16}
                            borderRadius="full"
                            boxSize={"20px"}
                            bg="red.600"
                          >
                            <CloseIcon size={3} style={{ color: "white" }} />
                          </Center>
                        )}
                        {isFinished && isCorrect && (
                          <Center
                            position="absolute"
                            top={-16}
                            right={-16}
                            borderRadius="full"
                            boxSize={"20px"}
                            bg="green.500"
                          >
                            <CheckIcon size={3} style={{ color: "white" }} />
                          </Center>
                        )}
                        {answer}
                      </Button>
                    );
                  }
                  return (
                    <Box
                      key={idx}
                      w={136}
                      h={"30px"}
                      bg="coolGray.300"
                      borderRadius="md"
                      mx={2}
                    />
                  );
                }
                return (
                  <Text
                    key={idx}
                    fontSize={14}
                    lineHeight={30}
                    fontFamily="Inter-Medium"
                  >{` ${text} `}</Text>
                );
              })}
            </HStack>
          </VStack>

          {!isFinished && (
            <HStack w="full" justifyContent="space-between">
              <IconButton
                colorScheme="orange"
                boxSize={12}
                icon={
                  <FontAwesome name="chevron-left" size={24} color={orange} />
                }
                onPress={() => setCurrent((prev) => prev - 1)}
                isDisabled={current === 0}
                opacity={current === 0 ? 0.5 : 1}
              />

              {current === data.total - 1 && (
                <Button
                  isLoading={isLoading}
                  isLoadingText="Checking..."
                  onPress={checkAnswers}
                  colorScheme="orange"
                  _text={{ fontFamily: "Inter-Bold" }}
                  borderRadius="lg"
                  px={12}
                >
                  Finish
                </Button>
              )}

              <IconButton
                colorScheme="orange"
                boxSize={12}
                icon={
                  <FontAwesome name="chevron-right" size={24} color={orange} />
                }
                onPress={() => setCurrent((prev) => prev + 1)}
                isDisabled={current === data.total - 1}
                opacity={current === data.total - 1 ? 0.5 : 1}
              />
            </HStack>
          )}
        </VStack>
      </ScrollView>
    </>
  );
};

export default MissingWordGame;
