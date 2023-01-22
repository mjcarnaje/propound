import AnimatedLottieView from "lottie-react-native";
import {
  Button,
  Center,
  HStack,
  Modal,
  Text,
  useDisclose,
  VStack,
} from "native-base";
import React, { useEffect, useRef, useState } from "react";
import { Dimensions, TouchableWithoutFeedback } from "react-native";

interface ResultModalProps {
  modal: ReturnType<typeof useModalState>;
}

const ResultModal: React.FC<ResultModalProps> = ({ modal }) => {
  const [show, setShow] = useState(false);
  const { isOpen, onClose } = modal.disclose;

  useEffect(() => {
    if (!!modal.modalData) {
      setShow(true);
    }
  }, [modal.modalData]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        onClose();
        modal.setModalData(null);
      }}
    >
      {modal.modalData && (
        <>
          {show && modal.modalData?.status === "PASS" && (
            <Confetti setShowConfetti={setShow} />
          )}
          {show && modal.modalData?.status === "FAIL" && (
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
                    modal.modalData.status === "PASS" ? "green.600" : "red.600"
                  }
                >
                  {modal.modalData.status === "PASS"
                    ? "Congratulations!"
                    : "Oops!"}
                </Text>
                <Text textAlign="center" fontFamily="Inter-Regular">
                  You have{" "}
                  {modal.modalData.status === "PASS" ? "passed" : "failed"} the
                  quiz
                </Text>
              </VStack>
              <HStack w="full">
                <Center flexGrow={1}>
                  <Text
                    fontSize={28}
                    fontFamily="Inter-Bold"
                    color={
                      modal.modalData.status === "PASS"
                        ? "green.600"
                        : "red.600"
                    }
                  >
                    {modal.modalData.score}
                  </Text>
                  <Text fontSize={12} fontFamily="Inter-Medium">
                    SCORE
                  </Text>
                </Center>
                <Center flexGrow={1}>
                  <HStack alignItems="center" space={1}>
                    <Text fontSize={28} fontFamily="Inter-Bold">
                      {modal.modalData.time}
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
                  modal.setModalData(null);
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
  );
};

export default ResultModal;

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

interface ModalData {
  status: "PASS" | "FAIL";
  score: string;
  time: string;
}

export const useModalState = () => {
  const [modalData, setModalData] = React.useState<ModalData | null>(null);
  const disclose = useDisclose();

  return {
    modalData,
    setModalData,
    disclose,
  };
};
