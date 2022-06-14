import {
  Avatar,
  Box,
  Center,
  HStack,
  SimpleGrid,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { useFirestoreQuery } from "@react-query-firebase/firestore";
import { collection, query } from "firebase/firestore";
import React from "react";
import { useParams } from "react-router-dom";
import { firestore } from "../../firebase/config";

const DashboardStudents: React.FC = () => {
  const { id } = useParams();

  const ref = query(collection(firestore, "game", id, "students"));
  const studentsQuery = useFirestoreQuery(["game", id, "students"], ref);

  if (studentsQuery.isLoading) {
    return (
      <Center w="full" py={12}>
        <Spinner />
      </Center>
    );
  }

  const snapshot = studentsQuery.data;
  const students = snapshot.docs.map((docSnapshot) => docSnapshot.data());

  return (
    <Box w="full">
      {students.length === 0 && (
        <Center py={12}>
          <Text>No students have joined this game yet.</Text>
        </Center>
      )}
      <SimpleGrid columns={2} spacing={4}>
        {students.map((student) => (
          <HStack key={student.uid}>
            <Avatar src={student.photoURL} name={student.displayName} />
            <Text>{student.displayName}</Text>
          </HStack>
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default DashboardStudents;
