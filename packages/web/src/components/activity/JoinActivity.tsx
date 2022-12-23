import { Button, Heading, Input, useToast, VStack } from "@chakra-ui/react";
import { useFirestoreDocumentMutation } from "@react-query-firebase/firestore";
import { collection, doc } from "firebase/firestore";
import React, { useState } from "react";
import { firestore } from "../../firebase/config";
import { useAppSelector } from "../../hooks/redux";
import { selectAuth } from "../../store/reducer/auth";

interface JoinActivityProps {
  id: string;
  code: string;
  studentIds: string[];
}

export const JoinActivity: React.FC<JoinActivityProps> = ({
  id,
  code,
  studentIds,
}) => {
  const { user } = useAppSelector(selectAuth);

  const toast = useToast();
  const activities = collection(firestore, "activity");
  const studentCollection = collection(firestore, "activity", id, "students");

  const studentMutation = useFirestoreDocumentMutation(
    doc(studentCollection, user?.uid)
  );

  const ref = doc(activities, id);
  const { mutate, isLoading } = useFirestoreDocumentMutation(ref, {
    merge: true,
  });

  const [codeInput, setCodeInput] = useState("");

  async function joinGame() {
    if (!user) return;

    if (codeInput === code) {
      await studentMutation.mutate({
        student: {
          displayName: user.displayName,
          photoURL: user.photoURL,
          uid: user.uid,
          email: user.email,
        },
        scores: {
          PRE_TEST: {
            baseScore: 0,
            takenCount: 0,
            score: 0,
            date: null,
          },
          POST_TEST: {
            baseScore: 0,
            takenCount: 0,
            score: 0,
            date: null,
          },
        },
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
    <VStack maxW="container.md" mx="auto" spacing={4} p={8}>
      <Heading fontFamily="Inter">Join Activity ({code})</Heading>
      <Input
        value={codeInput}
        placeholder="Please enter code.."
        onChange={(e) => setCodeInput(e.target.value)}
        autoComplete="off"
      />
      <Button isLoading={isLoading} onClick={joinGame}>
        Join
      </Button>
    </VStack>
  );
};
