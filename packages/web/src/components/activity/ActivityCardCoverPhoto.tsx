import {
  AspectRatio,
  AspectRatioProps,
  Image,
  Text,
  VStack,
} from "@chakra-ui/react";
import { ActivityDocType } from "@propound/types";
import React from "react";
// @ts-ignore
import NoCoverPhotoSvg from "../../assets/svgs/no_cover_photo.svg?component";

interface ActivityCardCoverPhotoProps extends AspectRatioProps {
  data: ActivityDocType;
}

const ActivityCardCoverPhoto: React.FC<ActivityCardCoverPhotoProps> = ({
  data,
  ...props
}) => {
  return (
    <AspectRatio
      cursor="pointer"
      _hover={{ filter: "brightness(0.98)" }}
      w="full"
      maxW="400px"
      ratio={16 / 9}
      position="relative"
      overflow="hidden"
      rounded="2xl"
      {...props}
    >
      <>
        {data.coverPhoto && (
          <Image src={data.coverPhoto} bg="gray.100" objectFit="contain" />
        )}
        {!data.coverPhoto && (
          <VStack spacing={4} w="full" h="full" bg="gray.100" borderWidth={2}>
            <AspectRatio
              ratio={911.60164 / 451.38424}
              w="60%"
              position="relative"
            >
              <NoCoverPhotoSvg />
            </AspectRatio>
            <Text fontSize={18} fontWeight="semibold">
              No cover photo
            </Text>
          </VStack>
        )}
      </>
    </AspectRatio>
  );
};

export default ActivityCardCoverPhoto;
