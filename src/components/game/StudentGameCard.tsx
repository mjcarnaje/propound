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
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { AcitivityDocType, GameStatus } from "../../types/game";

interface StudentGameCardProps {
  data: AcitivityDocType;
}

const StudentGameCard: React.FC<StudentGameCardProps> = ({ data }) => {
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
      <Box p={4}>
        <Heading as="h4" size="md">
          {data.title}
        </Heading>
        <HStack justify="space-between" mt={4}>
          <HStack>
            <Avatar
              boxSize="8"
              src={data.teacher.photoURL}
              name={data.teacher.displayName}
            />
            <Text fontWeight="medium">{data.teacher.displayName}</Text>
          </HStack>
        </HStack>
      </Box>
    </Box>
  );
};

export default StudentGameCard;
