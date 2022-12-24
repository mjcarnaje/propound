import { UserDocType } from "@propound/types";
import * as ImagePicker from "expo-image-picker";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import {
  collection,
  CollectionReference,
  doc,
  getDocs,
  query,
  setDoc,
  where
} from "firebase/firestore";
import moment from "moment";
import {
  Button,
  Center,
  HStack,
  Input,
  Spinner,
  Text,
  useToast,
  VStack
} from "native-base";
import React, { useState } from "react";
import { Image, TouchableOpacity } from "react-native";
import BaseScreen from "../components/BaseScreen";
import { auth, firestore } from "../configs/firebase";
import { useAuthStore } from "../store/auth";
import useStorage from "../utils/useStorage";


const SignUpScreen = () => {
  const { setUser } = useAuthStore();
  const [currentIndexForm, setCurrentIndexForm] = useState(0);
  const { _uploadFile } = useStorage();
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [uploading, setUploading] = useState(false);
  const toast = useToast();
  const [form, setForm] = useState({
    email: "",
    password: "",
    photoURL: "",
    firstName: "",
    lastName: "",
  });

  const pickImage = async (): Promise<void> => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const timestamp = moment().format("YYYYMMDDHHmmss");
      setUploading(true);
      const photoURL = await _uploadFile(result, `images/${timestamp}`);
      setForm((prev) => ({ ...prev, photoURL }));
      setUploading(false);
    }
  };

  const onNext = async () => {
    const { email } = form;
    setIsCheckingEmail(true);
    const q = query(
      collection(firestore, "user"),
      where("email", "==", email.trim().toLowerCase())
    );
    const querySnapshot = await getDocs(q);
    const isExist = querySnapshot.docs.length > 0;

    setIsCheckingEmail(false);

    if (isExist) {
      toast.show({
        title: "Email already exist",
        description: "Please use another email",
      });
      return;
    } else {
      setCurrentIndexForm(currentIndexForm + 1);
    }
  };

  const signUp = async () => {
    try {
      setIsSigningUp(true);

      const { user } = await createUserWithEmailAndPassword(
        auth,
        form.email.trim(),
        form.password.trim()
      );

      if (user) {
        const displayName = `${form.firstName} ${form.lastName}`;

        await updateProfile(user, {
          displayName: displayName,
          photoURL: form.photoURL,
        });

        const userRef = doc(
          collection(firestore, "user") as CollectionReference<UserDocType>,
          user.uid
        );

        const newUser: UserDocType = {
          uid: user.uid,
          displayName: displayName,
          email: form.email,
          enrolledGames: [],
          photoURL: form.photoURL,
          createdGames: [],
          role: "STUDENT",
        };

        await setDoc(userRef, newUser);

        setUser(newUser);
      }
      setIsSigningUp(false);
    } catch (error) {
      console.log(error);
      setIsSigningUp(false);
    }
  };

  return (
    <BaseScreen>
      <VStack space={4} w="90%" mx="auto">
        {currentIndexForm === 0 && (
          <>
            <VStack space={2}>
              <Text fontFamily="Inter-Medium">Email Address</Text>
              <Input
                placeholder="Email"
                value={form.email}
                onChangeText={(text) => setForm({ ...form, email: text })}
                borderRadius="xl"
                fontFamily="Inter-Regular"
                size="lg"
                py={3}
                px={3}
                colorScheme="orange"
              />
            </VStack>

            <VStack space={2}>
              <Text fontFamily="Inter-Medium">Password</Text>
              <Input
                placeholder="Password"
                value={form.password}
                onChangeText={(text) => setForm({ ...form, password: text })}
                borderRadius="xl"
                fontFamily="Inter-Regular"
                size="lg"
                py={3}
                px={3}
                colorScheme="orange"
                secureTextEntry
              />
            </VStack>

            <HStack space={2}>
              <Button
                isLoading={isCheckingEmail}
                isLoadingText="Checking..."
                onPress={onNext}
                colorScheme="orange"
                _text={{ fontFamily: "Inter-Bold" }}
                borderRadius="xl"
                px={8}
                size="lg"
                flex={1}
              >
                Continue
              </Button>
            </HStack>
          </>
        )}
        {currentIndexForm === 1 && (
          <VStack alignItems="center" space={4}>
            <TouchableOpacity style={{ marginBottom: 24 }} onPress={pickImage}>
              <Center
                bg="gray.100"
                borderRadius="full"
                boxSize={176}
                overflow="hidden"
              >
                {uploading ? (
                  <Spinner size="sm" color="orange.600" />
                ) : form.photoURL ? (
                  <Image
                    style={{
                      width: "100%",
                      height: "100%",
                      resizeMode: "contain",
                    }}
                    source={{ uri: form.photoURL }}
                  />
                ) : (
                  <Text fontFamily="Inter-Medium">Add Photo</Text>
                )}
              </Center>
            </TouchableOpacity>

            <Input
              placeholder="First Name"
              value={form.firstName}
              onChangeText={(text) => setForm({ ...form, firstName: text })}
              borderRadius="xl"
              fontFamily="Inter-Regular"
              size="lg"
              py={3}
              px={3}
              colorScheme="orange"
            />
            <Input
              placeholder="Last Name"
              value={form.lastName}
              onChangeText={(text) => setForm({ ...form, lastName: text })}
              borderRadius="xl"
              fontFamily="Inter-Regular"
              size="lg"
              py={3}
              px={3}
              colorScheme="orange"
            />

            <HStack mt={4} space={2}>
              <Button
                w="full"
                onPress={signUp}
                isLoading={isSigningUp}
                isLoadingText="Signing Up..."
                colorScheme="orange"
                _text={{ fontFamily: "Inter-Bold" }}
                borderRadius="xl"
                px={8}
                size="lg"
              >
                Sign Up
              </Button>
            </HStack>
          </VStack>
        )}
      </VStack>
    </BaseScreen>
  );
};

export default SignUpScreen;
