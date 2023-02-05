import { Button, SimpleGrid, Text, VStack } from "@chakra-ui/react";
import {
  ActivityCollectionNames,
  CollectionNames,
  GameDocTemplate,
  GameTemplate,
  GameType,
} from "@propound/types";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useState } from "react";
import { firestore } from "../firebase/config";
import { toProperCase } from "../utils/string";

interface SetGameTypeProps {
  id: string;
  setGameTemplate: React.Dispatch<React.SetStateAction<GameTemplate | null>>;
  refetch?: () => Promise<void>;
}

const SetGameType: React.FC<SetGameTypeProps> = ({
  id,
  setGameTemplate,
  refetch,
}) => {
  async function setGameType(template: GameTemplate) {
    setGameTemplate(template);
  }
  const [copying, setCopying] = useState(false);

  const gameTemplates: GameTemplate[] = [
    "GAME_SHOW",
    "MATCH_UP",
    "MISSING_WORD",
  ];

  async function copyPreGame() {
    try {
      setCopying(true);
      const preGameRef = doc(
        firestore,
        CollectionNames.ACTIVITIES,
        id,
        ActivityCollectionNames.GAMES,
        GameType.PRE_TEST
      );
      const preGameSnap = await getDoc(preGameRef);
      if (preGameSnap.exists()) {
        const preGameData = preGameSnap.data() as GameDocTemplate;
        const postGameRef = doc(
          firestore,
          CollectionNames.ACTIVITIES,
          id,
          ActivityCollectionNames.GAMES,
          GameType.POST_TEST
        );
        await setDoc(postGameRef, {
          ...preGameData,
          id: GameType.POST_TEST,
        });
      }
      refetch && refetch();
      setCopying(false);
    } catch (err) {
      console.error(err);
      setCopying(false);
    }
  }

  return (
    <VStack spacing={8} py={12}>
      <Text fontSize={22} fontWeight="semibold">
        Choose quiz type
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
      {refetch && (
        <Button
          colorScheme="orange"
          onClick={copyPreGame}
          variant="solid"
          size="xl"
          isLoading={copying}
        >
          Copy Pre-quiz
        </Button>
      )}
    </VStack>
  );
};

export default SetGameType;
