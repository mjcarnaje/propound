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
  VStack,
} from "@chakra-ui/react";
import { GameShowQuestionType, GameShowTemplate } from "@propound/types";
import React, { ChangeEvent, useEffect } from "react";
import {
  FieldErrors,
  useFieldArray,
  useFormContext,
  useWatch,
} from "react-hook-form";
import { BsImage } from "react-icons/bs";
import { useParams } from "react-router-dom";
import useStorage from "../../../hooks/useStorage";
import { generateId } from "../../../utils/id";
import { checkImage } from "../../../utils/misc";
import GameShowChoice from "./GameShowChoice";

interface GameShowQuestionProps {
  error?: FieldErrors<GameShowQuestionType>;
  questionIdx: number;
  onRemoveQuestion: () => void;
  onRemoveQuestionDisabled: boolean;
  isPublished?: boolean;
}

const GameShowQuestion: React.FC<GameShowQuestionProps> = ({
  error,
  questionIdx,
  onRemoveQuestion,
  onRemoveQuestionDisabled,
  isPublished,
}) => {
  const { id } = useParams();
  const { uploading, url: questionPhotoURL, uploadFile } = useStorage();

  const { register, control, setValue } = useFormContext<GameShowTemplate>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: `questions.${questionIdx}.choices`,
    keyName: "keyId",
  });

  async function fileChangeHandler(e: ChangeEvent<HTMLInputElement>) {
    const file = checkImage(e);
    if (!file) return;
    await uploadFile(file, `${id}/${file.name}`);
  }

  useEffect(() => {
    if (questionPhotoURL) {
      setValue(`questions.${questionIdx}.photoURL`, questionPhotoURL);
    }
  }, [questionPhotoURL]);

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

          <HStack align="flex-start">
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
                    id={`questions.${questionIdx}.photoURL`}
                    type="file"
                    name="file"
                    onChange={fileChangeHandler}
                    disabled={isPublished}
                  />
                  <IconButton
                    cursor={isPublished ? "auto" : "pointer"}
                    as="label"
                    htmlFor={`questions.${questionIdx}.photoURL`}
                    isLoading={uploading}
                    colorScheme="orange"
                    variant="ghost"
                    aria-label="Upload choice image"
                    fontSize="20px"
                    icon={<Icon as={BsImage} />}
                    disabled={isPublished}
                    _disabled={{ opacity: 1 }}
                  />
                </>
              )}
            </Box>
            <VStack align="flex-start" w="full">
              <Input
                id={`questions.${questionIdx}.question`}
                placeholder="question"
                {...register(`questions.${questionIdx}.question`, {
                  required: `Question ${questionIdx + 1} is required.`,
                })}
                autoComplete="off"
                disabled={isPublished}
                _disabled={{ opacity: 1 }}
              />
              <FormErrorMessage>
                {error?.question && error.question.message}
              </FormErrorMessage>
            </VStack>
          </HStack>
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
              isPublished={isPublished}
            />
          ))}
        </SimpleGrid>
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
      )}
    </HStack>
  );
};

export default GameShowQuestion;
