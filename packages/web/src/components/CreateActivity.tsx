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
import { AuthoredDocType, Role, TeacherDocType } from "@propound/types";
import { doc, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { useState } from "react";
import { AiOutlineFileAdd } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { collections } from "../firebase/config";
import { generateCode, generateId } from "../utils/id";

interface CreateActivityProps {
  user: AuthoredDocType;
  button?: (props: ReturnType<typeof useDisclosure>) => JSX.Element;
}

const defaultInput = {
  title: "",
  description: "",
};

export const CreateActivity: React.FC<CreateActivityProps> = ({
  user,
  button,
}) => {
  const navigate = useNavigate();
  const disclosure = useDisclosure();
  const { isOpen, onOpen, onClose } = disclosure;
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [input, setInputs] = useState(defaultInput);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setInputs({ ...input, [e.target.name]: e.target.value });
  }

  async function createActivity() {
    if (input.description.length === 0) {
      setError("Activity name is required");
      return;
    }

    const id = generateId();

    try {
      setLoading(true);
      await setDoc(doc(collections.activities, id), {
        id,
        title: input.title,
        description: input.description,
        code: `${id}-${generateCode()}`,
        coverPhoto: "",
        author: user,
        studentIds: [],
        status: "DRAFT",
        createdAt: serverTimestamp(),
      });

      const userRef = doc(collections.users, user.uid);

      await updateDoc(userRef, {
        createdGames: [...user.createdGames, id],
      });
    } catch (err: any) {
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
      <Tooltip label="Create Learning Space">
        {button ? (
          button(disclosure)
        ) : (
          <IconButton
            onClick={onOpen}
            icon={<AiOutlineFileAdd fontSize="1.5rem" />}
            aria-label="Create Learning Space"
          />
        )}
      </Tooltip>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create Learning Space</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack>
              <FormControl isRequired isInvalid={!!error}>
                <FormLabel>Title</FormLabel>
                <Input
                  name="title"
                  value={input.title}
                  onChange={handleChange}
                  placeholder="Title"
                  autoComplete="off"
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
                  autoComplete="off"
                />
                {error && <FormErrorMessage>{error}</FormErrorMessage>}
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button
              isLoading={loading}
              onClick={createActivity}
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
