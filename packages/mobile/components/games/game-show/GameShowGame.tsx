import { FontAwesome } from "@expo/vector-icons";
import {
  AcitivityStudentDocType,
  GameShowTemplate,
  UserActivityResultDocType,
} from "@propound/types";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { doc, DocumentReference, runTransaction } from "firebase/firestore";
import AnimatedLottieView from "lottie-react-native";
import moment from "moment";
import {
  AspectRatio,
  Box,
  Button,
  Center,
  HStack,
  IconButton,
  Modal,
  ScrollView,
  Text,
  useDisclose,
  useToast,
  useToken,
  VStack,
} from "native-base";
import React, { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import { firestore } from "../../../configs/firebase";
import { MainScreensParamList } from "../../../navigation";
import { useAuthStore } from "../../../store/auth";

interface GameShowQuizProps {
  activityId: string;
  type: "PRE" | "POST";
  data: GameShowTemplate;
}

const GameShowQuiz: React.FC<GameShowQuizProps> = ({
  activityId,
  type,
  data,
}) => {
  const { isOpen, onOpen, onClose } = useDisclose();
  const { user } = useAuthStore();
  const toast = useToast();
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
  const currentQuestion = data.questions[current];
  const trackTime = React.useRef(0);
  const [modalData, setModalData] = useState<{
    score: string;
    time: string;
    status: "PASS" | "FAIL";
  } | null>(null);

  const [show, setShow] = useState(false);

  const handleAnswer = (questionId: string, answerId: string) => {
    if (isFinished) return;
    setAnswers((prev) => ({ ...prev, [questionId]: answerId }));
  };

  const checkAnswers = async () => {
    try {
      if (!user) {
        toast.show({
          title: "Error",
          description: "You are not logged in",
        });
      }

      setIsLoading(true);

      const score = Object.entries(answers).reduce(
        (acc, [questionId, answer]) => {
          if (correctAnswers[questionId] === answer) {
            acc++;
          }
          return acc;
        },
        0
      );

      const timeSpent = new Date().getTime() - trackTime.current;

      const studentRef = doc(
        firestore,
        "activity",
        activityId,
        "students",
        user.uid
      ) as DocumentReference<AcitivityStudentDocType>;

      const studentUserRef = doc(
        firestore,
        "user",
        user.uid,
        "scores",
        activityId
      ) as DocumentReference<UserActivityResultDocType>;

      await runTransaction(firestore, async (transaction) => {
        const studentDoc = await transaction.get<AcitivityStudentDocType>(
          studentRef
        );

        if (!studentDoc.exists()) {
          toast.show({
            title: "Error",
            description: "You are not enrolled in this activity",
          });
          return;
        }

        const key = type === "PRE" ? "PRE_TEST" : "POST_TEST";

        const previousData = studentDoc.data().scores[key];

        const newScores = [...previousData.scores, { score, time: timeSpent }];
        const newAverage = {
          score:
            newScores.reduce((acc, curr) => acc + curr.score, 0) /
            newScores.length,
          time:
            newScores.reduce((acc, curr) => acc + curr.time, 0) /
            newScores.length,
        };

        const newStatus = {
          ...studentDoc.data().status,
          [type === "PRE" ? "preGameDone" : "postGameDone"]: true,
        };
        const _newScores = {
          ...studentDoc.data().scores,
          [key]: {
            ...previousData,
            scores: newScores,
            latestScore: score,
            average: newAverage,
            latestDate: new Date(),
            baseDate: previousData?.baseDate || new Date(),
          },
        };

        transaction.update(studentRef, {
          status: newStatus,
          // @ts-ignore
          scores: _newScores,
        });

        transaction.update(studentUserRef, {
          status: newStatus,
          // @ts-ignore
          scores: _newScores,
        });
      });

      const passingScore = data.total * 0.5;

      setShow(true);

      setModalData({
        score: `${score}/${data.questions.length}`,
        time: `${moment(timeSpent).format("mm:ss")}`,
        status: score >= passingScore ? "PASS" : "FAIL",
      });

      onOpen();
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
      <Modal
        isOpen={isOpen}
        onClose={() => {
          onClose();
          setModalData(null);
        }}
      >
        {modalData && (
          <>
            {show && modalData.status === "PASS" && (
              <Confetti setShowConfetti={setShow} />
            )}
            {show && modalData.status === "FAIL" && (
              <TryAgain setShowConfetti={setShow} />
            )}
            <Modal.Content px={4} py={8} w="90%" borderRadius={24}>
              <VStack space={8} alignItems="center">
                <VStack space={2}>
                  <Text
                    fontFamily="Inter-Bold"
                    fontSize={28}
                    textAlign="center"
                    color={
                      modalData.status === "PASS" ? "green.600" : "red.600"
                    }
                  >
                    {modalData.status === "PASS" ? "Congratulations!" : "Oops!"}
                  </Text>
                  <Text textAlign="center" fontFamily="Inter-Regular">
                    You have {modalData.status === "PASS" ? "passed" : "failed"}{" "}
                    the quiz
                  </Text>
                </VStack>
                <HStack w="full">
                  <Center flexGrow={1}>
                    <Text
                      fontSize={28}
                      fontFamily="Inter-Bold"
                      color={
                        modalData.status === "PASS" ? "green.600" : "red.600"
                      }
                    >
                      {modalData.score}
                    </Text>
                    <Text fontSize={12} fontFamily="Inter-Medium">
                      SCORE
                    </Text>
                  </Center>
                  <Center flexGrow={1}>
                    <HStack alignItems="center" space={1}>
                      <Text fontSize={28} fontFamily="Inter-Bold">
                        {modalData.time}
                      </Text>
                      <Text fontSize={10} fontFamily="Inter-SemiBold">
                        mins
                      </Text>
                    </HStack>
                    <Text fontSize={12} fontFamily="Inter-Medium">
                      TIME ELAPSED
                    </Text>
                  </Center>
                </HStack>
                <Button
                  borderRadius={12}
                  onPress={() => {
                    onClose();
                    setModalData(null);
                  }}
                  colorScheme="orange"
                  _text={{ fontFamily: "Inter-Bold" }}
                  px={8}
                >
                  Okay!
                </Button>
              </VStack>
            </Modal.Content>
          </>
        )}
      </Modal>

      <ScrollView
        contentContainerStyle={{ paddingBottom: 36, position: "relative" }}
      >
        <VStack space={8} w="90%" mx="auto">
          <VStack>
            <Text fontFamily="Inter-Bold" fontSize={28}>
              {data.title}
            </Text>
            <Text fontFamily="Inter-Regular" color="muted.500">
              Game Show Quiz
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

          {isFinished && (
            <VStack space={4}>
              {data.questions.map((question) => {
                const { id } = question;
                const isCorrect = correctAnswers[id] === answers[id];

                return (
                  <VStack
                    key={id}
                    bg="gray.100"
                    space={4}
                    p={4}
                    borderRadius="lg"
                    borderWidth={2}
                    borderColor={isCorrect ? "green.600" : "red.600"}
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
                          status = isCorrect ? "CORRECT" : "WRONG";
                        } else if (correctAnswers[id] === choice.id) {
                          status = "CORRECT";
                        }

                        return (
                          <ChoiceCard
                            key={choice.id}
                            choice={choice}
                            onPress={() => handleAnswer(question.id, choice.id)}
                            status={status}
                          />
                        );
                      })}
                    </VStack>
                  </VStack>
                );
              })}

              <Button
                onPress={() => {
                  navigation.goBack();
                }}
                py={4}
                borderRadius="lg"
                colorScheme="orange"
                _text={{ fontFamily: "Inter-Bold" }}
              >
                Go Back
              </Button>
            </VStack>
          )}

          {!isFinished && (
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

                {currentQuestion.photoURL && (
                  <AspectRatio
                    ratio={16 / 9}
                    w="full"
                    borderRadius="lg"
                    overflow="hidden"
                  >
                    <Image
                      source={{ uri: currentQuestion.photoURL }}
                      style={{ width: "100%", height: "100%" }}
                    />
                  </AspectRatio>
                )}

                <Text fontFamily="Inter-Bold" fontSize={18}>
                  {currentQuestion.question}
                </Text>
              </VStack>

              <VStack space={2}>
                {currentQuestion.choices.map((choice) => {
                  const isSelected = answers[currentQuestion.id] === choice.id;

                  return (
                    <ChoiceCard
                      key={choice.id}
                      choice={choice}
                      onPress={() =>
                        handleAnswer(currentQuestion.id, choice.id)
                      }
                      status={isSelected ? "SELECTED" : "DEFAULT"}
                    />
                  );
                })}
              </VStack>
            </VStack>
          )}
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

export default GameShowQuiz;

type ChoiceStatus = "CORRECT" | "WRONG" | "SELECTED" | "DEFAULT";

interface ChoiceProps {
  choice: GameShowTemplate["questions"][0]["choices"][0];
  onPress: () => void;
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

interface ConfettiProps {
  setShowConfetti: (value: boolean) => void;
}

const Confetti: React.FC<ConfettiProps> = ({ setShowConfetti }) => {
  const confettieRef = useRef<AnimatedLottieView>(null);

  useEffect(() => {
    confettieRef.current?.play();
  }, []);

  return (
    <TouchableWithoutFeedback onPress={() => setShowConfetti(false)}>
      <AnimatedLottieView
        ref={confettieRef}
        style={{
          position: "absolute",
          zIndex: 999,
          height: Dimensions.get("window").height,
          width: Dimensions.get("window").width,
        }}
        source={require("../../../assets/lottie/confetti.json")}
        loop={false}
        onAnimationFinish={() => setShowConfetti(false)}
      />
    </TouchableWithoutFeedback>
  );
};

const TryAgain: React.FC<ConfettiProps> = ({ setShowConfetti }) => {
  const confettieRef = useRef<AnimatedLottieView>(null);

  useEffect(() => {
    confettieRef.current?.play();
  }, []);

  return (
    <TouchableWithoutFeedback onPress={() => setShowConfetti(false)}>
      <AnimatedLottieView
        ref={confettieRef}
        style={{
          position: "absolute",
          zIndex: 999,
          height: Dimensions.get("window").height,
          width: Dimensions.get("window").width,
        }}
        source={require("../../../assets/lottie/failed.json")}
        loop={false}
        onAnimationFinish={() => setShowConfetti(false)}
      />
    </TouchableWithoutFeedback>
  );
};
