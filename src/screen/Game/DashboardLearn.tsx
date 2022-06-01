import {
  Box,
  Button,
  Center,
  Progress,
  Text,
  useToast,
} from "@chakra-ui/react";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import React, { useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { storage } from "../../firebase/config";

const DashboardLearn: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const { id } = useParams();

  const [progress, setProgress] = useState(0);

  function uploadFile(file: File) {
    const pdfRef = ref(storage, `${id}/${file.name}`);

    const uploadTask = uploadBytesResumable(pdfRef, file);

    uploadTask.on(
      "state_changed",
      ({ bytesTransferred, totalBytes, state }) => {
        setProgress((bytesTransferred / totalBytes) * 100);

        switch (state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
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
          console.log("File available at", downloadURL);
        });
      }
    );
  }

  function changeHandler(e) {
    uploadFile(e.target.files[0]);
  }

  return (
    <Center flexDir="column" w="full" py={4}>
      <Text fontWeight="bold" fontSize={24}>
        Pre-Game
      </Text>
      <input
        hidden
        id="picUploader"
        type="file"
        name="file"
        onChange={changeHandler}
      />
      <Button isLoading={loading} as="label" htmlFor="picUploader">
        Upload image
      </Button>
      <Box w="full" bg="red.100">
        <Progress colorScheme="green" size="sm" value={progress} />
      </Box>
    </Center>
  );
};

export default DashboardLearn;
