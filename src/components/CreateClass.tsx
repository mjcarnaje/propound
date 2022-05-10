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
import { classCollection } from "../firebase/collections";
import { UserDocType } from "../types/user";
import { generateId } from "../utils/id";

interface CreateClassProps {
  user: UserDocType;
}

const CreateClass: React.FC<CreateClassProps> = ({ user }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [className, setClassName] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function createClass() {
    if (!className) {
      setError("Class name is required");
      return;
    }

    try {
      setLoading(true);
      await addDoc(classCollection, {
        id: generateId(),
        name: className,
        teacher: {
          uid: user.uid,
          name: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
        },
        students: [],
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
      setClassName("");
    }
  }

  return (
    <>
      <Tooltip label="Create class">
        <IconButton
          onClick={onOpen}
          icon={<AiOutlineFileAdd fontSize="1.5rem" />}
          aria-label="Search"
        />
      </Tooltip>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create class</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl isRequired isInvalid={!!error}>
              <FormLabel>Class name</FormLabel>
              <Input
                value={className}
                onChange={(e) => {
                  if (error) {
                    setError(null);
                  }
                  setClassName(e.target.value);
                }}
                placeholder="Class name"
              />
              {error && <FormErrorMessage>{error}</FormErrorMessage>}
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button
              isLoading={loading}
              onClick={createClass}
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

export default CreateClass;
