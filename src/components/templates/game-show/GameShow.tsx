import {
  Box,
  Button,
  chakra,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import React from "react";
import {
  FormProvider,
  SubmitHandler,
  useFieldArray,
  useForm,
} from "react-hook-form";
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

const GameShow: React.FC = () => {
  const methods = useForm<GameShowTemplate>({
    defaultValues: {
      id: generateId(),
      type: "PRE_TEST",
      questions: [defaultQuestion],
    },
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

  const onSubmit: SubmitHandler<GameShowTemplate> = (data) => {
    console.log(data);
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
          <VStack w="full">
            {fields.map((field, questionIdx) => (
              <GameShowQuestion
                key={field.keyId}
                field={field}
                error={errors.questions?.[questionIdx]}
                questionIdx={questionIdx}
              />
            ))}
            <Box>
              <Button onClick={() => append(defaultQuestion)}>
                Add Question
              </Button>
            </Box>
          </VStack>
        </VStack>

        <Button
          mt={4}
          colorScheme="orange"
          isLoading={isSubmitting}
          type="submit"
        >
          Done
        </Button>
      </chakra.form>
    </FormProvider>
  );
};

export default GameShow;
