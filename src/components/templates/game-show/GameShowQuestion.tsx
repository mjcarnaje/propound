import { AddIcon, DeleteIcon } from "@chakra-ui/icons";
import {
  AspectRatio,
  Box,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Icon,
  IconButton,
  Image,
  Input,
  SimpleGrid,
  useToast,
  VStack,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import {
  FieldArrayWithId,
  FieldErrors,
  useFieldArray,
  useFormContext,
  useWatch,
} from "react-hook-form";
import { BsImage } from "react-icons/bs";
import { useParams } from "react-router-dom";
import useStorage from "../../../hooks/useStorage";
import {
  GameShowQuestionType,
  GameShowTemplate,
} from "../../../types/game-show";
import { generateId } from "../../../utils/id";
import GameShowChoice from "./GameShowChoice";

interface GameShowQuestionProps {
  error: FieldErrors<GameShowQuestionType>;
  questionIdx: number;
  onRemoveQuestion: () => void;
  onRemoveQuestionDisabled: boolean;
}

const GameShowQuestion: React.FC<GameShowQuestionProps> = ({
  error,
  questionIdx,
  onRemoveQuestion,
  onRemoveQuestionDisabled,
}) => {
  const { id } = useParams();
  const { url, uploading, uploadFile } = useStorage();
  const toast = useToast();

  const { register, control, setValue } = useFormContext<GameShowTemplate>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: `questions.${questionIdx}.choices`,
    keyName: "keyId",
  });

  async function fileChangeHandler(e) {
    const file = e.target.files[0];

    if (file.type.split("/")[0] !== "image") {
      toast({
        title: "Only images are allowed",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    await uploadFile(file, `${id}/${file.name}`);
  }

  useEffect(() => {
    if (url) {
      setValue(`questions.${questionIdx}.photoURL`, url);
    }
  }, [url]);

  const photoURL = useWatch({
    control,
    name: `questions.${questionIdx}.photoURL`,
  });

  return (
    <HStack w="full" align="flex-start">
      <VStack
        flexGrow={1}
        spacing={4}
        shadow="sm"
        borderRadius={8}
        p={4}
        bg="white"
      >
        <FormControl isInvalid={!!error?.question}>
          <FormLabel htmlFor={`questions.${questionIdx}.question`}>
            {`Question ${questionIdx + 1}`}
          </FormLabel>

          <HStack>
            <Box>
              {photoURL ? (
                <AspectRatio
                  borderRadius={4}
                  overflow="hidden"
                  cursor="pointer"
                  w="40px"
                  ratio={1}
                >
                  <Image src={photoURL} alt="choice photo" objectFit="cover" />
                </AspectRatio>
              ) : (
                <>
                  <input
                    hidden
                    id="fileUpload"
                    type="file"
                    name="file"
                    onChange={fileChangeHandler}
                  />
                  <IconButton
                    cursor="pointer"
                    as="label"
                    htmlFor="fileUpload"
                    isLoading={uploading}
                    colorScheme="orange"
                    variant="ghost"
                    aria-label="Upload choice image"
                    fontSize="20px"
                    icon={<Icon as={BsImage} />}
                  />
                </>
              )}
            </Box>
            <Input
              id={`questions.${questionIdx}.question`}
              placeholder="question"
              {...register(`questions.${questionIdx}.question`)}
            />
          </HStack>
          <FormErrorMessage>
            {error?.question && error.question.message}
          </FormErrorMessage>
        </FormControl>
        <SimpleGrid w="full" columns={2} spacing={4}>
          {fields.map((field, choiceIdx, arr) => (
            <GameShowChoice
              key={field.keyId}
              choiceId={field.id}
              error={error?.choices?.[choiceIdx]}
              questionIdx={questionIdx}
              choiceIdx={choiceIdx}
              onRemoveChoice={() => remove(choiceIdx)}
              onRemoveChoiceDisabled={arr.length === 1}
            />
          ))}
        </SimpleGrid>
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
        <IconButton
          cursor="pointer"
          variant="ghost"
          aria-label="Add choice"
          icon={<Icon as={AddIcon} />}
          onClick={() => {
            append({
              id: generateId(),
              choice: "",
              photoURL: null,
            });
          }}
        />
      </VStack>
    </HStack>
  );
};

export default GameShowQuestion;
