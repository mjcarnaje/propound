import { VStack } from "native-base";
import React from "react";
import BaseScreen from "../components/BaseScreen";
import Greetings from "../components/Greetings";
import MyLearningSpaces from "../components/MyLearningSpaces";
import QuoteOfTheDay from "../components/QuoteOfTheDay";

const HomeScreen = () => {
  return (
    <BaseScreen isScrollable>
      <VStack space={4} p={4}>
        <Greetings />
        <QuoteOfTheDay />
        <MyLearningSpaces />
      </VStack>
    </BaseScreen>
  );
};

export default HomeScreen;
