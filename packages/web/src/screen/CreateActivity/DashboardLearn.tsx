import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Center,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Progress,
  Select,
  Spinner,
  Text,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";
import {
  ActivityCollectionNames,
  CollectionNames,
  LearningMaterial,
  LearningMaterialType,
} from "@propound/types";
import {
  collection,
  CollectionReference,
  deleteDoc,
  doc,
  DocumentReference,
  getDoc,
  getDocs,
  query,
  setDoc,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { FiTrash2 } from "react-icons/fi";
import { MdAddChart } from "react-icons/md";
import { useParams } from "react-router-dom";
import { LearnMaterialIcon } from "../../components/LearnMaterialIcon";
import { collections, firestore } from "../../firebase/config";
import { useAppSelector } from "../../hooks/redux";
import useStorage from "../../hooks/useStorage";
import { selectAuth } from "../../store/reducer/auth";
import { generateId } from "../../utils/id";
import { round } from "../../utils/number";

const DashboardLearn: React.FC = () => {
  const { user } = useAppSelector(selectAuth);
  const { id } = useParams();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const [saving, setSaving] = useState(false);
  const [fething, setFetching] = useState(false);
  const [type, setType] = useState<"LINK" | "FILE" | null>(null);
  const [inputs, setInputs] = useState({
    title: "",
    url: "",
  });
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [learningMaterials, setLearningMaterials] = useState<
    LearningMaterial[]
  >([]);

  const { progress, url, setUrl, uploading, uploadFile } = useStorage();

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  }

  async function fileChangeHandler(e: any) {
    const file = e.target.files[0];

    const allowedExtensions = ["pdf", "doc", "docx", "ppt", "pptx"];

    if (!allowedExtensions.includes(file.name.split(".")[1])) {
      toast({
        title: "Error",
        description: "File type not supported",
        status: "error",
      });
      return;
    }

    await uploadFile(file, `${id}/${file.name}`);
  }

  async function save() {
    try {
      setSaving(true);
      const gameRef = doc(collections.activities, id);
      const gameDoc = await getDoc(gameRef);

      if (gameDoc.exists()) {
        let materialType: LearningMaterialType;

        if (type === "FILE") {
          if (inputs.url.includes("pdf")) {
            materialType = "PDF";
          } else if (
            inputs.url.includes("doc") ||
            inputs.url.includes("docx")
          ) {
            materialType = "WORD";
          } else if (
            inputs.url.includes("ppt") ||
            inputs.url.includes("pptx")
          ) {
            materialType = "PPT";
          }
        } else {
          materialType = "LINK";
          if (inputs.url.includes("youtube")) {
            materialType = "YOUTUBE";
          }
        }

        const newMaterial = {
          id: generateId(),
          title: inputs.title,
          url: inputs.url,
          // @ts-ignore
          type: materialType,
        };

        await setDoc(
          doc(
            collection(
              firestore,
              CollectionNames.ACTIVITIES,
              id!,
              ActivityCollectionNames.MATERIALS
            ) as CollectionReference<LearningMaterial>,
            newMaterial.id
          ),
          newMaterial
        );

        setLearningMaterials((learningMaterials) => [
          ...learningMaterials,
          newMaterial,
        ]);
      }
      onClose();
    } catch (err: any) {
      toast({
        title: "Something went wrong",
        description: err.message,
        status: "error",
      });
    } finally {
      setInputs({
        title: "",
        url: "",
      });
      setSaving(false);
      setType(null);
    }
  }

  async function getLearningMaterials() {
    try {
      setFetching(true);
      const q = query(
        collection(
          firestore,
          CollectionNames.ACTIVITIES,
          id!,
          ActivityCollectionNames.MATERIALS
        ) as CollectionReference<LearningMaterial>
      );
      const querySnapshot = await getDocs(q);

      const res: LearningMaterial[] = [];
      querySnapshot.forEach((doc) => {
        res.push(doc.data());
      });
      setLearningMaterials(res);
    } catch (err: any) {
      toast({
        title: "Something went wrong",
        description: err.message,
        status: "error",
      });
    } finally {
      setFetching(false);
    }
  }

  useEffect(() => {
    getLearningMaterials();
  }, []);

  useEffect(() => {
    if (url) {
      setInputs((inputs) => ({ ...inputs, url }));
      toast({
        status: "success",
        title: "File uploaded",
        description: "File uploaded successfully",
      });
    }
  }, [url]);

  if (fething) {
    return (
      <Center py={12}>
        <Spinner />
      </Center>
    );
  }

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Learning Material</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack>
              <FormControl>
                <FormLabel>Select a Learning Material</FormLabel>
                <Select
                  onChange={(e) => {
                    setType(e.target.value as "LINK" | "FILE");
                  }}
                  placeholder="Select Type"
                >
                  <option value="LINK">Link</option>
                  <option value="FILE">File</option>
                </Select>
              </FormControl>

              {type && (
                <FormControl>
                  <FormLabel>Title</FormLabel>
                  <Input
                    name="title"
                    value={inputs.title}
                    onChange={handleChange}
                    placeholder="Title"
                    autoComplete="off"
                  />
                </FormControl>
              )}

              {type === "FILE" && (
                <>
                  <input
                    hidden
                    id="fileUpload"
                    type="file"
                    name="file"
                    onChange={fileChangeHandler}
                  />
                  {url ? (
                    <Alert status="success">
                      <AlertIcon />
                      {`${inputs.title} uploaded successfully`}
                    </Alert>
                  ) : (
                    <>
                      <HStack py={2} w="full">
                        <Progress
                          w="full"
                          colorScheme="green"
                          size="sm"
                          value={progress}
                        />
                        <Text fontWeight="semibold">
                          {`${round(progress, 2)}%`}
                        </Text>
                      </HStack>

                      <Button
                        cursor="pointer"
                        colorScheme="green"
                        variant="ghost"
                        color="green"
                        isLoading={uploading}
                        loadingText="Uploading..."
                        isDisabled={uploading}
                        as="label"
                        htmlFor="fileUpload"
                      >
                        Upload file
                      </Button>
                    </>
                  )}
                </>
              )}
              {type === "LINK" && (
                <FormControl>
                  <FormLabel>Link</FormLabel>
                  <Input
                    name="url"
                    value={inputs.url}
                    onChange={handleChange}
                    placeholder="Paste here.."
                    autoComplete="off"
                  />
                </FormControl>
              )}
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose} variant="ghost">
              Cancel
            </Button>
            <Button
              isLoading={saving}
              loadingText="Saving.."
              colorScheme="green"
              ml={3}
              onClick={save}
            >
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Center flexDir="column" w="full" py={8}>
        <Button
          leftIcon={<MdAddChart fontSize="24px" />}
          fontWeight="semibold"
          onClick={() => {
            onOpen();
            setUrl(undefined);
          }}
          colorScheme="green"
        >
          Learning Material
        </Button>
        <VStack py={8} w="50%">
          {learningMaterials.length === 0 && (
            <Center>
              <Heading fontFamily="Inter" fontWeight="semibold" fontSize="lg">
                No Learning Material
              </Heading>
            </Center>
          )}

          {learningMaterials.map((material) => (
            <HStack
              borderRadius={4}
              _hover={{ bg: "gray.200" }}
              cursor="pointer"
              bg="gray.100"
              key={material.title}
              w="full"
              alignItems="center"
              justifyContent="space-between"
            >
              <HStack
                w="full"
                as="a"
                href={material.url}
                target="_blank"
                spacing={4}
                p={4}
              >
                <LearnMaterialIcon type={material.type} />
                <Text fontWeight="semibold" color="gray.700">
                  {material.title}
                </Text>
              </HStack>
              <Box p={4}>
                <IconButton
                  isLoading={deletingId === material.id}
                  onClick={async () => {
                    try {
                      setDeletingId(material.id);

                      // @ts-ignore
                      const docRef = doc(
                        firestore,
                        CollectionNames.ACTIVITIES,
                        id,
                        ActivityCollectionNames.MATERIALS,
                        material.id
                      ) as DocumentReference<LearningMaterial>;

                      await deleteDoc(docRef);

                      setLearningMaterials((learningMaterials) =>
                        learningMaterials.filter(({ id }) => id !== material.id)
                      );
                    } catch (err: any) {
                      toast({
                        title: "Something went wrong",
                        description: err.message,
                      });
                    } finally {
                      setDeletingId(null);
                    }
                  }}
                  variant="ghost"
                  color="red.500"
                  aria-label="Call Sage"
                  fontSize="20px"
                  icon={<FiTrash2 />}
                />
              </Box>
            </HStack>
          ))}
        </VStack>
      </Center>
    </>
  );
};

export default DashboardLearn;
