import { useToast } from "@chakra-ui/react";
import {
  getDownloadURL,
  ref,
  StorageError,
  uploadBytesResumable,
} from "firebase/storage";
import { useCallback, useState } from "react";
import { storage } from "../firebase/config";

const useStorage = () => {
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<StorageError | undefined>();
  const [url, setUrl] = useState<string | undefined>();
  const toast = useToast();

  const uploadFile = useCallback(
    async (file: File, path: string): Promise<void> => {
      const fileRef = ref(storage, path);

      const uploadTask = uploadBytesResumable(fileRef, file);

      uploadTask.on(
        "state_changed",
        (snap) => {
          setUploading(true);
          let percentage = (snap.bytesTransferred / snap.totalBytes) * 100;
          setProgress(percentage);
        },
        (err) => {
          setError(err);
          toast({
            title: "Error",
            description: err.message,
            status: "error",
          });
          setUploading(false);
        },
        async () => {
          const url = await getDownloadURL(uploadTask.snapshot.ref);
          setUrl(url);
          setUploading(false);
        }
      );
    },
    []
  );

  return { progress, url, setUrl, uploading, error, uploadFile };
};

export default useStorage;
