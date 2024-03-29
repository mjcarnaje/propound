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
import {
  ActivityCollectionNames,
  CollectionNames,
  GameType,
  MatchUpItemType,
  MatchUpTemplate,
} from "@propound/types";
import { useFirestoreDocumentMutation } from "@react-query-firebase/firestore";
import { collection, CollectionReference, doc } from "firebase/firestore";
import React from "react";
import {
  FormProvider,
  SubmitHandler,
  useFieldArray,
  useForm,
} from "react-hook-form";
import { firestore } from "../../../firebase/config";
import { generateId } from "../../../utils/id";
import MatchUpItem from "./MatchUpItem";

const defaultItem: () => MatchUpItemType = () => {
  const id = generateId();
  return {
    photo: {
      id,
      photo: "",
    },
    text: {
      id,
      text: "",
    },
  };
};

interface MatchUpProps {
  activityId: string;
  type: GameType;
  gameData?: MatchUpTemplate | null;
  refetch?: () => void;
  isPublished?: boolean;
}

const MatchUp: React.FC<MatchUpProps> = ({
  activityId,
  type,
  gameData,
  refetch,
  isPublished,
}) => {
  const toast = useToast();

  const gameCollection = collection(
    firestore,
    CollectionNames.ACTIVITIES,
    activityId,
    ActivityCollectionNames.GAMES
  ) as CollectionReference<MatchUpTemplate>;
  const ref = doc(gameCollection, type);
  const { mutate, isLoading } = useFirestoreDocumentMutation(ref);

  const defaultValues: MatchUpTemplate = gameData || {
    __typename: "MATCH_UP",
    id: type,
    type: type,
    title: "",
    instruction: "",
    items: [defaultItem()],
    total: 0,
  };

  const methods = useForm<MatchUpTemplate>({
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
    name: "items",
    keyName: "keyId",
  });

  const onSubmit: SubmitHandler<MatchUpTemplate> = async (data) => {
    await mutate(
      {
        ...data,
        total: data.items.length,
      },
      {
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
          refetch && refetch();
        },
      }
    );
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
              autoComplete="off"
              disabled={isPublished}
              _disabled={{ opacity: 1 }}
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
              disabled={isPublished}
              _disabled={{ opacity: 1 }}
            />
            <FormErrorMessage>
              {errors.instruction && errors.instruction.message}
            </FormErrorMessage>
          </FormControl>
          <VStack spacing={2} w="full">
            {fields.map((field, itemIdx, arr) => (
              <MatchUpItem
                activityId={activityId}
                key={field.keyId}
                error={errors.items?.[itemIdx]}
                itemIdx={itemIdx}
                onRemoveItem={() => remove(itemIdx)}
                onRemoveItemDisabled={arr.length === 1}
                isPublished={isPublished}
              />
            ))}
            {!isPublished && (
              <Box>
                <Button size="sm" onClick={() => append(defaultItem())}>
                  Add Question
                </Button>
              </Box>
            )}
          </VStack>
        </VStack>

        {!isPublished && (
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
        )}
      </chakra.form>
    </FormProvider>
  );
};

export default MatchUp;
