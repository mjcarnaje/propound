import {
  AspectRatio,
  Center,
  FormErrorMessage,
  HStack,
  Icon,
  IconButton,
  Image,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react";
import { MatchUpItemType, MatchUpTemplate } from "@propound/types";
import React, { ChangeEvent, useEffect } from "react";
import { FieldErrors, useFormContext, useWatch } from "react-hook-form";
import { BsImage, BsTrash } from "react-icons/bs";
import useStorage from "../../../hooks/useStorage";
import { checkImage } from "../../../utils/misc";

interface MatchUpItemProps {
  activityId: string;
  error?: FieldErrors<MatchUpItemType>;
  itemIdx: number;
  onRemoveItem: () => void;
  onRemoveItemDisabled: boolean;
  isPublished?: boolean;
}

const MatchUpItem: React.FC<MatchUpItemProps> = ({
  activityId,
  error,
  itemIdx,
  onRemoveItem,
  onRemoveItemDisabled,
  isPublished,
}) => {
  const { register, control, watch, setValue } =
    useFormContext<MatchUpTemplate>();

  const photo = useWatch({
    control,
    name: `items.${itemIdx}.photo.photo`,
  });
  const text = useWatch({
    control,
    name: `items.${itemIdx}.text.text`,
  });

  const { url, uploading, uploadFile } = useStorage();

  async function fileChangeHandler(e: ChangeEvent<HTMLInputElement>) {
    const file = checkImage(e);
    if (file) {
      await uploadFile(file, `${activityId}/${file.name}`);
    }
  }

  useEffect(() => {
    if (url) {
      setValue(`items.${itemIdx}.photo.photo`, url);
    }
  }, [url]);
  return (
    <>
      <HStack p={4} spacing={4} w="full" align="center">
        <Text>{`${itemIdx + 1})`}</Text>
        <HStack w="full">
          <HStack w="full">
            <Center>
              {photo ? (
                <AspectRatio
                  borderRadius={4}
                  overflow="hidden"
                  cursor="pointer"
                  w="80px"
                  ratio={1}
                >
                  <Image src={photo} alt="choice photo" objectFit="cover" />
                </AspectRatio>
              ) : (
                <>
                  <input
                    hidden
                    id="fileUpload"
                    type="file"
                    name="file"
                    onChange={fileChangeHandler}
                    disabled={isPublished}
                  />
                  <AspectRatio
                    borderRadius={4}
                    overflow="hidden"
                    cursor="pointer"
                    w="80px"
                    ratio={1}
                  >
                    <IconButton
                      cursor={isPublished ? "default" : "pointer"}
                      as="label"
                      htmlFor="fileUpload"
                      isLoading={uploading}
                      colorScheme="orange"
                      variant="ghost"
                      aria-label="Upload keyword photo"
                      icon={<Icon fontSize={44} as={BsImage} />}
                      w="full"
                      h="full"
                      disabled={isPublished}
                      _disabled={{ opacity: 1, cursor: "default" }}
                    />
                  </AspectRatio>
                </>
              )}
            </Center>
            <VStack align="flex-start" w="full">
              <Input
                id={`items.${itemIdx}.text.text`}
                placeholder="Keyword"
                {...register(`items.${itemIdx}.text.text`, {
                  required: `Item ${itemIdx + 1} is required.`,
                })}
                size="lg"
                autoComplete="off"
                disabled={isPublished}
                _disabled={{ opacity: 1 }}
              />
              <FormErrorMessage>
                {error?.text?.text && error.text.text?.message}
              </FormErrorMessage>
            </VStack>
          </HStack>
        </HStack>
        {!isPublished && (
          <IconButton
            onClick={onRemoveItem}
            disabled={onRemoveItemDisabled}
            aria-label="Delete match up"
            fontSize={20}
            icon={<Icon as={BsTrash} color="red.600" />}
          />
        )}
      </HStack>
    </>
  );
};

export default MatchUpItem;
