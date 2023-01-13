import { AddIcon, DeleteIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  chakra,
  CloseButton,
  Divider,
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
  VStack,
  Wrap,
} from "@chakra-ui/react";
import { MissingWordQuestionType, MissingWordTemplate } from "@propound/types";
import React, { useEffect, useState } from "react";
import { FieldErrors, useFieldArray, useFormContext } from "react-hook-form";
import { generateId } from "../../../utils/id";

interface MissingWordQuestionProps {
  error?: FieldErrors<MissingWordQuestionType>;
  questionIdx: number;
  onRemoveQuestion: () => void;
  onRemoveQuestionDisabled: boolean;
}

const MissingWordQuestion: React.FC<MissingWordQuestionProps> = ({
  error,
  questionIdx,
  onRemoveQuestion,
  onRemoveQuestionDisabled,
}) => {
  const missingModal = useDisclosure();
  const incorrectModal = useDisclosure();
  const inputModal = useDisclosure();
  const [text, setText] = useState("");
  const [inCorrectWord, setInCorrectWord] = useState("");
  const { control, watch, setValue } = useFormContext<MissingWordTemplate>();

  const inCorrectWordsField = useFieldArray({
    control,
    name: `questions.${questionIdx}.incorrectWords`,
    keyName: "keyId",
  });

  const question = watch(`questions.${questionIdx}.question`);

  useEffect(() => {}, [question]);

  return (
    <>
      <HStack w="full" align="flex-start">
        <VStack
          flexGrow={1}
          spacing={4}
          shadow="sm"
          borderRadius={8}
          bg="white"
        >
          <Box p={4} w="full">
            <FormControl isInvalid={!!error?.question}>
              <FormLabel htmlFor={`questions.${questionIdx}.question`}>
                {`Question ${questionIdx + 1}`}
              </FormLabel>

              <HStack align="flex-start">
                <VStack align="flex-start" w="full">
                  <Box
                    contentEditable={true}
                    minH="100px"
                    maxH="300px"
                    overflowY="scroll"
                    userSelect="text"
                    lineHeight="28px"
                    outline="none"
                    px={4}
                    py={3}
                    borderWidth="1px"
                    borderRadius="md"
                    borderColor="gray.300"
                    w="full"
                    onClick={() => {
                      inputModal.onOpen();
                    }}
                  >
                    {question.map((word) => {
                      if (word.isSelected) {
                        return (
                          <chakra.span
                            key={word.id}
                            borderWidth={2}
                            borderColor="orange.500"
                            borderRadius="md"
                            px={1}
                            color="orange.500"
                            cursor="pointer"
                            fontWeight="bold"
                          >
                            {word.text}
                          </chakra.span>
                        );
                      } else {
                        return (
                          <chakra.span key={word.id}>
                            {`${word.text} `}
                          </chakra.span>
                        );
                      }
                    })}
                  </Box>

                  <FormErrorMessage>
                    {error?.question && error.question.message}
                  </FormErrorMessage>
                </VStack>
              </HStack>
            </FormControl>
          </Box>
          <Box w="full">
            <HStack bg="gray.50" p={6} w="full">
              <Box flex={0.2}>
                <Text>Missing Words:</Text>
              </Box>
              <Box flex={0.8}>
                <HStack
                  alignItems="center"
                  flex={0.8}
                  spacing={4}
                  flexWrap="wrap"
                >
                  {question
                    .filter((q) => q.isSelected)
                    .map((q) => {
                      return (
                        <Box
                          key={q.id}
                          bg="gray.100"
                          px={4}
                          py={2}
                          rounded="md"
                        >
                          <Text fontSize="sm" color="gray">
                            {q.text}
                          </Text>
                        </Box>
                      );
                    })}
                  <Box>
                    <Button
                      onClick={() => missingModal.onOpen()}
                      size="xs"
                      leftIcon={<Icon as={AddIcon} />}
                    >
                      Select a word above
                    </Button>
                  </Box>
                </HStack>
              </Box>
            </HStack>
            <Divider />
            <HStack bg="gray.50" p={6} w="full">
              <Box flex={0.2}>
                <Text>Incorrect Words</Text>
              </Box>
              <Wrap flex={0.8} spacing={4}>
                {inCorrectWordsField.fields.map((field, fieldIdx) => {
                  return (
                    <Wrap
                      spacing={0}
                      key={field.keyId}
                      bg="gray.100"
                      pl={4}
                      pr={2}
                      py={2}
                      rounded="md"
                      alignItems="center"
                      onClick={() => inCorrectWordsField.remove(fieldIdx)}
                    >
                      <Text key={field.keyId} mr={2} fontSize="sm" color="gray">
                        {field.text}
                      </Text>
                      <IconButton
                        size="xs"
                        aria-label="remove word"
                        icon={<CloseButton size="sm" />}
                      />
                    </Wrap>
                  );
                })}
                <Wrap>
                  <Button
                    alignSelf="center"
                    onClick={() => incorrectModal.onOpen()}
                    size="xs"
                    leftIcon={<Icon as={AddIcon} />}
                  >
                    Add a new word
                  </Button>
                </Wrap>
              </Wrap>
            </HStack>
          </Box>
        </VStack>
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
      </HStack>

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
              onChange={(e) => setInCorrectWord(e.target.value)}
              value={inCorrectWord}
            />
          </ModalBody>

          <ModalFooter>
            <Button
              mx="auto"
              px={12}
              colorScheme="orange"
              onClick={() => {
                if (inCorrectWord.length > 0) {
                  inCorrectWordsField.append({
                    id: generateId(),
                    text: inCorrectWord,
                    isSelected: false,
                  });
                  incorrectModal.onClose();
                  setInCorrectWord("");
                }
              }}
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
          <ModalHeader>Select a word</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} w="full">
              <Text>
                {question.map((word, index) => {
                  return (
                    <chakra.span
                      key={index}
                      onClick={() => {
                        const copy = [...question];

                        if (word.isSelected) {
                          copy[index].isSelected = false;
                          setValue(`questions.${questionIdx}.question`, copy);
                        } else {
                          copy[index].isSelected = true;
                          setValue(`questions.${questionIdx}.question`, copy);
                        }
                      }}
                      cursor="pointer"
                      _hover={{ color: "orange.600" }}
                      color={word.isSelected ? "orange.600" : "gray.700"}
                      fontWeight={word.isSelected ? "bold" : "normal"}
                    >
                      {`${word.text} `}
                    </chakra.span>
                  );
                })}
              </Text>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button
              mx="auto"
              px={12}
              colorScheme="orange"
              onClick={() => {
                missingModal.onClose();
              }}
            >
              Done
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Modal isOpen={inputModal.isOpen} onClose={inputModal.onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody>
            <FormControl isInvalid={!!error?.question}>
              <FormLabel htmlFor={`questions.${questionIdx}.question`}>
                {`Question ${questionIdx + 1}`}
              </FormLabel>

              <HStack align="flex-start">
                <VStack align="flex-start" w="full">
                  <Textarea
                    id={`questions.${questionIdx}.question`}
                    placeholder="Question"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
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
              onClick={() => {
                inputModal.onClose();
                setValue(
                  `questions.${questionIdx}.question`,
                  text.split(" ").map((word) => {
                    if (question.find((q) => q.text === word)) {
                      return question.find((q) => q.text === word)!;
                    }
                    return {
                      id: generateId(),
                      text: word,
                      isSelected: false,
                    };
                  })
                );
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
