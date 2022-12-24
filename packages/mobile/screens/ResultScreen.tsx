import {
  ActivityDocType,
  CollectionNames,
  StudentCollectionNames,
  StudentResultDocType,
} from "@propound/types";
import {
  collection,
  CollectionReference,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import {
  AspectRatio,
  Box,
  Button,
  Center,
  Image,
  Spinner,
  Text,
  VStack,
} from "native-base";
import React, { useEffect, useState } from "react";
import { FlatList } from "react-native";
import BaseScreen from "../components/BaseScreen";
import { collections, firestore } from "../configs/firebase";
import { useAuthStore } from "../store/auth";

type ResultAndActivity = {
  activity: ActivityDocType;
  result: StudentResultDocType;
};

const ResultScreen = () => {
  const { user } = useAuthStore();
  const [data, setData] = useState<ResultAndActivity[]>();
  const [isLoading, setIsLoading] = useState(false);

  const getResultsData = async () => {
    try {
      setIsLoading(true);

      const resultsRef = query(
        collection(
          firestore,
          CollectionNames.STUDENTS,
          user.uid,
          StudentCollectionNames.RESULTS
        ) as CollectionReference<StudentResultDocType>
      );

      const resultsSnapshot = await getDocs(resultsRef);

      const results = resultsSnapshot.docs.map((doc) => doc.data());

      const activityIds = results.map((result) => result.activityId);

      const activitiesRef = query(
        collections.activities,
        where("id", "in", activityIds)
      );

      const activitiesSnapshot = await getDocs(activitiesRef);

      const activities = activitiesSnapshot.docs.map((doc) => doc.data());

      const resultsWithActivity = results.map((result) => {
        const activity = activities.find(
          (activity) => activity.id === result.activityId
        );
        return {
          activity,
          result,
        };
      });

      setData(resultsWithActivity);
      setIsLoading(false);
    } catch (err) {
      console.log(err);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getResultsData();
  }, []);

  return (
    <BaseScreen isScrollable>
      <VStack space={4} p={4}>
        <FlatList
          data={data}
          renderItem={({ item }) => (
            <ResultCard activity={item.activity} result={item.result} />
          )}
          keyExtractor={(item) => item.activity.id}
          ListEmptyComponent={() => (
            <Center flexGrow={1}>
              {isLoading && <Spinner size="lg" color="orange.600" />}
              {!isLoading && (
                <Text
                  fontFamily="Inter-Medium"
                  fontSize={18}
                  textAlign="center"
                  w="70%"
                >
                  Have not signed up to any learning spaces
                </Text>
              )}
            </Center>
          )}
          ItemSeparatorComponent={() => <Box h={4} />}
        />
      </VStack>
    </BaseScreen>
  );
};

export default ResultScreen;

const ResultCard = ({ activity, result }: ResultAndActivity) => {
  const [showResult, setShowResult] = useState(false);

  return (
    <VStack space={4} bg="gray.50" w="full" p={4} borderRadius="lg">
      <AspectRatio overflow="hidden" borderRadius="xl" ratio={16 / 9} w="full">
        <Image source={{ uri: activity.coverPhoto }} alt="yey" />
      </AspectRatio>
      <VStack space={4}>
        <Box>
          <Text fontSize={22} fontFamily="Inter-Bold" lineHeight={26}>
            {activity.title}
          </Text>
        </Box>

        <Button
          _text={{ fontFamily: "Inter-Medium" }}
          colorScheme="orange"
          borderRadius="lg"
          onPress={() => {
            setShowResult(!showResult);
          }}
        >
          {showResult ? "Hide Result" : "Show Result"}
        </Button>

        {showResult && (
          <>
            <VStack space={2}>
              <Text fontFamily="Inter-Bold" fontSize={24}>
                Pre test
              </Text>
              <VStack bg="gray.100" p={2} borderRadius="lg">
                <Text fontSize={16} fontFamily="Inter-Regular" lineHeight={20}>
                  Taken count:{" "}
                  <Text fontFamily="Inter-Bold">
                    {result.scores["PRE_TEST"].scores.length}
                  </Text>
                </Text>
              </VStack>
              <VStack bg="gray.100" p={2} borderRadius="lg">
                <Text fontSize={16} fontFamily="Inter-Regular" lineHeight={20}>
                  Average time:{" "}
                  <Text fontFamily="Inter-Bold">
                    {result.scores["PRE_TEST"]?.average.time
                      ? result.scores["PRE_TEST"].average.time / 1000
                      : 0}{" "}
                    seconds
                  </Text>
                </Text>
              </VStack>
              <VStack bg="gray.100" p={2} borderRadius="lg">
                <Text fontSize={16} fontFamily="Inter-Regular" lineHeight={20}>
                  Average score:{" "}
                  <Text fontFamily="Inter-Bold">
                    {result.scores["PRE_TEST"]?.average.score}
                  </Text>
                </Text>
              </VStack>
              <VStack bg="gray.100" p={2} borderRadius="lg">
                <Text fontSize={16} fontFamily="Inter-Regular" lineHeight={20}>
                  Scores:{" "}
                  <Text fontFamily="Inter-Bold">
                    {result.scores["PRE_TEST"]?.scores
                      .map((s) => s.score)
                      .join(", ")}
                  </Text>
                </Text>
              </VStack>
            </VStack>

            <VStack space={2}>
              <Text fontFamily="Inter-Bold" fontSize={24}>
                Post test
              </Text>
              {result.status.postGameDone ? (
                <>
                  <VStack bg="gray.100" p={2} borderRadius="lg">
                    <Text
                      fontSize={16}
                      fontFamily="Inter-Regular"
                      lineHeight={20}
                    >
                      Taken count:{" "}
                      <Text fontFamily="Inter-Bold">
                        {result.scores["POST_TEST"].scores.length}
                      </Text>
                    </Text>
                  </VStack>
                  <VStack bg="gray.100" p={2} borderRadius="lg">
                    <Text
                      fontSize={16}
                      fontFamily="Inter-Regular"
                      lineHeight={20}
                    >
                      Average time:{" "}
                      <Text fontFamily="Inter-Bold">
                        {result.scores["POST_TEST"]?.average.time
                          ? result.scores["POST_TEST"].average.time / 1000
                          : 0}{" "}
                        seconds
                      </Text>
                    </Text>
                  </VStack>
                  <VStack bg="gray.100" p={2} borderRadius="lg">
                    <Text
                      fontSize={16}
                      fontFamily="Inter-Regular"
                      lineHeight={20}
                    >
                      Average score:{" "}
                      <Text fontFamily="Inter-Bold">
                        {result.scores["POST_TEST"]?.average.score}
                      </Text>
                    </Text>
                  </VStack>
                  <VStack bg="gray.100" p={2} borderRadius="lg">
                    <Text
                      fontSize={16}
                      fontFamily="Inter-Regular"
                      lineHeight={20}
                    >
                      Scores:{" "}
                      <Text fontFamily="Inter-Bold">
                        {result.scores["POST_TEST"]?.scores
                          .map((s) => s.score)
                          .join(", ")}
                      </Text>
                    </Text>
                  </VStack>
                </>
              ) : (
                <Text fontFamily="Inter-Regular">Not done yet.</Text>
              )}
            </VStack>
          </>
        )}
      </VStack>
    </VStack>
  );
};
