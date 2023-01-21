import { CheckIcon, DeleteIcon } from "@chakra-ui/icons";
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
  VStack,
} from "@chakra-ui/react";
import { GameShowChoiceType, GameShowTemplate } from "@propound/types";
import React, { ChangeEvent, useEffect } from "react";
import { FieldErrors, useFormContext, useWatch } from "react-hook-form";
import { BsImage } from "react-icons/bs";
import { useParams } from "react-router-dom";
import useStorage from "../../../hooks/useStorage";
import { checkImage } from "../../../utils/misc";
import { getLetter } from "../../../utils/string";

interface GameShowChoiceProps {
  error?: FieldErrors<GameShowChoiceType>;
  choiceId: string;
  questionIdx: number;
  choiceIdx: number;
  onRemoveChoice: () => void;
  onRemoveChoiceDisabled: boolean;
  isPublished?: boolean;
}

const GameShowChoice: React.FC<GameShowChoiceProps> = ({
  error,
  choiceId,
  questionIdx,
  choiceIdx,
  onRemoveChoice,
  onRemoveChoiceDisabled,
  isPublished,
}) => {
  const { id } = useParams();
  const { register, control, setValue } = useFormContext<GameShowTemplate>();
  const { uploading, url: choicePhotoURL, uploadFile } = useStorage();

  async function fileChangeHandler(e: ChangeEvent<HTMLInputElement>) {
    const file = checkImage(e);
    if (!file) return;
    await uploadFile(file, `${id}/choices/${file.name}`);
  }

  useEffect(() => {
    if (choicePhotoURL) {
      setValue(
        `questions.${questionIdx}.choices.${choiceIdx}.photoURL`,
        choicePhotoURL
      );
    }
  }, [choicePhotoURL]);

  const photoURL = useWatch({
    control,
    name: `questions.${questionIdx}.choices.${choiceIdx}.photoURL`,
  });

  const answerId = useWatch({
    control,
    name: `questions.${questionIdx}.answer`,
  });

  const isAnswer = answerId === choiceId;

  return (
    <Box
      position="relative"
      w="full"
      borderRadius={8}
      px={4}
      pt={4}
      bg="white"
      borderWidth={2}
      borderColor={isAnswer ? "green.500" : "gray.100"}
    >
      <FormControl isInvalid={!!error?.choice}>
        <HStack spacing={1} align="center">
          <FormLabel
            htmlFor={`questions.${questionIdx}.choices.${choiceIdx}.choice`}
            fontWeight="semibold"
          >
            {`${getLetter(choiceIdx)}`}
          </FormLabel>
          <Box>
            {photoURL ? (
              <AspectRatio
                borderWidth={1}
                borderRadius={4}
                overflow="hidden"
                cursor="pointer"
                w="40px"
                ratio={1}
                mr={2}
              >
                <Image src={photoURL} alt="choice photo" objectFit="cover" />
              </AspectRatio>
            ) : (
              <>
                <input
                  hidden
                  id={`questions.${questionIdx}.choices.${choiceIdx}.photoURL`}
                  type="file"
                  name="file"
                  onChange={fileChangeHandler}
                  disabled={isPublished}
                />
              </>
            )}
          </Box>

          <VStack align="flex-start" w="full">
            <Input
              id={`questions.${questionIdx}.choices.${choiceIdx}.choice`}
              placeholder="choice"
              {...register(
                `questions.${questionIdx}.choices.${choiceIdx}.choice`
              )}
              autoComplete="off"
              disabled={isPublished}
              _disabled={{ opacity: 1 }}
            />
            <FormErrorMessage>
              {error?.choice && error.choice.message}
            </FormErrorMessage>
          </VStack>
        </HStack>
      </FormControl>
      {!isPublished ? (
        <HStack spacing={2} justify="flex-end" py={2}>
          <IconButton
            cursor="pointer"
            colorScheme="green"
            variant={isAnswer ? "solid" : "ghost"}
            aria-label="Set as answer"
            icon={<Icon as={CheckIcon} />}
            size="sm"
            onClick={() => {
              setValue(
                `questions.${questionIdx}.answer`,
                isAnswer ? null : choiceId
              );
            }}
          />
          <IconButton
            cursor="pointer"
            as="label"
            htmlFor={`questions.${questionIdx}.choices.${choiceIdx}.photoURL`}
            isLoading={uploading}
            colorScheme="orange"
            variant="ghost"
            aria-label="Upload choice image"
            icon={<Icon as={BsImage} />}
            size="sm"
          />
          <IconButton
            cursor="pointer"
            disabled={onRemoveChoiceDisabled}
            colorScheme="orange"
            variant="ghost"
            aria-label="Delete choice"
            icon={<Icon as={DeleteIcon} />}
            size="sm"
            onClick={() => {
              if (isAnswer) {
                setValue(`questions.${questionIdx}.answer`, null);
              }
              onRemoveChoice();
            }}
          />
        </HStack>
      ) : (
        <Box py={2} />
      )}
    </Box>
  );
};

export default GameShowChoice;
