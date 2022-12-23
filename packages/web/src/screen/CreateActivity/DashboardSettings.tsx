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
  Switch,
  Text,
  Textarea,
  useToast
} from "@chakra-ui/react";
import {
  useFirestoreDocument,
  useFirestoreDocumentMutation
} from "@react-query-firebase/firestore";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { ChangeEvent, useEffect } from "react";
import { Controller, SubmitHandler, useForm, useWatch } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import DeleteActivity from "../../components/activity/DeleteActivity";
import { firestore } from "../../firebase/config";
import useStorage from "../../hooks/useStorage";
import { AcitivityDocType } from "../../types/game";

const DashboardSettings = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const toast = useToast();
  const { url, uploading, uploadFile } = useStorage();

  // @ts-ignore
  const ref: any = doc(firestore, "activity", id);
  const activity = useFirestoreDocument(["activity", id], ref);

  const { mutate, isLoading } = useFirestoreDocumentMutation(ref);

  const { setValue, watch, reset, control, register, handleSubmit } =
    useForm<AcitivityDocType>({
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

  async function canPublish() {
    // @ts-ignore
    const preGameRef = doc(firestore, "activity", id, "games", "PRE_TEST");
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
    const materialsRef = collection(firestore, "activity", id, "materials");
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
    const postGameRef = doc(firestore, "activity", id, "games", "POST_TEST");
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

        <FormControl display="flex" alignItems="center">
          <FormLabel htmlFor="publish" mb="0">
            Publish
          </FormLabel>
          <Controller
            name="status"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <Switch
                {...field}
                isChecked={watch("status") === "PUBLISHED"}
                onChange={async () => {
                  const toPublish = watch("status") === "DRAFT";
                  if (toPublish) {
                    const can = await canPublish();
                    if (!can) return;
                  }
                  setValue("status", toPublish ? "PUBLISHED" : "DRAFT");
                }}
              />
            )}
          />
        </FormControl>
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
