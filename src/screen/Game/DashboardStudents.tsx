import {
  Avatar,
  Box,
  Center,
  HStack,
  SimpleGrid,
  Spinner,
  Text,
  useToast,
} from "@chakra-ui/react";
import { getDocs, query } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { gameSubCollection } from "../../firebase/collections";
import { GameStudentDocType } from "../../types/game";

const DashboardStudents: React.FC = () => {
  const { id } = useParams();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState<GameStudentDocType[]>([]);

  async function getStudents() {
    try {
      setLoading(true);
      const q = query(gameSubCollection<GameStudentDocType>(id, "student"));
      const querySnapshot = await getDocs(q);

      const res: GameStudentDocType[] = [];
      querySnapshot.forEach((doc) => {
        res.push(doc.data());
      });
      setStudents(res);
    } catch (error) {
      toast({
        title: "Something went wrong",
        description: error.message,
        status: "error",
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getStudents();
  }, []);

  if (loading) {
    return (
      <Center py={8}>
        <Spinner />
      </Center>
    );
  }

  return (
    <Box py={6}>
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
