import { FontAwesome } from "@expo/vector-icons";
import {
  ActivityCollectionNames,
  ActivityStudentResultDocType,
  CollectionNames,
  GameShowQuestionType,
  GameShowTemplate,
  GameType,
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
  AspectRatio,
  Button,
  HStack,
  IconButton,
  ScrollView,
  Text,
  useToken,
  VStack,
} from "native-base";
import React, { useEffect, useState } from "react";
import { Image, TouchableOpacity } from "react-native";
import { firestore } from "../../../configs/firebase";
import { MainScreensParamList } from "../../../navigation";
import GameProgress from "../common/GameProgress";
import TitleInstruction from "../common/TitleInstruction";
import ResultModal, {
  getTime,
  useModalState,
} from "../result-modal/ResultModal";

interface GameShowQuizProps {
  userId: string;
  activityId: string;
  gameType: GameType;
  data: GameShowTemplate;
}

const GameShowQuiz: React.FC<GameShowQuizProps> = ({
  userId,
  activityId,
  gameType,
  data,
}) => {
  const navigation = useNavigation<NavigationProp<MainScreensParamList>>();
  const [orange] = useToken("colors", ["orange.400"]);
  const correctAnswers = data.questions.reduce((acc, curr) => {
    acc[curr.id] = curr.answer;
    return acc;
  }, {} as Record<string, string>);

  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isFinished, setIsFinished] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const trackTime = React.useRef(0);

  const modal = useModalState();

  const handleAnswer = (questionId: string, answerId: string) => {
    if (isFinished) return;
    setAnswers((prev) => ({ ...prev, [questionId]: answerId }));
  };

  const checkAnswers = async () => {
    try {
      setIsLoading(true);

      const time = Date.now() - trackTime.current;

      const score = Object.entries(answers).reduce(
        (acc, [questionId, answer]) => {
          if (correctAnswers[questionId] === answer) {
            acc++;
          }
          return acc;
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
                  correctAnswer={correctAnswers[question.id]}
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
                answers={answers}
                handleAnswer={handleAnswer}
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

export default GameShowQuiz;

interface CurrentQuestionProps {
  question: GameShowQuestionType;
  answers: Record<string, string>;
  handleAnswer: (questionId: string, choiceId: string) => void;
}

const CurrentQuestion: React.FC<CurrentQuestionProps> = ({
  question,
  answers,
  handleAnswer,
}) => {
  return (
    <VStack bg="gray.100" space={4} p={4} borderRadius="lg">
      <VStack space={3}>
        <Text
          fontFamily="Inter-Medium"
          textTransform="uppercase"
          color="muted.600"
          fontSize={12}
        >
          Select an answer
        </Text>

        {question.photoURL && (
          <AspectRatio
            ratio={16 / 9}
            w="full"
            borderRadius="lg"
            overflow="hidden"
          >
            <Image
              source={{ uri: question.photoURL }}
              style={{ width: "100%", height: "100%" }}
            />
          </AspectRatio>
        )}

        <Text fontFamily="Inter-Bold" fontSize={18}>
          {question.question}
        </Text>
      </VStack>

      <VStack space={2}>
        {question.choices.map((choice) => {
          const isSelected = answers[question.id] === choice.id;

          return (
            <ChoiceCard
              key={choice.id}
              choice={choice}
              onPress={() => handleAnswer(question.id, choice.id)}
              status={isSelected ? "SELECTED" : "DEFAULT"}
            />
          );
        })}
      </VStack>
    </VStack>
  );
};

interface QuestionResultProps {
  question: GameShowQuestionType;
  answers: Record<string, string>;
  correctAnswer: string;
}

const QuestionResult: React.FC<QuestionResultProps> = ({
  question,
  answers,
  correctAnswer,
}) => {
  const { id } = question;
  const userAnswer = answers[id];
  const isCorrectAnswer = userAnswer === correctAnswer;

  return (
    <VStack
      key={id}
      space={4}
      p={4}
      borderRadius="lg"
      borderWidth={2}
      borderColor={isCorrectAnswer ? "green.600" : "red.600"}
      bg={isCorrectAnswer ? "green.50" : "red.50"}
    >
      <VStack space={3}>
        {question.photoURL && (
          <AspectRatio
            ratio={16 / 9}
            w="full"
            borderRadius="lg"
            overflow="hidden"
          >
            <Image
              source={{ uri: question.photoURL }}
              style={{ width: "100%", height: "100%" }}
            />
          </AspectRatio>
        )}

        <Text fontFamily="Inter-Bold" fontSize={18}>
          {question.question}
        </Text>
      </VStack>

      <VStack space={2}>
        {question.choices.map((choice) => {
          const isSelected = answers[id] === choice.id;

          let status: ChoiceStatus = "DEFAULT";

          if (isSelected) {
            status = isCorrectAnswer ? "CORRECT" : "WRONG";
          } else if (correctAnswer === choice.id) {
            status = "CORRECT";
          }

          return <ChoiceCard key={choice.id} choice={choice} status={status} />;
        })}
      </VStack>
    </VStack>
  );
};

type ChoiceStatus = "CORRECT" | "WRONG" | "SELECTED" | "DEFAULT";

interface ChoiceProps {
  choice: GameShowTemplate["questions"][0]["choices"][0];
  onPress?: () => void;
  status: ChoiceStatus;
}

const ChoiceCard: React.FC<ChoiceProps> = ({ choice, onPress, status }) => {
  const colors = {
    CORRECT: "green.600",
    WRONG: "red.600",
    SELECTED: "orange.400",
    DEFAULT: "gray.300",
  };

  return (
    <TouchableOpacity onPress={onPress}>
      <HStack
        bg="white"
        borderRadius={12}
        p={4}
        space={2}
        w="full"
        alignItems="flex-start"
        borderWidth={status == "DEFAULT" ? 1 : 2}
        borderColor={colors[status]}
      >
        {choice.photoURL && (
          <AspectRatio ratio={1} w="80px">
            <Image source={{ uri: choice.photoURL }} />
          </AspectRatio>
        )}
        <Text fontFamily="Inter-Bold" color="muted.700">
          {choice.choice}
        </Text>
      </HStack>
    </TouchableOpacity>
  );
};
