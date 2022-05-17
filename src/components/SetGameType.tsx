import {
  Box,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Tooltip,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { GameType } from "../types/game";
import { toProperCase } from "../utils/stringl";

interface SetGameTypeProps {}

const SetGameType: React.FC<SetGameTypeProps> = () => {
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();

  async function setGameType(game: GameType) {
    navigate(`/g/c/${game}`);
    onClose();
  }

  const games: GameType[] = ["GAME_SHOW", "MATCH_UP", "MISSING_WORD"];

  return (
    <Box p={8}>
      <Tooltip label="Set game">
        <Button onClick={onOpen} leftIcon={<AiOutlinePlus />} variant="solid">
          Set game
        </Button>
      </Tooltip>

      <Modal isOpen={isOpen} size="2xl" onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Set a game</ModalHeader>
          <ModalCloseButton />
          <ModalBody pt={8} pb={16}>
            <SimpleGrid columns={{ base: 1, md: 3 }} gap={4}>
              {games.map((game) => (
                <Button
                  key={game}
                  onClick={() => {
                    setGameType(game);
                    onClose();
                  }}
                  variant="ghost"
                  size="xl"
                  loadingText="Setting game..."
                >
                  {toProperCase(game)}
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
