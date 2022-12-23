import { createStandaloneToast } from "@chakra-ui/react";
import { ChangeEvent } from "react";

const { toast } = createStandaloneToast();

export function checkImage(e: ChangeEvent<HTMLInputElement>) {
  const file = e?.target?.files?.[0];
  if (!file) {
    toast({
      title: "No image selected",
      status: "error",
      duration: 3000,
      isClosable: true,
    });
    return;
  }

  if (file.type !== "image/jpeg" && file.type !== "image/png") {
    toast({
      title: "File format is incorrect",
      status: "error",
      duration: 3000,
      isClosable: true,
    });
    return;
  }

  return file;
}
