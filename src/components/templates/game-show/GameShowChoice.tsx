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
  useToast,
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
  questionIdx: number;
  choiceIdx: number;
}

const GameShowChoice: React.FC<GameShowChoiceProps> = ({
  error,
  questionIdx,
  choiceIdx,
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

  return (
    <Box w="full" shadow="xs" borderRadius={8} p={4} bg="white">
      <FormControl isInvalid={!!error?.choice}>
        <HStack>
          <FormLabel
            htmlFor={`questions.${questionIdx}.choices.${choiceIdx}.choice`}
          >
            {getLetter(choiceIdx)}
          </FormLabel>
          {photoURL ? (
            <AspectRatio cursor="pointer" w="40px" ratio={1}>
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
          <Input
            id={`questions.${questionIdx}.choices.${choiceIdx}.choice`}
            placeholder="choice"
            {...register(
              `questions.${questionIdx}.choices.${choiceIdx}.choice`
            )}
          />
          <FormErrorMessage>
            {error?.choice && error.choice.message}
          </FormErrorMessage>
        </HStack>
      </FormControl>
    </Box>
  );
};

export default GameShowChoice;
