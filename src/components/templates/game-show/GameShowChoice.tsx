import { CheckIcon, DeleteIcon } from "@chakra-ui/icons";
import {
  AspectRatio,
  Box,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Icon,
  IconButton,
  Image,
  Input,
  useToast,
  VStack,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import { FieldErrors, useFormContext, useWatch } from "react-hook-form";
import { BsImage } from "react-icons/bs";
import { useParams } from "react-router-dom";
import useStorage from "../../../hooks/useStorage";
import { GameShowChoiceType, GameShowTemplate } from "../../../types/game-show";
import { getLetter } from "../../../utils/stringl";

interface GameShowChoiceProps {
  error: FieldErrors<GameShowChoiceType>;
  choiceId: string;
  questionIdx: number;
  choiceIdx: number;
  onRemoveChoice: () => void;
  onRemoveChoiceDisabled: boolean;
}

const GameShowChoice: React.FC<GameShowChoiceProps> = ({
  error,
  choiceId,
  questionIdx,
  choiceIdx,
  onRemoveChoice,
  onRemoveChoiceDisabled,
}) => {
  const { id } = useParams();
  const toast = useToast();
  const { register, control, setValue } = useFormContext<GameShowTemplate>();
  const { url, uploading, uploadFile } = useStorage();

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
      setValue(`questions.${questionIdx}.choices.${choiceIdx}.photoURL`, url);
    }
  }, [url]);

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
                  id="fileUpload"
                  type="file"
                  name="file"
                  onChange={fileChangeHandler}
                />
              </>
            )}
          </Box>

          <VStack align="flex-start" w="full">
            <Input
              id={`questions.${questionIdx}.choices.${choiceIdx}.choice`}
              placeholder="choice"
              {...register(
                `questions.${questionIdx}.choices.${choiceIdx}.choice`,
                { required: `Choice ${choiceIdx + 1} is required.` }
              )}
            />
            <FormErrorMessage>
              {error?.choice && error.choice.message}
            </FormErrorMessage>
          </VStack>
        </HStack>
      </FormControl>
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
          htmlFor="fileUpload"
          isLoading={uploading}
          colorScheme="orange"
          variant="ghost"
          aria-label="Upload choice image"
          icon={<Icon as={BsImage} />}
          size="sm"
        />
        <IconButton
          isDisabled={onRemoveChoiceDisabled}
          cursor="pointer"
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
    </Box>
  );
};

export default GameShowChoice;
