import { Button, Input, useToast, VStack } from "@chakra-ui/react";
import {
  useFirestoreCollectionMutation,
  useFirestoreDocumentMutation,
} from "@react-query-firebase/firestore";
import { collection, doc } from "firebase/firestore";
import React, { useState } from "react";
import { firestore } from "../../firebase/config";
import { useAppSelector } from "../../hooks/redux";
import { selectAuth } from "../../store/reducer/auth";
import { AcitivityDocType, AcitivityStudentDocType } from "../../types/game";

interface JoinGameProps {
  id: string;
  code: string;
  studentIds: string[];
}

const JoinGame: React.FC<JoinGameProps> = ({ id, code, studentIds }) => {
  const { user } = useAppSelector(selectAuth);

  const toast = useToast();
  const activities = collection(firestore, "game").withConverter<
    Partial<AcitivityDocType>
  >(null);

  const studentCollection = collection(
    firestore,
    "game",
    id,
    "students"
  ).withConverter<AcitivityStudentDocType>(null);

  const studentMutation = useFirestoreDocumentMutation(
    doc(studentCollection, user.uid)
  );

  const ref = doc(activities, id);
  const { mutate, isLoading } = useFirestoreDocumentMutation(ref, {
    merge: true,
  });

  const [codeInput, setCodeInput] = useState("");

  async function joinGame() {
    if (codeInput === code) {
      await studentMutation.mutate({
        displayName: user.displayName,
        photoURL: user.photoURL,
        uid: user.uid,
        email: user.email,
        score: 0,
        taken: false,
      });

      await mutate(
        { studentIds: [...studentIds, user.uid] },
        {
          onSuccess: () => {
            toast({
              title: "Success!",
              description: "You have joined the game!",
              status: "success",
              duration: 3000,
              isClosable: true,
            });
          },
        }
      );
    } else {
      toast({
        title: "Error",
        description: "Invalid code",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  }

  return (
    <VStack spacing={4} p={8}>
      <Input value={codeInput} onChange={(e) => setCodeInput(e.target.value)} />
      <Button isLoading={isLoading} onClick={joinGame}>
        Submit
      </Button>
    </VStack>
  );
};

export default JoinGame;
