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
  Textarea,
  Tooltip,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import { useState } from "react";
import { AiOutlineFileAdd } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { gameCollection, userCollection } from "../firebase/collections";
import { UserDocType } from "../types/user";
import { generateCode, generateId } from "../utils/id";

interface CreateGameProps {
  user: UserDocType;
}

const defaultInput = {
  title: "",
  description: "",
};

const CreateGame: React.FC<CreateGameProps> = ({ user }) => {
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [input, setInputs] = useState(defaultInput);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setInputs({ ...input, [e.target.name]: e.target.value });
  }

  async function createGame() {
    if (input.description.length === 0) {
      setError("Activity name is required");
      return;
    }

    const id = generateId();

    try {
      setLoading(true);
      await setDoc(doc(gameCollection, id), {
        id,
        title: input.title,
        description: input.description,
        code: generateCode(),
        coverPhoto: null,
        teacher: {
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
        },
        studentIds: [],
        status: "DRAFT",
      });

      const userRef = doc(userCollection, user.uid);

      await updateDoc(userRef, {
        createdGames: [...user.createdGames, id],
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

      if (!error) {
        navigate(`/g/${id}`);
      }
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
          <ModalHeader>Create Game-Learning</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack>
              <FormControl isRequired isInvalid={!!error}>
                <FormLabel>Title</FormLabel>
                <Input
                  name="title"
                  value={input.title}
                  onChange={handleChange}
                  placeholder="Game topic"
                />
                {error && <FormErrorMessage>{error}</FormErrorMessage>}
              </FormControl>
              <FormControl isRequired isInvalid={!!error}>
                <FormLabel>Description</FormLabel>
                <Textarea
                  name="description"
                  value={input.description}
                  onChange={handleChange}
                  placeholder="About the lesson"
                />
                {error && <FormErrorMessage>{error}</FormErrorMessage>}
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button
              isLoading={loading}
              onClick={createGame}
              variant="solid"
              colorScheme="orange"
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
