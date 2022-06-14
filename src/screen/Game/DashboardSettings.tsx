import {
  AspectRatio,
  Box,
  Button,
  Center,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Image,
  Input,
  Spinner,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import {
  useFirestoreDocument,
  useFirestoreDocumentMutation,
} from "@react-query-firebase/firestore";
import { doc } from "firebase/firestore";
import { useEffect } from "react";
import { SubmitHandler, useForm, useWatch } from "react-hook-form";
import { useParams } from "react-router-dom";
import { firestore } from "../../firebase/config";
import useStorage from "../../hooks/useStorage";
import { AcitivityDocType } from "../../types/game";

const DashboardSettings = () => {
  const { id } = useParams();
  const toast = useToast();
  const { url, uploading, uploadFile } = useStorage();

  const ref = doc(firestore, "game", id).withConverter<AcitivityDocType>(null);
  const activity = useFirestoreDocument(["game", id], ref);
  const { mutate, isLoading } = useFirestoreDocumentMutation(ref);

  const { setValue, reset, control, register, handleSubmit } =
    useForm<AcitivityDocType>({
      defaultValues: {
        title: "",
        description: "",
        coverPhoto: null,
      },
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

  const onSubmit: SubmitHandler<AcitivityDocType> = async (data) => {
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
          <Heading fontSize="4xl">Settings</Heading>
          <Text>Press Save settings at the end to save</Text>
        </Box>
        <FormControl id="title">
          <FormLabel>Title</FormLabel>
          <Input defaultValue="title.." {...register("title")} />
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
          <Input defaultValue="description.." {...register("description")} />
        </FormControl>
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
