import { ImagePickerResult } from "expo-image-picker";
import {
  getDownloadURL,
  ref,
  StorageError,
  uploadBytes,
  uploadBytesResumable,
} from "firebase/storage";
import { useCallback, useState } from "react";
import { storage } from "../configs/firebase";

const useStorage = () => {
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<StorageError | undefined>();
  const [url, setUrl] = useState<string | undefined>();

  const getPictureBlob = (fileURL: string): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function (e) {
        reject(new TypeError("Network request failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", fileURL, true);
      xhr.send(null);
    });
  };

  const uploadFile = useCallback(
    async (file: ImagePickerResult, path: string): Promise<void> => {
      const fileRef = ref(storage, path);
      const blob = await getPictureBlob(file.assets[0].uri);
      const uploadTask = uploadBytesResumable(fileRef, blob);
      uploadTask.on(
        "state_changed",
        (snap) => {
          setUploading(true);
          let percentage = (snap.bytesTransferred / snap.totalBytes) * 100;
          setProgress(percentage);
        },
        (err) => {
          setError(err);
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

  const _uploadFile = async (
    file: ImagePickerResult,
    path: string
  ): Promise<string> => {
    const fileRef = ref(storage, path);
    const blob = await getPictureBlob(file.assets[0].uri);
    const snapshot = await uploadBytes(fileRef, blob);
    const photoURL = await getDownloadURL(snapshot.ref);
    return photoURL;
  };

  return {
    progress,
    url,
    setUrl,
    uploading,
    error,
    uploadFile,
    _uploadFile,
  };
};

export default useStorage;
