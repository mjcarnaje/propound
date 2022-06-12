import {
  Avatar,
  Box,
  Heading,
  HStack,
  Tag,
  TagProps,
  Text,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { AcitivityDocType, GameStatus } from "../../types/game";

interface GameCardProps {
  data: AcitivityDocType;
}

const GameCard: React.FC<GameCardProps> = ({ data }) => {
  const navigate = useNavigate();

  const statusColors: Record<GameStatus, TagProps["colorScheme"]> = {
    DRAFT: "gray",
    PUBLISHED: "green",
  };

  return (
    <Box
      onClick={() => navigate(`/g/${data.id}/`)}
      transition="all 0.2s"
      _hover={{ bg: "gray.50", shadow: "md" }}
      cursor="pointer"
      bg="white"
      px={8}
      py={4}
      rounded="md"
      shadow="sm"
    >
      <Heading as="h4" size="md">
        {data.name}
      </Heading>
      <HStack>
        <Text fontWeight="medium">Code:</Text>
        <Text>{data.code}</Text>
      </HStack>
      <HStack justify="space-between" mt={4}>
        <HStack>
          <Avatar
            boxSize="8"
            src={data.teacher.photoURL}
            name={data.teacher.displayName}
          />
          <Text fontWeight="medium">{data.teacher.displayName}</Text>
        </HStack>
        <Tag size="sm" variant="solid" colorScheme={statusColors[data.status]}>
          {data.status}
        </Tag>
      </HStack>
    </Box>
  );
};

export default GameCard;
