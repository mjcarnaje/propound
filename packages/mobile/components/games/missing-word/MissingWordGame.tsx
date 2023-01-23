import { FontAwesome } from "@expo/vector-icons";
import {
  ActivityCollectionNames,
  ActivityStudentResultDocType,
  CollectionNames,
  GameType,
  MissingWordQuestionType,
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
import React, { useEffect, useMemo, useState } from "react";
import { ScrollView } from "react-native";
import { firestore } from "../../../configs/firebase";
import { MainScreensParamList } from "../../../navigation";
import { getUnique, shuffle } from "../../../utils/misc";
import GameProgress from "../common/GameProgress";
import TitleInstruction from "../common/TitleInstruction";
import ResultModal, {
  getTime,
  useModalState,
} from "../result-modal/ResultModal";

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

      const time = Date.now() - trackTime.current;

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
        score: `${score}/${data.questions.length}`,
        time: getTime(time),
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
      <ScrollView
        contentContainerStyle={{ paddingBottom: 36, position: "relative" }}
      >
        <VStack space={8} w="90%" mx="auto">
          <TitleInstruction title={data.title} instruction={data.instruction} />

          {!isFinished && (
            <GameProgress current={current} total={data.questions.length} />
          )}

          {isFinished && (
            <VStack space={4}>
              {data.questions.map((question) => (
                <QuestionResult
                  key={question.id}
                  question={question}
                  answers={answers}
                />
              ))}
              <Button
                onPress={navigation.goBack}
                py={4}
                borderRadius="lg"
                colorScheme="orange"
                _text={{ fontFamily: "Inter-Bold" }}
              >
                Done!
              </Button>
            </VStack>
          )}

          {!isFinished && (
            <VStack space={4}>
              <CurrentQuestion
                question={data.questions[current]}
                handleAnswer={handleAnswer}
                answers={answers}
              />

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
                    <FontAwesome
                      name="chevron-right"
                      size={24}
                      color={orange}
                    />
                  }
                  onPress={() => setCurrent((prev) => prev + 1)}
                  isDisabled={current === data.total - 1}
                  opacity={current === data.total - 1 ? 0.5 : 1}
                />
              </HStack>
            </VStack>
          )}
        </VStack>
      </ScrollView>
    </>
  );
};

export default MissingWordGame;

interface CurrentQuestionProps {
  question: MissingWordQuestionType;
  handleAnswer: (id: string, answer: string | null) => void;
  answers: Record<string, string | null>;
}

const CurrentQuestion: React.FC<CurrentQuestionProps> = (props) => {
  const { handleAnswer, answers } = props;
  const { id, question, incorrect, answerIdx } = props.question;
  const correctAnswer = question.split(" ")[answerIdx];
  const choices = useMemo(() => shuffle([correctAnswer, ...incorrect]), [id]);
  const userAnswer = answers[id];

  return (
    <VStack borderRadius="xl" bg="#F5F5F5" p={4} space={6}>
      <Text fontFamily="Inter-Bold" fontSize={12} textTransform="uppercase">
        Select an answer
      </Text>
      <HStack flexWrap="wrap">
        {choices
          .filter(getUnique)
          .filter((choice) => choice !== userAnswer)
          .map((choice, choiceIdx) => {
            return (
              <Box key={choiceIdx} p={2}>
                <Button
                  borderRadius="lg"
                  onPress={() => handleAnswer(id, choice)}
                  colorScheme="orange"
                  bg="#2F3356"
                  _text={{ fontFamily: "Inter-Bold" }}
                  p={2}
                  position="relative"
                >
                  {choice}
                </Button>
              </Box>
            );
          })}
      </HStack>
      <HStack alignItems="center" flexWrap="wrap" textAlign="justify">
        {question.split(" ").map((text, wordIdx) => {
          if (wordIdx === answerIdx) {
            const hasAnswer = !!answers[id];

            if (hasAnswer) {
              return (
                <Button
                  key={wordIdx}
                  onPress={() => handleAnswer(id, null)}
                  borderRadius="lg"
                  bg="#E49557"
                  _text={{ fontFamily: "Inter-Bold" }}
                  py={2}
                  position="relative"
                >
                  {answers[id]}
                </Button>
              );
            }

            return (
              <Box
                key={wordIdx}
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
              key={wordIdx}
              fontSize={14}
              lineHeight={30}
              fontFamily="Inter-Medium"
            >
              {` ${text} `}
            </Text>
          );
        })}
      </HStack>
    </VStack>
  );
};

interface QuestionResultProps {
  question: MissingWordQuestionType;
  answers: Record<string, string | null>;
}

const QuestionResult: React.FC<QuestionResultProps> = (props) => {
  const { answers } = props;
  const { id, question, incorrect, answerIdx } = props.question;
  const correctAnswer = question.split(" ")[answerIdx];
  const choices = [correctAnswer, ...incorrect];
  const userAnswer = answers[id];
  const isCorrectAnswer = userAnswer === correctAnswer;

  return (
    <VStack
      borderRadius="xl"
      p={4}
      space={6}
      borderWidth={2}
      borderColor={isCorrectAnswer ? "green.600" : "red.600"}
      bg={isCorrectAnswer ? "green.50" : "red.50"}
    >
      <HStack flexWrap="wrap">
        {choices
          .filter(getUnique)
          .filter((choice) => choice !== userAnswer)
          .map((choice, choiceIdx) => {
            const isCorrectAnswer = choice === correctAnswer;
            return (
              <Box key={choiceIdx} p={2}>
                <Button
                  disabled
                  opacity={0.8}
                  borderRadius="lg"
                  colorScheme="orange"
                  bg="#2F3356"
                  _text={{ fontFamily: "Inter-Bold" }}
                  p={2}
                  position="relative"
                >
                  {isCorrectAnswer && (
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
        {question.split(" ").map((word, wordIdx) => {
          if (wordIdx === answerIdx) {
            if (!!userAnswer) {
              const isCorrect = userAnswer === correctAnswer;
              return (
                <Button
                  disabled={true}
                  key={wordIdx}
                  borderRadius="lg"
                  bg="#E49557"
                  _text={{ fontFamily: "Inter-Bold" }}
                  py={2}
                  position="relative"
                >
                  {isCorrect && (
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
                  {!isCorrect && (
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

                  {userAnswer}
                </Button>
              );
            }
            return (
              <Box
                key={wordIdx}
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
              key={wordIdx}
              fontSize={14}
              lineHeight={30}
              fontFamily="Inter-Medium"
            >{` ${word} `}</Text>
          );
        })}
      </HStack>
    </VStack>
  );
};
