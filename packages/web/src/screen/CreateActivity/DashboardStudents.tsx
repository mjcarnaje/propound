import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Center,
  HStack,
  IconButton,
  SimpleGrid,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import {
  ActivityCollectionNames,
  ActivityStudentResultDocType,
  CollectionNames,
} from "@propound/types";
import { getFullName } from "@propound/utils";
import { useFirestoreQuery } from "@react-query-firebase/firestore";
import { collection, query } from "firebase/firestore";
import moment from "moment";
import React, { useState } from "react";
import { QueryKey } from "react-query";
import { useParams } from "react-router-dom";
import Empty from "../../components/svg/EmptySvg";
import { firestore } from "../../firebase/config";
import { firebaseDateToDate } from "../../utils/date";
//@ts-ignore
import EmptyStudentsSvg from "../../assets/svgs/empty_student.svg?component";

const DashboardStudents: React.FC = () => {
  const { id } = useParams();

  const queryKey: QueryKey = [
    CollectionNames.ACTIVITIES,
    id,
    ActivityCollectionNames.STUDENTS,
  ];

  // @ts-ignore
  const ref: any = query(collection(firestore, ...queryKey));

  const studentsQuery = useFirestoreQuery<ActivityStudentResultDocType>(
    queryKey,
    ref
  );

  if (studentsQuery.isLoading) {
    return (
      <Center w="full" py={12}>
        <Spinner />
      </Center>
    );
  }

  const snapshot = studentsQuery.data;
  const students = snapshot?.docs.map((docSnapshot) => docSnapshot.data());

  return (
    <Box w="full">
      {students?.length === 0 && (
        <Center py={12}>
          <Empty
            maxHeight={300}
            title="No students have joined this learning space yet."
            customSvg={EmptyStudentsSvg}
          />
        </Center>
      )}
      <SimpleGrid columns={1} spacing={4}>
        {students?.map((s) => (
          <StudentCard key={s.student.uid} student={s} />
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default DashboardStudents;

interface StudentCardProps {
  student: ActivityStudentResultDocType;
}

const StudentCard: React.FC<StudentCardProps> = ({ student }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <VStack
      key={student.student.uid}
      bg="gray.50"
      p={8}
      borderRadius="2xl"
      w="full"
      justify="space-between"
      spacing={8}
    >
      <HStack w="full" justify="space-between" alignItems="center">
        <HStack w="full" flexGrow={1} spacing={4}>
          <Avatar
            src={student.student.photoURL}
            name={getFullName(student.student)}
          />
          <VStack spacing={0} align="flex-start">
            <Text fontWeight="medium">{getFullName(student.student)}</Text>
            <Text fontStyle="initial">{student.student.email}</Text>
          </VStack>
        </HStack>
        <IconButton
          cursor="pointer"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Delete"
          as={!isOpen ? ChevronDownIcon : ChevronUpIcon}
          size="sm"
        />
      </HStack>
      {isOpen && (
        <VStack spacing={8} w="full">
          <VStack w="full">
            <HStack w="full">
              <Text fontWeight="bold" fontSize={18}>
                Pre game
              </Text>
            </HStack>
            <VStack w="full">
              <HStack
                w="full"
                bg="gray.100"
                borderRadius="lg"
                p={2}
                flexGrow={1}
              >
                <Text>Taken count:</Text>
                <Text fontWeight="bold">
                  {student.scores["PRE_TEST"]?.scores?.length}
                </Text>
              </HStack>
              <HStack
                w="full"
                bg="gray.100"
                borderRadius="lg"
                p={2}
                flexGrow={1}
              >
                <Text>Average time:</Text>
                <Text fontWeight="bold">
                  {student.scores["PRE_TEST"]?.average.time
                    ? student.scores["PRE_TEST"].average.time / 1000
                    : 0}{" "}
                  seconds
                </Text>
              </HStack>
              <HStack
                w="full"
                bg="gray.100"
                borderRadius="lg"
                p={2}
                flexGrow={1}
              >
                <Text>Average score:</Text>
                <Text fontWeight="bold">
                  {student.scores["PRE_TEST"]?.average?.score}
                </Text>
              </HStack>
              <HStack
                w="full"
                bg="gray.100"
                borderRadius="lg"
                p={2}
                flexGrow={1}
              >
                <Text>Scores:</Text>
                <Text fontWeight="bold">
                  {JSON.stringify(
                    student.scores["PRE_TEST"]?.scores.map((x) => x.score) || []
                  )
                    .replace(/[\[\]"]+/g, "")
                    .replace(/,/g, ", ")}
                </Text>
              </HStack>
              <HStack
                w="full"
                bg="gray.100"
                borderRadius="lg"
                p={2}
                flexGrow={1}
              >
                <Text>Latest Date taken: </Text>
                <Text fontWeight="bold">
                  {student.scores["PRE_TEST"].latestDate
                    ? moment(
                        firebaseDateToDate(
                          student.scores["PRE_TEST"].latestDate
                        )
                      ).format("lll")
                    : "N/A"}
                </Text>
              </HStack>
            </VStack>
          </VStack>
          <VStack w="full">
            <HStack w="full">
              <Text fontWeight="bold" fontSize={18}>
                Post game
              </Text>
            </HStack>
            <VStack w="full">
              <HStack
                w="full"
                bg="gray.100"
                borderRadius="lg"
                p={2}
                flexGrow={1}
              >
                <Text>Taken count:</Text>
                <Text fontWeight="bold">
                  {student.scores["POST_TEST"]?.scores.length}
                </Text>
              </HStack>
              <HStack
                w="full"
                bg="gray.100"
                borderRadius="lg"
                p={2}
                flexGrow={1}
              >
                <Text>Average time:</Text>
                <Text fontWeight="bold">
                  {student.scores["POST_TEST"]?.average?.time
                    ? student.scores["POST_TEST"].average.time / 1000
                    : 0}{" "}
                  seconds
                </Text>
              </HStack>
              <HStack
                w="full"
                bg="gray.100"
                borderRadius="lg"
                p={2}
                flexGrow={1}
              >
                <Text>Average score:</Text>
                <Text fontWeight="bold">
                  {student.scores["POST_TEST"]?.average?.score}
                </Text>
              </HStack>
              <HStack
                w="full"
                bg="gray.100"
                borderRadius="lg"
                p={2}
                flexGrow={1}
              >
                <Text>Scores:</Text>
                <Text fontWeight="bold">
                  {JSON.stringify(
                    student?.scores["POST_TEST"]?.scores?.map((x) => x.score) ||
                      []
                  )
                    .replace(/[\[\]"]+/g, "")
                    .replace(/,/g, ", ")}
                </Text>
              </HStack>
              <HStack
                w="full"
                bg="gray.100"
                borderRadius="lg"
                p={2}
                flexGrow={1}
              >
                <Text>Latest Date taken: </Text>
                <Text fontWeight="bold">
                  {student.scores["POST_TEST"]?.latestDate
                    ? moment(
                        firebaseDateToDate(
                          student.scores["POST_TEST"].latestDate
                        )
                      ).format("lll")
                    : "N/A"}
                </Text>
              </HStack>
            </VStack>
          </VStack>
        </VStack>
      )}
    </VStack>
  );
};
