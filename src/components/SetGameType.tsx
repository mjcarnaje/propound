import {
  Box,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";
import { AiOutlinePlus } from "react-icons/ai";
import { GameTemplate, GameType } from "../types/game";
import { toProperCase } from "../utils/stringl";

interface SetGameTypeProps {
  setGameTemplate: React.Dispatch<React.SetStateAction<GameTemplate>>;
}

const SetGameType: React.FC<SetGameTypeProps> = ({ setGameTemplate }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  async function setGameType(template: GameTemplate) {
    setGameTemplate(template);
    onClose();
  }

  const gameTemplates: GameTemplate[] = [
    "GAME_SHOW",
    "MATCH_UP",
    "MISSING_WORD",
  ];

  return (
    <Box p={8}>
      <Button onClick={onOpen} leftIcon={<AiOutlinePlus />} variant="solid">
        Set game
      </Button>

      <Modal isOpen={isOpen} size="2xl" onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Set a game</ModalHeader>
          <ModalCloseButton />
          <ModalBody pt={8} pb={16}>
            <SimpleGrid columns={{ base: 1, md: 3 }} gap={4}>
              {gameTemplates.map((template) => (
                <Button
                  key={template}
                  onClick={() => setGameType(template)}
                  variant="ghost"
                  size="xl"
                  loadingText="Setting game..."
                >
                  {toProperCase(template)}
                </Button>
              ))}
            </SimpleGrid>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default SetGameType;
