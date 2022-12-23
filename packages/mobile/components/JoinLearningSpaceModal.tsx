import {
  collection,
  CollectionReference,
  doc,
  DocumentReference,
  getDoc,
  getDocs,
  query,
  QuerySnapshot,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import {
  Button,
  Input,
  Modal,
  Text,
  useDisclose,
  useToast,
  VStack,
} from "native-base";
import React from "react";
import { firestore } from "../configs/firebase";
import { useAuthStore } from "../store/auth";
import {
  AcitivityDocType,
  AcitivityStudentDocType,
  UserActivityResultDocType,
} from "../types/game";
import { UserDocType } from "../types/user";

interface JoinLearningSpaceModalProps {
  disclose: ReturnType<typeof useDisclose>;
}

const JoinLearningSpaceModal: React.FC<JoinLearningSpaceModalProps> = ({
  disclose,
}) => {
  const toast = useToast();
  const { user, setEnrolledGames } = useAuthStore();
  const [code, setCode] = React.useState("");
  const [isJoining, setIsJoining] = React.useState(false);
  const { isOpen, onClose } = disclose;

  async function joinSpace() {
    setIsJoining(true);

    try {
      const [activityId] = code.split("-");

      const q = query(
        collection(firestore, "activity"),
        where("id", "==", activityId),
        where("code", "==", code),
        where("status", "==", "PUBLISHED")
      );

      const docSnap = (await getDocs(q)) as QuerySnapshot<AcitivityDocType>;

      if (docSnap.empty) {
        toast.show({
          title: "Error",
          description: "Invalid code",
        });

        return;
      }

      const space = docSnap.docs[0].data();

      if (space) {
        const userRef = doc(
          collection(firestore, "user") as CollectionReference<UserDocType>,
          user?.uid
        );

        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();

          if (userData) {
            const enrolledGames = userData.enrolledGames;

            if (enrolledGames.includes(activityId)) {
              toast.show({
                title: "You're already enrolled",
                description: "Sorry, you are already enrolled in this game",
              });

              setCode("");
              onClose();

              return;
            }

            await updateDoc(userRef, {
              enrolledGames: [...userData.enrolledGames, activityId],
            });

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

            await setDoc(studentRef, {
              status: {
                preGameDone: false,
                postGameDone: false,
                learningDone: false,
              },
              student: {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
                photoURL: user.photoURL,
              },
              scores: {
                PRE_TEST: {
                  scores: [],
                  average: {
                    score: null,
                    time: null,
                  },
                  baseDate: null,
                  latestDate: null,
                  latestScore: null,
                },
                POST_TEST: {
                  scores: [],
                  average: {
                    score: null,
                    time: null,
                  },
                  baseDate: null,
                  latestDate: null,
                  latestScore: null,
                },
              },
            });

            await setDoc(studentUserRef, {
              activityId,
              status: {
                preGameDone: false,
                postGameDone: false,
                learningDone: false,
              },
              scores: {
                PRE_TEST: {
                  scores: [],
                  average: {
                    score: null,
                    time: null,
                  },
                  baseDate: null,
                  latestDate: null,
                  latestScore: null,
                },
                POST_TEST: {
                  scores: [],
                  average: {
                    score: null,
                    time: null,
                  },
                  baseDate: null,
                  latestDate: null,
                  latestScore: null,
                },
              },
            });

            setEnrolledGames([...enrolledGames, activityId]);

            setCode("");
            onClose();

            toast.show({
              title: "Joined space",
              description: "You  have successfully joined the learning space",
            });
          }
        } else {
          toast.show({
            title: "Error",
            description: "User not found",
          });
        }
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsJoining(false);
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Modal.Content px={4} py={8} w="90%" borderRadius="3xl">
        <VStack space={4} alignItems="center">
          <Text
            fontFamily="Inter-Bold"
            fontSize={24}
            textAlign="center"
            color="muted.700"
          >
            Learing Space Code
          </Text>
          <Input
            fontFamily="Inter-Regular"
            placeholder="Enter code"
            value={code}
            onChangeText={(text) => setCode(text)}
            colorScheme="orange"
            borderRadius="xl"
            _focus={{ borderColor: "orange.400", backgroundColor: "orange.50" }}
            w="85%"
          />
          <Text fontFamily="Inter-Regular" textAlign="center" w="80%">
            Ask your teacher for the code to join their learning space, then
            enter.
          </Text>
          <Button
            isLoading={isJoining}
            onPress={joinSpace}
            colorScheme="orange"
            _text={{ fontFamily: "Inter-Bold" }}
            borderRadius="xl"
            px={8}
          >
            Join
          </Button>
        </VStack>
      </Modal.Content>
    </Modal>
  );
};

export default JoinLearningSpaceModal;
