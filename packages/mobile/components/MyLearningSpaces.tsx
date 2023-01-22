import { FontAwesome5 } from "@expo/vector-icons";
import { ActivityDocType } from "@propound/types";
import { getDocs, query, where } from "firebase/firestore";
import {
  AspectRatio,
  Button,
  FlatList,
  HStack,
  Icon,
  Text,
  useDisclose,
  VStack,
} from "native-base";
import React, { useEffect, useState } from "react";
import { collections } from "../configs/firebase";
import { useAuthStore } from "../store/auth";
import JoinLearningSpaceModal from "./JoinLearningSpaceModal";
import LearningSpaceCard from "./LearningSpaceCard";
import SvgEmptyLearningSpace from "./svgs/EmptyLearningSpace";

const MyLearningSpaces: React.FC = () => {
  const disclose = useDisclose();
  const [learningSpaces, setLearingSpaces] = useState<ActivityDocType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuthStore();

  async function getLearningSpace() {
    try {
      setIsLoading(true);

      if (user.enrolledGames.length === 0) {
        setIsLoading(false);
        return;
      }

      const q = query(
        collections.activities,
        where("id", "in", user.enrolledGames)
      );

      const querySnapshot = await getDocs(q);

      setLearingSpaces(querySnapshot.docs.map((doc) => doc.data()));
      setIsLoading(false);
    } catch (err) {
      console.log(err);
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getLearningSpace();
  }, [user?.uid, user?.enrolledGames]);

  return (
    <>
      <JoinLearningSpaceModal disclose={disclose} />
      <VStack py={4} space={8}>
        <Text
          fontSize={24}
          fontFamily="Inter-Bold"
          color="muted.800"
          lineHeight={28}
        >
          My Learning Spaces
        </Text>
        <FlatList
          refreshing={isLoading}
          onRefresh={getLearningSpace}
          data={learningSpaces}
          renderItem={({ item }) => <LearningSpaceCard space={item} />}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ flexGrow: 1, padding: 4 }}
          ListHeaderComponent={
            learningSpaces.length !== 0 && (
              <HStack mb={4} w="full" justifyContent="flex-end">
                <Button
                  leftIcon={<Icon as={FontAwesome5} name="plus" />}
                  _text={{ fontFamily: "Inter-Medium" }}
                  onPress={() => disclose.onOpen()}
                  px={8}
                  borderRadius={8}
                  colorScheme="orange"
                >
                  Join a Space
                </Button>
              </HStack>
            )
          }
          ListEmptyComponent={
            <>
              <VStack space={6} py={8} alignItems="center">
                <Text fontFamily="Inter-Bold" fontSize={18}>
                  No Learning Space joined.
                </Text>
                <AspectRatio ratio={226 / 232} w="180px">
                  <SvgEmptyLearningSpace />
                </AspectRatio>
                <Text
                  fontFamily="Inter-Regular"
                  color="muted.500"
                  textAlign="center"
                >
                  Add learning space provided by your{"\n"} teacher to view
                  learning materials and take{"\n"} pre-game and post-game.
                </Text>
                <Button
                  leftIcon={<Icon as={FontAwesome5} name="plus" />}
                  _text={{ fontFamily: "Inter-Medium" }}
                  onPress={() => disclose.onOpen()}
                  px={8}
                  borderRadius={8}
                  colorScheme="orange"
                >
                  Join a Space
                </Button>
              </VStack>
            </>
          }
          ItemSeparatorComponent={() => <VStack py={2} />}
        />
      </VStack>
    </>
  );
};

export default MyLearningSpaces;
