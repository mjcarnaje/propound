import {
  Avatar,
  Box,
  Center,
  HStack,
  SimpleGrid,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useFirestoreQuery } from "@react-query-firebase/firestore";
import { collection, query } from "firebase/firestore";
import React from "react";
import { useParams } from "react-router-dom";
import Empty from "../../components/svg/EmptySvg";
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
          <Empty
            maxHeight={300}
            title="No students have joined this learning space yet."
          />
        </Center>
      )}
      <SimpleGrid columns={2} spacing={4}>
        {students.map((student) => (
          <HStack w="full" key={student.uid} justify="space-between">
            <HStack flexGrow={1} spacing={4}>
              <Avatar src={student.photoURL} name={student.displayName} />
              <VStack spacing={0} align="flex-start">
                <Text fontWeight="medium">{student.displayName}</Text>
                <Text fontStyle="initial">{student.email}</Text>
              </VStack>
            </HStack>
            <Box>
              <Text fontWeight="medium">{student.score}</Text>
            </Box>
          </HStack>
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default DashboardStudents;
