import {
  AspectRatio,
  Box,
  Button,
  Center,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Stack,
  Switch,
  Text,
  Textarea,
  useDisclosure,
  UseDisclosureReturn,
  useToast,
} from "@chakra-ui/react";
import {
  ActivityCollectionNames,
  ActivityDocType,
  CollectionNames,
  GameStatus,
  GameType,
} from "@propound/types";
import {
  useFirestoreDocument,
  useFirestoreDocumentMutation,
} from "@react-query-firebase/firestore";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { ChangeEvent, useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm, useWatch } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import DeleteActivity from "../../components/activity/DeleteActivity";
import { firestore } from "../../firebase/config";
import useStorage from "../../hooks/useStorage";

const DashboardSettings = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const toast = useToast();
  const { url, uploading, uploadFile } = useStorage();
  const publishDisclosure = useDisclosure();

  // @ts-ignore
  const ref: any = doc(firestore, CollectionNames.ACTIVITIES, id);
  const activity = useFirestoreDocument([CollectionNames.ACTIVITIES, id], ref);

  const { mutate, isLoading } = useFirestoreDocumentMutation(ref);

  const { setValue, watch, reset, control, register, handleSubmit } =
    useForm<ActivityDocType>({
      defaultValues: {
        title: "",
        description: "",
        status: "DRAFT",
      },
    });

  async function fileChangeHandler(e: ChangeEvent<HTMLInputElement>) {
    const file = e?.target?.files?.[0];
    if (!file) return;
    if (file.type.split("/")[0] !== "image") {
      toast({
        title: "Only images are allowed",
        description: "Please select an image file",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    await uploadFile(file, `${id}/${file.name}`);
  }

  async function checkCanPublish() {
    // @ts-ignore
    const preGameRef = doc(
      firestore,
      CollectionNames.ACTIVITIES,
      id,
      ActivityCollectionNames.GAMES,
      GameType.PRE_TEST
    );
    const preGameDoc = await getDoc(preGameRef);

    if (!preGameDoc.exists()) {
      toast({
        title: "Pre-test is not set",
        description: "Please set the pre-test",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return false;
    }

    // @ts-ignore
    const materialsRef = collection(
      firestore,
      CollectionNames.ACTIVITIES,
      id,
      ActivityCollectionNames.MATERIALS
    );
    const materialsDocs = await getDocs(materialsRef);

    if (materialsDocs.docs.length === 0) {
      toast({
        title: "Materials is not set",
        description: "Please set the materials",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return false;
    }

    // @ts-ignore
    const postGameRef = doc(
      firestore,
      CollectionNames.ACTIVITIES,
      id,
      ActivityCollectionNames.GAMES,
      GameType.POST_TEST
    );
    const postGameDoc = await getDoc(postGameRef);

    if (!postGameDoc.exists()) {
      toast({
        title: "Post-test is not set",
        description: "Please set the post-test",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return false;
    }

    return true;
  }

  useEffect(() => {
    if (url) {
      setValue("coverPhoto", url);
    }
  }, [url]);

  const photoURL = useWatch({ control, name: "coverPhoto" });

  useEffect(() => {
    if (activity?.data?.exists()) {
      reset(activity.data.data());
    }
  }, [activity.data]);

  if (activity.isLoading) {
    return (
      <Center py={12}>
        <Spinner />
      </Center>
    );
  }

  if (activity.error) {
    return (
      <Center py={12}>
        <Text>Error, something went wrong!</Text>
      </Center>
    );
  }

  const onSubmit: SubmitHandler<ActivityDocType> = async (data) => {
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
          description: "Activity updated successfully",
          status: "success",
        });
        navigate("/dashboard");
      },
    });
  };

  return (
    <Box as="form" onSubmit={handleSubmit(onSubmit)}>
      <Stack
        spacing="5"
        px={{ base: "4", md: "6" }}
        py={{ base: "5", md: "6" }}
      >
        <Box textAlign="center">
          <Heading fontFamily="Inter" fontSize="4xl">
            Settings
          </Heading>
          <Text>Press Save settings at the end to save</Text>
        </Box>
        <FormControl id="title">
          <FormLabel>Title</FormLabel>
          <Input
            defaultValue="title.."
            {...register("title")}
            autoComplete="off"
          />
        </FormControl>

        <FormControl id="title">
          <FormLabel>Cover Photo</FormLabel>
          {!!photoURL && (
            <AspectRatio
              maxW="600px"
              borderRadius="lg"
              overflow="hidden"
              ratio={16 / 9}
            >
              <Image src={photoURL} alt="naruto" objectFit="contain" />
            </AspectRatio>
          )}
          <Button
            mt={!!photoURL ? "2" : "0"}
            isLoading={uploading}
            loadingText="Uploading.."
            cursor="pointer"
            as="label"
            htmlFor="coverPhoto"
          >
            {`${!!photoURL ? "Change" : "Upload"} Cover Photo`}
          </Button>

          <input
            hidden
            id="coverPhoto"
            type="file"
            name="file"
            onChange={fileChangeHandler}
          />
        </FormControl>

        <FormControl id="description">
          <FormLabel>Description</FormLabel>
          <Textarea
            minH="144px"
            defaultValue="description.."
            {...register("description")}
          />
        </FormControl>

        <HStack>
          <Text>Status:</Text>
          <PublishLearningSpace
            status={watch("status")}
            disclosure={publishDisclosure}
            onPublish={async () => {
              const canPublish = await checkCanPublish();
              if (canPublish) {
                setValue("status", "PUBLISHED");
              }
            }}
          />
        </HStack>

        <DeleteActivity id={id!} />
      </Stack>
      <Flex justify="center" py="4" px={{ base: "4", md: "6" }}>
        <Button isLoading={isLoading} loadingText="" type="submit">
          Save Settings
        </Button>
      </Flex>
    </Box>
  );
};

export default DashboardSettings;

interface PublishLearningSpaceProps {
  status: GameStatus;
  disclosure: UseDisclosureReturn;
  onPublish: () => Promise<void>;
}

function PublishLearningSpace(props: PublishLearningSpaceProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { status, disclosure, onPublish } = props;
  const { isOpen, onOpen, onClose } = disclosure;

  return (
    <>
      {status == "DRAFT" ? (
        <Button colorScheme="orange" size="sm" onClick={onOpen}>
          Publish
        </Button>
      ) : (
        <Text color="green.600" fontWeight="bold">
          Published
        </Text>
      )}
      <Modal isCentered isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            Are you sure you want to publish this learning space?
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>
              Once you publish this learning space, you will not be able to edit{" "}
              <strong>Pre-game</strong> and <strong>Post-game</strong>, but you
              can still edit settings like title, description and cover photo
              and you can still add new learning materials.
            </Text>
            <Text>
              Once you have published this learning space, you will not be able
              to edit the <strong>Pre-game</strong> and{" "}
              <strong>Post-game</strong>, sections, but you can still edit
              settings such as the title, description, and cover photo, and you
              can still add new learning materials.
            </Text>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button
              isLoading={isLoading}
              colorScheme="orange"
              onClick={async () => {
                setIsLoading(true);
                await onPublish();
                onClose();
                setIsLoading(false);
              }}
            >
              Publish
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
