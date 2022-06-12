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
import GameShowChoice from "./GameShowChoice";

interface GameShowQuestionProps {
  field: FieldArrayWithId<GameShowTemplate, "questions", "keyId">;
  error: FieldErrors<GameShowQuestionType>;
  questionIdx: number;
}

const GameShowQuestion: React.FC<GameShowQuestionProps> = ({
  field,
  error,
  questionIdx,
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
    <VStack spacing={4} w="full" shadow="sm" borderRadius={8} p={4} bg="white">
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
        {fields.map((field, choiceIdx) => (
          <GameShowChoice
            key={field.keyId}
            choiceId={field.id}
            error={error?.choices?.[choiceIdx]}
            questionIdx={questionIdx}
            choiceIdx={choiceIdx}
          />
        ))}
      </SimpleGrid>
    </VStack>
  );
};

export default GameShowQuestion;
