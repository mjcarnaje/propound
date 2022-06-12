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
import { doc, setDoc } from "firebase/firestore";
import React from "react";
import {
  FormProvider,
  SubmitHandler,
  useFieldArray,
  useForm,
} from "react-hook-form";
import { gameSubCollection } from "../../../firebase/collections";
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
  gameShowData?: GameShowTemplate | null;
}

const GameShow: React.FC<GameShowProps> = ({ activityId, gameShowData }) => {
  const toast = useToast();

  const defaultValues = gameShowData || {
    __typename: "GAME_SHOW",
    id: "PRE_TEST",
    type: "PRE_TEST",
    questions: [defaultQuestion],
  };

  const methods = useForm<GameShowTemplate>({
    defaultValues,
  });

  const {
    control,
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = methods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "questions",
    keyName: "keyId",
  });

  const onSubmit: SubmitHandler<GameShowTemplate> = async (data) => {
    try {
      await setDoc(
        doc(gameSubCollection<GameShowTemplate>(activityId, "games"), data.id),
        data
      );
    } catch (err) {
      toast({
        title: "Error",
        status: "error",
        duration: 3000,
      });
    }
  };
  return (
    <FormProvider {...methods}>
      <chakra.form w="4xl" onSubmit={handleSubmit(onSubmit)}>
        <VStack spacing={4}>
          <FormControl isInvalid={!!errors.title}>
            <FormLabel htmlFor="title">Title</FormLabel>
            <Input
              id="title"
              placeholder="title"
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
            <FormLabel htmlFor="instruction">Instruction</FormLabel>
            <Textarea
              id="instruction"
              placeholder="instruction"
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
            {fields.map((field, questionIdx) => (
              <GameShowQuestion
                key={field.keyId}
                field={field}
                error={errors.questions?.[questionIdx]}
                questionIdx={questionIdx}
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
            isLoading={isSubmitting}
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
