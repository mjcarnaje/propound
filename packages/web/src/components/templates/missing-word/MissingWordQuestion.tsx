import { DeleteIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Center,
  chakra,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Icon,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  Textarea,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { MissingWordQuestionType, MissingWordTemplate } from "@propound/types";
import React from "react";
import { FieldErrors, useFormContext } from "react-hook-form";

interface MissingWordQuestionProps {
  error?: FieldErrors<MissingWordQuestionType>;
  questionIdx: number;
  onRemoveQuestion: () => void;
  onRemoveQuestionDisabled: boolean;
  isPublished?: boolean;
}

const MissingWordQuestion: React.FC<MissingWordQuestionProps> = ({
  error,
  questionIdx,
  onRemoveQuestion,
  onRemoveQuestionDisabled,
  isPublished,
}) => {
  const toast = useToast();
  const inputModal = useDisclosure();
  const missingModal = useDisclosure();
  const incorrectModal = useDisclosure();
  const [incorrectText, setIncorrectText] = React.useState("");
  const { control, watch, setValue, register } =
    useFormContext<MissingWordTemplate>();

  const question = watch(`questions.${questionIdx}.question`);
  const answerIdx = watch(`questions.${questionIdx}.answerIdx`);

  const missingWord =
    answerIdx != null ? question?.split(" ")[answerIdx] : "NONE";
  const incorectWords = watch(`questions.${questionIdx}.incorrect`);

  const Wrapper = question ? Box : Center;

  return (
    <>
      <HStack w="full" align="flex-start">
        <VStack
          flexGrow={1}
          spacing={4}
          shadow="sm"
          borderRadius={8}
          bg="white"
          p={4}
        >
          <Box w="full">
            <FormControl isInvalid={!!error?.question}>
              <FormLabel htmlFor={`questions.${questionIdx}.question`}>
                {`Statement ${questionIdx + 1}`}
              </FormLabel>

              <HStack align="flex-start">
                <VStack align="flex-start" w="full">
                  <Wrapper
                    minH="100px"
                    maxH="300px"
                    lineHeight="28px"
                    px={4}
                    py={3}
                    borderWidth="1px"
                    borderRadius="md"
                    borderColor="gray.300"
                    w="full"
                  >
                    {question ? (
                      question.split(" ").map((word, idx) => {
                        const selected =
                          watch(`questions.${questionIdx}.answerIdx`) === idx;
                        if (selected) {
                          return (
                            <chakra.span
                              key={idx}
                              borderWidth={2}
                              borderColor="orange.500"
                              borderRadius="md"
                              px={1}
                              color="orange.500"
                              cursor={!isPublished ? "pointer" : "default"}
                              fontWeight="bold"
                            >
                              {word}
                            </chakra.span>
                          );
                        } else {
                          return (
                            <chakra.span key={idx}>{`${word} `}</chakra.span>
                          );
                        }
                      })
                    ) : (
                      <Button
                        onClick={() => {
                          inputModal.onOpen();
                        }}
                        size="sm"
                        colorScheme="orange"
                      >
                        Add Statement
                      </Button>
                    )}
                  </Wrapper>

                  <FormErrorMessage>
                    {error?.question && error.question.message}
                  </FormErrorMessage>
                </VStack>
              </HStack>
            </FormControl>
          </Box>
          {question && (
            <HStack>
              <Button
                onClick={() => {
                  if (isPublished) return;
                  inputModal.onOpen();
                }}
                size="sm"
                colorScheme="orange"
                variant="solid"
              >
                Edit Statement
              </Button>
            </HStack>
          )}
          <HStack w="full">
            <Text>
              Missing word:{" "}
              <chakra.span fontWeight="bold" color="orange.500">
                {missingWord}
              </chakra.span>
            </Text>
            <Button
              onClick={() => {
                if (question?.split(" ").length === 1) {
                  toast({
                    title: "Cannot choose missing word",
                    description: "Question must have at least 2 words",
                    status: "warning",
                    duration: 5000,
                    isClosable: true,
                  });
                  return;
                }
                missingModal.onOpen();
              }}
              size="sm"
            >
              Choose word
            </Button>
          </HStack>
          <HStack w="full">
            <Text>
              Incorrect words:{" "}
              <chakra.span fontWeight="bold" color="orange.500">
                {incorectWords?.length ? incorectWords.join(", ") : "NONE"}
              </chakra.span>
            </Text>
            <Button
              onClick={() => {
                incorrectModal.onOpen();
              }}
              size="sm"
            >
              Add words
            </Button>
          </HStack>
        </VStack>
        {!isPublished && (
          <VStack>
            <IconButton
              disabled={onRemoveQuestionDisabled}
              cursor="pointer"
              variant="ghost"
              aria-label="Delete question"
              icon={<Icon as={DeleteIcon} />}
              onClick={onRemoveQuestion}
            />
          </VStack>
        )}
      </HStack>

      <Modal isOpen={inputModal.isOpen} onClose={inputModal.onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalBody pt={6}>
            <FormControl isInvalid={!!error?.question}>
              <HStack align="flex-start">
                <VStack align="flex-start" w="full">
                  <Textarea
                    id={`questions.${questionIdx}.question`}
                    placeholder="Question"
                    {...register(`questions.${questionIdx}.question`)}
                  />
                  <FormErrorMessage>
                    {error?.question && error.question.message}
                  </FormErrorMessage>
                </VStack>
              </HStack>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button
              mx="auto"
              px={12}
              colorScheme="orange"
              onClick={inputModal.onClose}
            >
              Done
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal
        isOpen={missingModal.isOpen}
        onClose={missingModal.onClose}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalBody pt={8}>
            <Text fontSize={14} fontStyle="italic" mb={3}>
              Choose the missing word in the statement below by clicking on it.
            </Text>
            {question.split(" ").map((word, idx) => {
              const selected =
                watch(`questions.${questionIdx}.answerIdx`) === idx;
              if (selected) {
                return (
                  <chakra.span
                    cursor={!isPublished ? "pointer" : "default"}
                    onClick={() => {
                      if (isPublished) return;
                      setValue(`questions.${questionIdx}.answerIdx`, idx);
                    }}
                    key={idx}
                    borderWidth={2}
                    borderColor="orange.500"
                    borderRadius="md"
                    px={1}
                    color="orange.500"
                    fontWeight="bold"
                  >
                    {word}
                  </chakra.span>
                );
              } else {
                return (
                  <chakra.span
                    key={idx}
                    onClick={() => {
                      if (isPublished) return;
                      setValue(`questions.${questionIdx}.answerIdx`, idx);
                    }}
                    cursor={!isPublished ? "pointer" : "default"}
                  >{`${word} `}</chakra.span>
                );
              }
            })}
          </ModalBody>
          <ModalFooter>
            <Button
              mx="auto"
              px={12}
              colorScheme="orange"
              onClick={missingModal.onClose}
            >
              Done
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal
        isOpen={incorrectModal.isOpen}
        onClose={incorrectModal.onClose}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add a new word</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              placeholder="Incorrect word"
              onChange={(e) => setIncorrectText(e.target.value)}
              value={incorrectText}
            />
          </ModalBody>

          <ModalFooter>
            <Button
              mx="auto"
              px={12}
              colorScheme="orange"
              onClick={() => {
                if (incorrectText) {
                  setValue(`questions.${questionIdx}.incorrect`, [
                    ...incorectWords,
                    incorrectText,
                  ]);
                  setIncorrectText("");
                }
                incorrectModal.onClose();
              }}
            >
              Done
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default MissingWordQuestion;
