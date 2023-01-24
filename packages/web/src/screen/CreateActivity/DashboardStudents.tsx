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
  GameType,
} from "@propound/types";
import { getFullName, getGameType, getRomanYearLevel } from "@propound/utils";
import { useFirestoreQuery } from "@react-query-firebase/firestore";
import { collection, query } from "firebase/firestore";
import React, { useState } from "react";
import { QueryKey } from "react-query";
import { useParams } from "react-router-dom";
import Empty from "../../components/svg/EmptySvg";
import { firestore } from "../../firebase/config";
import { formatDate } from "../../utils/date";
//@ts-ignore
import EmptyStudentsSvg from "../../assets/svgs/empty_student.svg?component";
import { round } from "../../utils/number";

const DashboardStudents: React.FC = () => {
  const { id } = useParams();

  const queryKey: QueryKey = [
    CollectionNames.ACTIVITIES,
    id,
    ActivityCollectionNames.STUDENTS,
  ];

  // @ts-ignore
  const ref: any = query(collection(firestore, ...queryKey));

  const resultQuery = useFirestoreQuery<ActivityStudentResultDocType>(
    queryKey,
    ref
  );

  if (resultQuery.isLoading) {
    return (
      <Center w="full" py={12}>
        <Spinner />
      </Center>
    );
  }

  const snapshot = resultQuery.data;
  const results = snapshot?.docs.map((docSnapshot) => docSnapshot.data());

  return (
    <Box w="full">
      {results?.length === 0 && (
        <Center py={12}>
          <Empty
            maxHeight={300}
            title="No students have joined this learning space yet."
            customSvg={EmptyStudentsSvg}
          />
        </Center>
      )}
      <SimpleGrid columns={1} spacing={4}>
        {results?.map((result) => (
          <StudentCard key={result.student.uid} result={result} />
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default DashboardStudents;

interface StudentCardProps {
  result: ActivityStudentResultDocType;
}

const StudentCard: React.FC<StudentCardProps> = ({ result }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { student } = result;
  return (
    <VStack
      key={student.uid}
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
            size="lg"
            src={student.photoURL}
            name={getFullName(student)}
          />
          <VStack spacing={0} align="flex-start">
            <Text fontSize={17} fontWeight="medium">
              {getFullName(student)}
            </Text>
            <Text fontWeight="medium">
              {`${getRomanYearLevel(student.year)}-${student.courseSection}`}
            </Text>
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
          <ResultGameType result={result} gameType={GameType.PRE_TEST} />
          <ResultGameType result={result} gameType={GameType.POST_TEST} />
        </VStack>
      )}
    </VStack>
  );
};

interface ResultGameTypeProps {
  result: ActivityStudentResultDocType;
  gameType: GameType;
}

const ResultGameType: React.FC<ResultGameTypeProps> = ({
  result,
  gameType,
}) => {
  const data = result.scores[gameType];

  return (
    <VStack w="full">
      <HStack w="full">
        <Text fontWeight="bold" fontSize={18}>
          {getGameType(gameType)}
        </Text>
      </HStack>
      <VStack w="full">
        <HStack w="full" bg="gray.100" borderRadius="lg" p={2} flexGrow={1}>
          <Text>Taken count:</Text>
          <Text fontWeight="bold">{data?.scores?.length}</Text>
        </HStack>
        <HStack w="full" bg="gray.100" borderRadius="lg" p={2} flexGrow={1}>
          <Text>Average time:</Text>
          <Text fontWeight="bold">
            {`${round((data?.average?.time || 0) / 1000, 2)} seconds`}
          </Text>
        </HStack>
        <HStack w="full" bg="gray.100" borderRadius="lg" p={2} flexGrow={1}>
          <Text>Average score:</Text>
          <Text fontWeight="bold">{round(data?.average?.score || 0, 2)}</Text>
        </HStack>
        <HStack w="full" bg="gray.100" borderRadius="lg" p={2} flexGrow={1}>
          <Text>Scores:</Text>
          <Text fontWeight="bold">
            {JSON.stringify(data?.scores.map((x) => x.score) || [])
              .replace(/[\[\]"]+/g, "")
              .replace(/,/g, ", ")}
          </Text>
        </HStack>
        <HStack w="full" bg="gray.100" borderRadius="lg" p={2} flexGrow={1}>
          <Text>Latest Date taken: </Text>
          <Text fontWeight="bold">
            {data.latestDate ? formatDate(data.latestDate!) : "N/A"}
          </Text>
        </HStack>
      </VStack>
    </VStack>
  );
};
