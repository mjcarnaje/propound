import {
  Button,
  Container,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  HStack,
  Input,
  SimpleGrid,
  Stack,
  Text,
  Textarea,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { ActivityDocType, AuthoredDocType, Role } from "@propound/types";
import {
  deleteDoc,
  doc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MainLayout } from "../components/layout/MainLayout";
import { useAppSelector } from "../hooks/redux";
import { selectAuth } from "../store/reducer/auth";
import { generateCode, generateId } from "../utils/id";
// @ts-ignore
import CreateActivitySvg from "../assets/svgs/create_activity.svg?component";
import ActivityCardCoverPhoto from "../components/activity/ActivityCardCoverPhoto";
import { collections } from "../firebase/config";

const defaultInput = {
  title: "",
  description: "",
};

interface CreateLearningSpaceProps {}

const CreateLearningSpace: React.FC<CreateLearningSpaceProps> = () => {
  const { user } = useAppSelector(selectAuth);
  const navigate = useNavigate();
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
      await setDoc(doc(collections.activities, id), {
        id,
        title: input.title,
        description: input.description,
        code: `${id}-${generateCode()}`,
        coverPhoto: "",
        author: {
          uid: user.uid,
          email: user.email,
          photoURL: user.photoURL,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
        },
        studentIds: [],
        status: "DRAFT",
        createdAt: serverTimestamp(),
      });

      const userRef = doc(collections.users, user.uid);

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
        {user && <LearningSpaceTemplates user={user} />}
      </Container>
    </MainLayout>
  );
};

export default CreateLearningSpace;

interface LearningSpaceTemplatesProps {
  user: AuthoredDocType;
}

const LearningSpaceTemplates: React.FC<LearningSpaceTemplatesProps> = ({
  user,
}) => {
  const [activities, setActivities] = useState<ActivityDocType[]>([]);

  async function getData() {
    try {
      const q = query<ActivityDocType>(
        collections.activities,
        where("author.role", "==", "Admin")
      );
      const docs = await getDocs(q);
      setActivities(docs.docs.map((d) => d.data()));
    } catch (err) {
      console.error("Something went wrong!");
    }
  }

  async function onDelete(id: string) {
    try {
      await deleteDoc(doc(collections.activities, id));
      setActivities((prev) => prev.filter((x) => x.id !== id));
    } catch (err) {
      console.error("Something went wrong!");
    }
  }

  useEffect(() => {
    getData();
  }, []);

  return (
    <SimpleGrid columns={2} gap={4} py={8}>
      {activities.map((data) => (
        <LearningSpaceTemplate
          key={data.id}
          data={data}
          user={user}
          onDelete={onDelete}
        />
      ))}
    </SimpleGrid>
  );
};

interface LearningSpaceTemplateProps {
  data: ActivityDocType;
  user: AuthoredDocType;
  onDelete: (id: string) => Promise<void>;
}

const LearningSpaceTemplate: React.FC<LearningSpaceTemplateProps> = ({
  data,
  user,
  onDelete,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [deleting, setDeleting] = useState<boolean>(false);
  const navigate = useNavigate();

  async function onUseTemplate() {
    setLoading(true);
    const id = generateId();
    await setDoc(doc(collections.activities, id), {
      id,
      title: data.title,
      description: data.description,
      code: `${id}-${generateCode()}`,
      coverPhoto: "",
      author: {
        uid: user.uid,
        email: user.email,
        photoURL: user.photoURL,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
      studentIds: [],
      status: "DRAFT",
      createdAt: serverTimestamp(),
    });
    const userRef = doc(collections.users, user.uid);
    await updateDoc(userRef, {
      createdGames: [...user.createdGames, id],
    });
    navigate(`/g/${id}`);
  }

  return (
    <VStack
      w="full"
      transition="all 0.2s"
      bg="white"
      rounded="2xl"
      shadow="sm"
      overflow="hidden"
      p={4}
      spacing={8}
      alignItems="start"
    >
      <ActivityCardCoverPhoto data={data} maxW="none" />

      <VStack align="flex-start" w="full" spacing={2}>
        <Heading
          fontFamily="Inter"
          color="gray.800"
          as="h4"
          fontWeight="bold"
          size="md"
        >
          {data.title}
        </Heading>
        <Text
          fontStyle="italic"
          fontSize="17px"
          whiteSpace="pre-line"
          wordBreak="break-word"
          noOfLines={8}
        >
          {data.description}
        </Text>
      </VStack>

      <HStack justify="center" w="full">
        {user.role === Role.Admin && (
          <Button
            color="red.500"
            isLoading={deleting}
            onClick={async () => {
              setDeleting(true);
              await onDelete(data.id);
              setDeleting(false);
            }}
          >
            Delete
          </Button>
        )}
        <Button
          colorScheme="orange"
          isLoading={loading}
          onClick={onUseTemplate}
        >
          Use this template
        </Button>
      </HStack>
    </VStack>
  );
};
