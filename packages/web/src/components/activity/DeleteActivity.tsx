import { DeleteIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useFirestoreDocumentDeletion } from "@react-query-firebase/firestore";
import { doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { collections } from "../../firebase/config";

interface DeleteActivityProps {
  id: string;
}

const DeleteActivity: React.FC<DeleteActivityProps> = ({ id }) => {
  const toast = useToast();
  const navigate = useNavigate();
  const ref = doc(collections.activities, id);
  const deleteMutation = useFirestoreDocumentDeletion(ref, {
    onError: (error) => {
      toast({
        title: "Error deleting activity",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    },
    onSuccess: () => {
      toast({
        title: "Activity deleted",
        description: "Activity deleted successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      onClose();
      navigate("/");
    },
  });

  const { isOpen, onClose, onOpen } = useDisclosure();

  return (
    <>
      <Box py={2}>
        <Button onClick={onOpen} leftIcon={<DeleteIcon />} colorScheme="red">
          Delete Learning Space
        </Button>
      </Box>
      <Modal isCentered isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete?</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Are you sure you want to delete this learning space?</Text>
          </ModalBody>

          <ModalFooter>
            <HStack>
              <Button variant="ghost">Cancle</Button>
              <Button
                isLoading={deleteMutation.isLoading}
                colorScheme="red"
                mr={3}
                onClick={() => deleteMutation.mutate()}
              >
                Delete
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default DeleteActivity;
