import { ActivityDocType } from "@propound/types";
import { getFullName } from "@propound/utils";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import dayjs from "dayjs";
import {
  AspectRatio,
  Avatar,
  HStack,
  Text,
  useToken,
  VStack,
} from "native-base";
import React from "react";
import { Image, TouchableOpacity } from "react-native";
import { MainScreensParamList } from "../navigation";

interface LearningSpaceCardProps {
  space: ActivityDocType;
}

const LearningSpaceCard: React.FC<LearningSpaceCardProps> = ({ space }) => {
  const [bgColor] = useToken("colors", ["gray.100"]);
  const navigation = useNavigation<NavigationProp<MainScreensParamList>>();

  return (
    <TouchableOpacity
      style={{ borderRadius: 20, backgroundColor: bgColor }}
      onPress={() =>
        navigation.getParent().navigate("Activity", { id: space.id })
      }
    >
      <VStack space={4} w="full" p={4}>
        <AspectRatio
          overflow="hidden"
          borderRadius="xl"
          ratio={16 / 9}
          bg="gray.200"
          w="full"
        >
          <Image source={{ uri: space.coverPhoto }} />
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
            <Avatar size="sm" source={{ uri: space.teacher.photoURL }} />
            <VStack>
              <Text fontFamily="Inter-Medium" fontSize={13} lineHeight={14}>
                {getFullName(space.teacher)}
              </Text>
              <Text
                fontFamily="Inter-Regular"
                fontSize={12}
                lineHeight={16}
                color="muted.500"
              >
                {space.teacher.email}
              </Text>
            </VStack>
          </HStack>
          <Text fontFamily="Inter-Regular" color="muted.500" fontSize={12}>
            {`Created on ${dayjs(space.createdAt).format("DD MMM YYYY")}`}
          </Text>
        </VStack>
      </VStack>
    </TouchableOpacity>
  );
};

export default LearningSpaceCard;
