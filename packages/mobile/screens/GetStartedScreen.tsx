import { StackScreenProps } from "@react-navigation/stack";
import * as WebBrowser from "expo-web-browser";
import { Box, Button, Text, VStack } from "native-base";
import React from "react";
import BaseScreen from "../components/BaseScreen";
import { GetStarted } from "../components/svgs";
import { useAuthStore } from "../store/auth";
import LoadingScreen from "./LoadingScreen";

WebBrowser.maybeCompleteAuthSession();

const GetStartedScreen: React.FC<
  StackScreenProps<RootStackParamList, "GetStarted">
> = ({ navigation }) => {
  const { loading } = useAuthStore();

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <BaseScreen>
      <VStack py={8} space={6}>
        <Box h={298} w="auto">
          <GetStarted />
        </Box>
        <VStack space={4} w="90%" mx="auto">
          <Text fontSize={36} fontFamily="Inter-Bold" color="muted.900">
            Get Started
          </Text>
          <Text fontSize={18} color="muted.500">
            proPound is a game based web learning application aims to assist
            learning through game based activities.
          </Text>
        </VStack>
      </VStack>
      <VStack space={2}>
        <Button
          onPress={() => navigation.navigate("SignUp")}
          colorScheme="orange"
          variant="subtle"
          _text={{ fontFamily: "Inter-Bold" }}
          borderRadius="xl"
          px={8}
          w="90%"
          mx="auto"
          size="lg"
        >
          Sign up
        </Button>
        <Button
          onPress={() => navigation.navigate("SignIn")}
          colorScheme="orange"
          _text={{ fontFamily: "Inter-Bold" }}
          borderRadius="xl"
          px={8}
          w="90%"
          mx="auto"
          size="lg"
        >
          Sign in
        </Button>
      </VStack>
    </BaseScreen>
  );
};

export default GetStartedScreen;
