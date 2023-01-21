import { getFullName } from "@propound/utils";
import { StackScreenProps } from "@react-navigation/stack";
import * as ImagePicker from "expo-image-picker";
import { signOut } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import moment from "moment";
import { Button, Center, Spinner, Text, VStack } from "native-base";
import React, { useState } from "react";
import { Alert, Image, TouchableOpacity } from "react-native";
import BaseScreen from "../components/BaseScreen";
import { auth, collections } from "../configs/firebase";
import { MainScreensParamList } from "../navigation";
import { useAuthStore } from "../store/auth";
import useStorage from "../utils/useStorage";
import LoadingScreen from "./LoadingScreen";

const ProfileScreen: React.FC<StackScreenProps<MainScreensParamList>> = ({
  navigation,
}) => {
  const { loading, setUser, user } = useAuthStore();
  const [uploading, setUploading] = useState(false);
  const { _uploadFile } = useStorage();

  const pickImage = async (): Promise<void> => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled) {
        const timestamp = moment().format("YYYYMMDDHHmmss");
        setUploading(true);
        const newPhotoURL = await _uploadFile(result, `images/${timestamp}`);

        if (newPhotoURL) {
          const studentRef = doc(collections.users, user.uid);

          await updateDoc(studentRef, { photoURL: newPhotoURL });

          setUser({ ...user, photoURL: newPhotoURL });

          setUploading(false);
        }
      }
    } catch (err) {
      Alert.alert("Error", "Something went wrong. Please try again.");
    }
  };

  if (loading || !user) {
    return <LoadingScreen />;
  }

  return (
    <BaseScreen>
      <VStack w="90%" mx="auto" py={8} space={8}>
        <VStack
          bg="gray.100"
          py={8}
          px={4}
          borderRadius="xl"
          space={4}
          alignItems="center"
        >
          <TouchableOpacity style={{ marginBottom: 24 }} onPress={pickImage}>
            <Center
              bg="gray.200"
              borderRadius="full"
              boxSize={176}
              overflow="hidden"
            >
              {uploading ? (
                <Spinner size="sm" color="orange.600" />
              ) : user?.photoURL ? (
                <Image
                  style={{
                    width: "100%",
                    height: "100%",
                    resizeMode: "contain",
                  }}
                  source={{ uri: user.photoURL }}
                />
              ) : (
                <Text fontFamily="Inter-Medium">Add Photo</Text>
              )}
            </Center>
          </TouchableOpacity>

          <VStack alignItems="center">
            <Text fontFamily="Inter-Bold" fontSize={22}>
              {getFullName(user)}
            </Text>
            <Text fontFamily="Inter-Medium" fontSize={15} color="muted.600">
              Student
            </Text>
          </VStack>
        </VStack>

        <VStack space={3}>
          <Button
            _text={{ fontFamily: "Inter-Medium" }}
            size="lg"
            colorScheme="orange"
            borderRadius="lg"
            onPress={() => {
              navigation.getParent().navigate("Result");
            }}
          >
            My Learning Journey
          </Button>
          <Button
            _text={{ fontFamily: "Inter-Medium" }}
            size="lg"
            colorScheme="orange"
            borderRadius="lg"
            onPress={() => {
              navigation.getParent().navigate("About");
            }}
          >
            Learn more
          </Button>
          <Button
            _text={{ fontFamily: "Inter-Medium" }}
            size="lg"
            colorScheme="orange"
            variant="subtle"
            borderRadius="lg"
            onPress={async () => {
              await signOut(auth);
              setUser(null);
            }}
          >
            Sign out
          </Button>
        </VStack>
      </VStack>
    </BaseScreen>
  );
};

export default ProfileScreen;
