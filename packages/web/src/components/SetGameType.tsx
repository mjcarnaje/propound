import { Button, SimpleGrid, Text, VStack } from "@chakra-ui/react";
import { GameTemplate } from "../types/game";
import { toProperCase } from "../utils/string";

interface SetGameTypeProps {
  setGameTemplate: React.Dispatch<React.SetStateAction<GameTemplate | null>>;
}

const SetGameType: React.FC<SetGameTypeProps> = ({ setGameTemplate }) => {
  async function setGameType(template: GameTemplate) {
    setGameTemplate(template);
  }

  const gameTemplates: GameTemplate[] = [
    "GAME_SHOW",
    "MATCH_UP",
    "MISSING_WORD",
  ];

  return (
    <VStack spacing={8} py={12}>
      <Text fontSize={22} fontWeight="semibold">
        Choose game type
      </Text>
      <SimpleGrid columns={{ base: 1, md: 3 }} gap={4}>
        {gameTemplates.map((template) => (
          <Button
            key={template}
            onClick={() => setGameType(template)}
            variant="outline"
            size="xl"
          >
            {toProperCase(template)}
          </Button>
        ))}
      </SimpleGrid>
    </VStack>
  );
};

export default SetGameType;
