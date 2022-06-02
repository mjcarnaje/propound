import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Center,
  ColorProps,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Icon,
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
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import React, { useEffect, useState } from "react";
import { IconType } from "react-icons";
import { BsLink45Deg, BsYoutube } from "react-icons/bs";
import { FaFilePowerpoint, FaFileWord } from "react-icons/fa";
import { FiTrash2 } from "react-icons/fi";
import { MdAddChart } from "react-icons/md";
import { VscFilePdf } from "react-icons/vsc";
import { useParams } from "react-router-dom";
import { gameCollection, gameSubCollection } from "../../firebase/collections";
import { firestore, storage } from "../../firebase/config";
import { useAppSelector } from "../../hooks/redux";
import { selectAuth } from "../../store/reducer/auth";
import { LearningMaterial, LearningMaterialType } from "../../types/game";
import { generateId } from "../../utils/id";
import { round } from "../../utils/number";

const DashboardLearn: React.FC = () => {
  const { user } = useAppSelector(selectAuth);
  const { id } = useParams();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const [progress, setProgress] = useState(0);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [fething, setFetching] = useState(false);
  const [status, setStatus] = useState("");
  const [type, setType] = useState<"LINK" | "FILE">(null);
  const [inputs, setInputs] = useState({
    title: "",
    url: "",
  });
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [learningMaterials, setLearningMaterials] = useState<
    LearningMaterial[]
  >([]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  }

  function uploadFile(file: File) {
    const pdfRef = ref(storage, `${id}/${file.name}`);

    const uploadTask = uploadBytesResumable(pdfRef, file);

    uploadTask.on(
      "state_changed",
      ({ bytesTransferred, totalBytes, state }) => {
        setProgress((bytesTransferred / totalBytes) * 100);

        setUploading(true);

        switch (state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;
          case "success":
            console.log("Upload is successful");
            break;
          case "canceled":
            console.log("Upload is canceled");
            break;
          case "error":
            console.log("Upload is failed");
            break;
        }
      },
      (error) => {
        switch (error.code) {
          case "storage/unauthorized":
            toast({
              title: "Error",
              description: "You do not have permission to upload files",
              status: "error",
            });
            break;
          case "storage/canceled":
            toast({
              title: "Error",
              description: "You have cancelled the upload",
              status: "error",
            });
            break;
          case "storage/unknown":
            toast({
              title: "Error",
              description: "Unknown error",
              status: "error",
            });
            break;
        }
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setUploading(false);
          if (downloadURL) {
            setStatus("success");
            setInputs((inputs) => ({ ...inputs, url: downloadURL }));
          }
        });
      }
    );
  }

  function fileChangeHandler(e) {
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

    uploadFile(file);
  }

  async function save() {
    try {
      setSaving(true);
      const gameRef = doc(gameCollection, id);
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
          type: materialType,
        };

        await setDoc(
          doc(
            gameSubCollection<LearningMaterial>(id, "material"),
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
    } catch (err) {
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
      setStatus(null);
      setSaving(false);
      setType(null);
    }
  }

  async function getLearningMaterials() {
    try {
      setFetching(true);
      const q = query(gameSubCollection<LearningMaterial>(id, "material"));
      const querySnapshot = await getDocs(q);

      const res: LearningMaterial[] = [];
      querySnapshot.forEach((doc) => {
        res.push(doc.data());
      });
      setLearningMaterials(res);
    } catch (error) {
      toast({
        title: "Something went wrong",
        description: error.message,
        status: "error",
      });
    } finally {
      setFetching(false);
    }
  }

  useEffect(() => {
    getLearningMaterials();
  }, []);

  if (fething) {
    return (
      <Center py={8}>
        <Spinner />
      </Center>
    );
  }

  const MaterialIcon: Record<LearningMaterialType, IconType> = {
    PDF: VscFilePdf,
    YOUTUBE: BsYoutube,
    LINK: BsLink45Deg,
    PPT: FaFilePowerpoint,
    WORD: FaFileWord,
  };
  const color: Record<LearningMaterialType, ColorProps["color"]> = {
    PDF: "red.500",
    YOUTUBE: "red.500",
    LINK: "red.500",
    PPT: "orange.500",
    WORD: "blue.500",
  };

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
                  {status === "success" ? (
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
          onClick={onOpen}
          colorScheme="green"
        >
          Learning Material
        </Button>
        <VStack py={8} w="50%">
          {learningMaterials.length === 0 && (
            <Center>
              <Heading fontWeight="semibold" fontSize="lg">
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
                <Icon
                  as={MaterialIcon[material.type]}
                  color={color[material.type]}
                  boxSize="30px"
                  cursor="pointer"
                />
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

                      await deleteDoc(
                        doc(firestore, "game", id, "material", material.id)
                      );

                      setLearningMaterials((learningMaterials) =>
                        learningMaterials.filter(
                          (learningMaterial) =>
                            learningMaterial.id !== material.id
                        )
                      );
                    } catch (err) {
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
