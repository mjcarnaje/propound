import { ActivityDocType } from "@propound/types";
import { getFullName } from "@propound/utils";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import {
  AspectRatio,
  Avatar,
  Center,
  HStack,
  Text,
  useToken,
  VStack,
} from "native-base";
import React from "react";
import { Image, TouchableOpacity } from "react-native";
import { MainScreensParamList } from "../navigation";
import { formatDate } from "../utils/date";
import { NoCoverPhoto } from "./svgs";

interface LearningSpaceCardProps {
  space: ActivityDocType;
}

const LearningSpaceCard: React.FC<LearningSpaceCardProps> = ({ space }) => {
  const [bgColor] = useToken("colors", ["muted.50"]);
  const navigation = useNavigation<NavigationProp<MainScreensParamList>>();

  return (
    <TouchableOpacity
      style={{ borderRadius: 20, backgroundColor: bgColor, elevation: 1 }}
      onPress={() =>
        navigation.getParent().navigate("Activity", { id: space.id })
      }
    >
      <VStack space={4} w="full" p={4}>
        <AspectRatio
          overflow="hidden"
          borderRadius="xl"
          ratio={16 / 9}
          bg="light.100"
          w="full"
        >
          {space.coverPhoto ? (
            <Image source={{ uri: space.coverPhoto }} />
          ) : (
            <Center flexGrow={1}>
              <AspectRatio
                ratio={911.60164 / 451.38424}
                w="60%"
                position="relative"
                mb={2}
              >
                <NoCoverPhoto />
              </AspectRatio>
              <Text fontFamily="Inter-SemiBold" fontSize={16}>
                No cover photo
              </Text>
            </Center>
          )}
        </AspectRatio>
        <VStack space={4}>
          <VStack space={2}>
            <Text fontSize={22} fontFamily="Inter-Bold" lineHeight={26}>
              {space.title}
            </Text>
            <Text fontFamily="Inter-Regular" numberOfLines={4}>
              {space.description}
            </Text>
          </VStack>
          <HStack space={2}>
            <Avatar size="sm" source={{ uri: space.author.photoURL }} />
            <VStack>
              <Text fontFamily="Inter-Medium" fontSize={13} lineHeight={14}>
                {getFullName(space.author)}
              </Text>
              <Text
                fontFamily="Inter-Regular"
                fontSize={12}
                lineHeight={16}
                color="muted.500"
              >
                {space.author.email}
              </Text>
            </VStack>
          </HStack>
          <Text fontFamily="Inter-Regular" color="muted.500" fontSize={12}>
            {`Created on ${formatDate(space.createdAt)}`}
          </Text>
        </VStack>
      </VStack>
    </TouchableOpacity>
  );
};

export default LearningSpaceCard;
