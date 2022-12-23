import {
  Button,
  Container,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Stack,
  Textarea,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { doc, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MainLayout } from "../components/layout/MainLayout";
import { activityCollection, userCollection } from "../firebase/collections";
import { useAppSelector } from "../hooks/redux";
import { selectAuth } from "../store/reducer/auth";
import { generateCode, generateId } from "../utils/id";
// @ts-ignore
import CreateActivitySvg from "../assets/svgs/create_activity.svg?component";

const defaultInput = {
  title: "",
  description: "",
};

interface CreateLearningSpaceProps {}

const CreateLearningSpace: React.FC<CreateLearningSpaceProps> = () => {
  const { user } = useAppSelector(selectAuth);
  const navigate = useNavigate();
  const disclosure = useDisclosure();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [input, setInputs] = useState(defaultInput);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setInputs({ ...input, [e.target.name]: e.target.value });
  }

  async function createActivity() {
    if (input.description.length === 0) {
      setError("Activity name is required");
      return;
    }

    if (!user) {
      toast({
        status: "error",
        title: "You are not logged in",
      });
      return;
    }

    const id = generateId();

    try {
      setLoading(true);
      await setDoc(doc(activityCollection, id), {
        id,
        title: input.title,
        description: input.description,
        code: `${id}-${generateCode()}`,
        coverPhoto: "",
        teacher: {
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
        },
        studentIds: [],
        status: "DRAFT",
        createdAt: serverTimestamp(),
      });

      const userRef = doc(userCollection, user.uid);

      await updateDoc(userRef, {
        createdGames: [...user.createdGames, id],
      });
    } catch (err: any) {
      toast({
        title: "Something went wrong",
        description: err.message,
        status: "error",
      });
    } finally {
      setLoading(false);

      if (!error) {
        navigate(`/g/${id}`);
      }
    }
  }

  return (
    <MainLayout>
      <Container maxW="container.lg" py={12}>
        <VStack spacing={10} justifyContent="center" alignItems="center" py={6}>
          <CreateActivitySvg style={{ maxHeight: 224 }} />
          <Heading
            fontFamily="Inter"
            letterSpacing="tighter"
            fontWeight="extrabold"
            textAlign="center"
          >
            Create a New Learning Space
          </Heading>
        </VStack>
        <Stack
          mx="auto"
          maxW="container.md"
          w="full"
          direction={{ base: "column", lg: "row" }}
          spacing={{ base: "4", lg: "6" }}
        >
          <VStack spacing={8} w="full">
            <FormControl isRequired isInvalid={!!error}>
              <FormLabel>Title</FormLabel>
              <Input
                name="title"
                value={input.title}
                onChange={handleChange}
                placeholder="Title"
                autoComplete="off"
              />
              {error && <FormErrorMessage>{error}</FormErrorMessage>}
            </FormControl>
            <FormControl isRequired isInvalid={!!error}>
              <FormLabel>Description</FormLabel>
              <Textarea
                name="description"
                value={input.description}
                onChange={handleChange}
                placeholder="About the lesson"
              />
              {error && <FormErrorMessage>{error}</FormErrorMessage>}
            </FormControl>
            <Button
              isLoading={loading}
              onClick={createActivity}
              variant="solid"
              colorScheme="orange"
              size="lg"
              px={12}
            >
              Save
            </Button>
          </VStack>
        </Stack>
      </Container>
    </MainLayout>
  );
};

export default CreateLearningSpace;
