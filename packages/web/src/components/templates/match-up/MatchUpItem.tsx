import {
  AspectRatio,
  Box,
  FormErrorMessage,
  HStack,
  Icon,
  IconButton,
  Image,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react";
import React, { ChangeEvent, useEffect } from "react";
import { FieldErrors, useFormContext, useWatch } from "react-hook-form";
import { BsImage, BsTrash } from "react-icons/bs";
import useStorage from "../../../hooks/useStorage";
import { MatchUpItemType, MatchUpTemplate } from "../../../types/match-up";
import { checkImage } from "../../../utils/misc";

interface MatchUpItemProps {
  activityId: string;
  error?: FieldErrors<MatchUpItemType>;
  itemIdx: number;
  onRemoveItem: () => void;
  onRemoveItemDisabled: boolean;
}

const MatchUpItem: React.FC<MatchUpItemProps> = ({
  activityId,
  error,
  itemIdx,
  onRemoveItem,
  onRemoveItemDisabled,
}) => {
  const { register, control, watch, setValue } =
    useFormContext<MatchUpTemplate>();

  const keywordPhoto = useWatch({
    control,
    name: `items.${itemIdx}.keyword.photo`,
  });
  const definitionPhoto = useWatch({
    control,
    name: `items.${itemIdx}.definition.photo`,
  });

  return (
    <>
      <HStack w="full" align="center">
        <Text>{`${itemIdx + 1})`}</Text>
        <HStack w="full">
          <HStack w="full">
            <MatchUpPhoto
              activityId={activityId}
              photo={keywordPhoto}
              setValue={(url) => {
                setValue(`items.${itemIdx}.keyword.photo`, url);
              }}
            />
            <VStack align="flex-start" w="full">
              <Input
                id={`items.${itemIdx}.keyword.text`}
                placeholder="Keyword"
                {...register(`items.${itemIdx}.keyword.text`, {
                  required: `Item ${itemIdx + 1} is required.`,
                })}
                  autoComplete="off"

              />
              <FormErrorMessage>
                {error?.keyword?.text && error.keyword.text?.message}
              </FormErrorMessage>
            </VStack>
          </HStack>
          <HStack w="full">
            <MatchUpPhoto
              activityId={activityId}
              photo={definitionPhoto}
              setValue={(url) => {
                setValue(`items.${itemIdx}.definition.photo`, url);
              }}
            />
            <VStack align="flex-start" w="full">
              <Input
                id={`items.${itemIdx}.definition.text`}
                placeholder="Definition"
                {...register(`items.${itemIdx}.definition.text`, {
                  required: `Item ${itemIdx + 1} is required.`,
                })}
                  autoComplete="off"

              />
              <FormErrorMessage>
                {error?.definition?.text && error.definition.text?.message}
              </FormErrorMessage>
            </VStack>
          </HStack>
        </HStack>
        <IconButton
          onClick={onRemoveItem}
          disabled={onRemoveItemDisabled}
          aria-label="Delete match up"
          icon={<Icon as={BsTrash} color="red.400" />}
        />
      </HStack>
    </>
  );
};

export default MatchUpItem;

interface MatchUpPhotoProps {
  photo: string;
  activityId: string;
  setValue: (value: string) => void;
}

const MatchUpPhoto: React.FC<MatchUpPhotoProps> = ({
  photo,
  activityId,
  setValue,
}) => {
  const { url, uploading, uploadFile } = useStorage();

  async function fileChangeHandler(e: ChangeEvent<HTMLInputElement>) {
    const file = checkImage(e);
    if (file) {
      await uploadFile(file, `${activityId}/${file.name}`);
    }
  }

  useEffect(() => {
    if (url) {
      setValue(url);
    }
  }, [url]);

  return (
    <Box>
      {photo ? (
        <AspectRatio
          borderRadius={4}
          overflow="hidden"
          cursor="pointer"
          w="40px"
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
          />
          <IconButton
            cursor="pointer"
            as="label"
            htmlFor="fileUpload"
            isLoading={uploading}
            colorScheme="orange"
            variant="ghost"
            aria-label="Upload keyword photo"
            fontSize="20px"
            icon={<Icon as={BsImage} />}
          />
        </>
      )}
    </Box>
  );
};