import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Tooltip,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { addDoc } from "firebase/firestore";
import { useState } from "react";
import { AiOutlineFileAdd } from "react-icons/ai";
import { gameCollection } from "../firebase/collections";
import { UserDocType } from "../types/user";
import { generateCode, generateId } from "../utils/id";

interface CreateGameProps {
  user: UserDocType;
}

const CreateGame: React.FC<CreateGameProps> = ({ user }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [gameName, setGameName] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function CreateGame() {
    if (!gameName) {
      setError("Game name is required");
      return;
    }

    try {
      setLoading(true);
      await addDoc(gameCollection, {
        id: generateId(),
        name: gameName,
        code: generateCode(),
        teacher: {
          uid: user.uid,
          name: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
        },
        students: [],
        status: "DRAFT",
      });
    } catch (err) {
      toast({
        title: "Something went wrong",
        description: err.message,
        status: "error",
      });
    } finally {
      onClose();
      setLoading(false);
      setGameName("");
    }
  }

  return (
    <>
      <Tooltip label="Create game">
        <IconButton
          onClick={onOpen}
          icon={<AiOutlineFileAdd fontSize="1.5rem" />}
          aria-label="Create game"
        />
      </Tooltip>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create game</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl isRequired isInvalid={!!error}>
              <FormLabel>Game name</FormLabel>
              <Input
                value={gameName}
                onChange={(e) => {
                  if (error) {
                    setError(null);
                  }
                  setGameName(e.target.value);
                }}
                placeholder="Game name"
              />
              {error && <FormErrorMessage>{error}</FormErrorMessage>}
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button
              isLoading={loading}
              onClick={CreateGame}
              variant="solid"
              colorScheme="purple"
              mr={3}
            >
              Save
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CreateGame;
