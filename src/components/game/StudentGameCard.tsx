import {
  AspectRatio,
  Avatar,
  Box,
  Heading,
  HStack,
  Image,
  Tag,
  TagProps,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { AcitivityDocType, GameStatus } from "../../types/game";

interface StudentGameCardProps {
  data: AcitivityDocType;
  isJoined: boolean;
}

const StudentGameCard: React.FC<StudentGameCardProps> = ({
  data,
  isJoined,
}) => {
  const navigate = useNavigate();

  return (
    <Box
      onClick={() => navigate(`/t/${data.id}/`)}
      transition="all 0.2s"
      _hover={{ bg: "gray.50", shadow: "md" }}
      cursor="pointer"
      bg="white"
      rounded="lg"
      shadow="sm"
      overflow="hidden"
    >
      <AspectRatio bg="gray.50" maxW="400px" ratio={16 / 9}>
        {!!data.coverPhoto ? (
          <Image src={data.coverPhoto} objectFit="cover" />
        ) : (
          <Box>
            <Text>No cover photo</Text>
          </Box>
        )}
      </AspectRatio>
      <VStack align="flex-start" spacing={4} p={4}>
        <Box>
          <Heading as="h4" size="md">
            {data.title}
          </Heading>
          <Text fontStyle="italic">
            {`${data.description.slice(0, 120)}...`}
          </Text>
        </Box>
        <HStack w="full" justify="space-between">
          <HStack>
            <Avatar
              boxSize="8"
              src={data.teacher.photoURL}
              name={data.teacher.displayName}
            />
            <Text fontWeight="medium">{data.teacher.displayName}</Text>
          </HStack>
          {isJoined && <Tag colorScheme="green">Joined</Tag>}
        </HStack>
      </VStack>
    </Box>
  );
};

export default StudentGameCard;
