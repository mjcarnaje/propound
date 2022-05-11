import { Avatar, Box, Heading, HStack, Text } from "@chakra-ui/react";
import { GameDocType } from "../../types/game";

interface GameCardProps {
  data: GameDocType;
}

const GameCard: React.FC<GameCardProps> = ({ data }) => {
  return (
    <Box
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
      <HStack mt={4}>
        <Avatar
          boxSize="8"
          src={data.teacher.photoURL}
          name={data.teacher.name}
        />
        <Text fontWeight="medium">{data.teacher.name}</Text>
      </HStack>
    </Box>
  );
};

export default GameCard;
