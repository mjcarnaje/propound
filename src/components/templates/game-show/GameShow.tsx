import {
  Box,
  Button,
  Center,
  chakra,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Textarea,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useFirestoreDocumentMutation } from "@react-query-firebase/firestore";
import { collection, doc } from "firebase/firestore";
import React from "react";
import {
  FormProvider,
  SubmitHandler,
  useFieldArray,
  useForm,
} from "react-hook-form";
import { firestore } from "../../../firebase/config";
import {
  GameShowQuestionType,
  GameShowTemplate,
} from "../../../types/game-show";
import { generateId } from "../../../utils/id";
import GameShowQuestion from "./GameShowQuestion";

const defaultQuestion: GameShowQuestionType = {
  id: generateId(),
  question: "",
  answer: "",
  choices: Array.from({ length: 4 }).map(() => ({
    id: generateId(),
    choice: "",
    photoURL: null,
  })),
  photoURL: null,
};

interface GameShowProps {
  activityId: string;
  type: "PRE_TEST" | "POST_TEST";
  gameShowData?: GameShowTemplate | null;
}

const GameShow: React.FC<GameShowProps> = ({
  activityId,
  type,
  gameShowData,
}) => {
  const toast = useToast();

  const gameCollection = collection(
    firestore,
    "game",
    activityId,
    "games"
  ).withConverter<GameShowTemplate>(null);

  const ref = doc(gameCollection, type);
  const { mutate, isLoading } = useFirestoreDocumentMutation(ref);

  const defaultValues = gameShowData || {
    __typename: "GAME_SHOW",
    id: type,
    type: type,
    questions: [defaultQuestion],
  };

  const methods = useForm<GameShowTemplate>({
    defaultValues,
  });

  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
  } = methods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "questions",
    keyName: "keyId",
  });

  const onSubmit: SubmitHandler<GameShowTemplate> = async (data) => {
    await mutate(data, {
      onError: async (error) => {
        toast({
          title: "Error",
          description: error.message,
          status: "error",
        });
      },
      onSuccess: async () => {
        toast({
          title: "Success",
          description: "Game Show saved successfully",
          status: "success",
        });
      },
    });
  };
  return (
    <FormProvider {...methods}>
      <chakra.form w="4xl" onSubmit={handleSubmit(onSubmit)}>
        <VStack spacing={4}>
          <FormControl isInvalid={!!errors.title}>
            <FormLabel htmlFor="title">Title</FormLabel>
            <Input
              id="title"
              placeholder="Title"
              {...register("title", {
                required: "This is required",
                minLength: { value: 4, message: "Minimum length should be 4" },
              })}
            />
            <FormErrorMessage>
              {errors.title && errors.title.message}
            </FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={!!errors.instruction}>
            <FormLabel htmlFor="instruction">Direction</FormLabel>
            <Textarea
              id="instruction"
              placeholder="Direction"
              {...register("instruction", {
                required: "This is required",
                minLength: { value: 4, message: "Minimum length should be 4" },
              })}
            />
            <FormErrorMessage>
              {errors.instruction && errors.instruction.message}
            </FormErrorMessage>
          </FormControl>
          <VStack spacing={6} w="full">
            {fields.map((field, questionIdx, arr) => (
              <GameShowQuestion
                key={field.keyId}
                error={errors.questions?.[questionIdx]}
                questionIdx={questionIdx}
                onRemoveQuestion={() => remove(questionIdx)}
                onRemoveQuestionDisabled={arr.length === 1}
              />
            ))}
            <Box>
              <Button size="sm" onClick={() => append(defaultQuestion)}>
                Add Question
              </Button>
            </Box>
          </VStack>
        </VStack>

        <Center py={8}>
          <Button
            mx="auto"
            size="lg"
            px="16"
            colorScheme="orange"
            isLoading={isLoading}
            loadingText="Saving..."
            type="submit"
          >
            Save
          </Button>
        </Center>
      </chakra.form>
    </FormProvider>
  );
};

export default GameShow;
