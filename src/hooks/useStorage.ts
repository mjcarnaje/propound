import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { useState, useEffect } from "react";
import { storage } from "../firebase/config";

const useStorage = () => {
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [url, setUrl] = useState(null);

  async function uploadFile(file: File, path: string) {
    let storageURL;
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
      },
      async () => {
        const url = await getDownloadURL(uploadTask.snapshot.ref);
        setUrl(url);
        storageURL = url;
        setUploading(false);
      }
    );
    return storageURL;
  }

  return { progress, url, setUrl, uploading, error, uploadFile };
};

export default useStorage;
