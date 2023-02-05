import {
  ActivityCollectionNames,
  ActivityDocType,
  ActivityStudentResultDocType,
  CollectionNames,
  StudentCollectionNames,
  StudentResultDocType,
} from "@propound/types";
import { defaultStatusAndScore } from "@propound/utils";
import {
  doc,
  DocumentReference,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { Button, Input, Modal, Text, useDisclose, VStack } from "native-base";
import React from "react";
import Toast from "react-native-toast-message";
import { collections, firestore } from "../configs/firebase";
import { useAuthStore } from "../store/auth";

interface JoinLearningSpaceModalProps {
  disclose: ReturnType<typeof useDisclose>;
}

const JoinLearningSpaceModal: React.FC<JoinLearningSpaceModalProps> = ({
  disclose,
}) => {
  const { user, setEnrolledGames } = useAuthStore();
  const [code, setCode] = React.useState("");
  const [isJoining, setIsJoining] = React.useState(false);
  const { isOpen, onClose } = disclose;

  async function joinSpace() {
    setIsJoining(true);

    try {
      const [activityId] = code.split("-");

      const q = query<ActivityDocType>(
        collections.activities,
        where("id", "==", activityId),
        where("code", "==", code),
        where("status", "==", "PUBLISHED")
      );

      const docSnap = await getDocs(q);

      if (docSnap.empty) {
        Toast.show({
          type: "error",
          text1: "Invalid code",
          text2: "Sorry, the code you entered is invalid",
        });

        return;
      }

      const space = docSnap.docs[0].data();

      if (space) {
        const userRef = doc(collections.users, user?.uid);

        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();

          if (userData) {
            const enrolledGames = userData.enrolledGames;

            if (enrolledGames.includes(activityId)) {
              Toast.show({
                type: "error",
                text1: "You're already enrolled",
                text2: "Sorry, you are already enrolled in this quiz",
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
              CollectionNames.ACTIVITIES,
              activityId,
              ActivityCollectionNames.STUDENTS,
              user.uid
            ) as DocumentReference<ActivityStudentResultDocType>;

            const studentUserRef = doc(
              firestore,
              CollectionNames.USERS,
              user.uid,
              StudentCollectionNames.RESULTS,
              activityId
            ) as DocumentReference<StudentResultDocType>;

            await setDoc(studentRef, {
              student: {
                uid: user.uid,
                email: user.email,
                photoURL: user.photoURL,
                firstName: user.firstName,
                lastName: user.lastName,
                courseSection: user.courseSection,
                year: user.year,
              },
              ...defaultStatusAndScore,
            });

            await setDoc(studentUserRef, {
              activityId,
              ...defaultStatusAndScore,
            });

            setEnrolledGames([...enrolledGames, activityId]);

            setCode("");
            onClose();

            Toast.show({
              type: "error",
              text1: "Joined space",
              text2: "You  have successfully joined the learning space",
            });
          }
        } else {
          Toast.show({
            type: "error",
            text1: "Error",
            text2: "User not found",
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
            Learning Space Code
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
