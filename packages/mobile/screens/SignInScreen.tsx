import { UserDocType } from "@propound/types";
import { signInWithEmailAndPassword } from "firebase/auth";
import {
  collection,
  CollectionReference,
  doc,
  getDoc,
} from "firebase/firestore";
import { Button, HStack, Input, Text, useToast, VStack } from "native-base";
import React, { useState } from "react";
import BaseScreen from "../components/BaseScreen";
import { auth, firestore } from "../configs/firebase";
import { useAuthStore } from "../store/auth";

const SignInScreen = () => {
  const { setUser } = useAuthStore();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const toast = useToast();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const signIn = async () => {
    try {
      setIsSigningIn(true);

      const { user } = await signInWithEmailAndPassword(
        auth,
        form.email.trim(),
        form.password.trim()
      );

      if (user) {
        const userRef = doc(
          collection(firestore, "user") as CollectionReference<UserDocType>,
          user.uid
        );

        const _user = await getDoc(userRef);

        if (_user.exists()) {
          setUser(_user.data());
        } else {
          toast.show({
            title: "User not found",
          });
        }
      } else {
        toast.show({
          title: "User not found",
        });
      }

      setIsSigningIn(false);
    } catch (error) {
      console.log(error);
      setIsSigningIn(false);
    }
  };

  return (
    <BaseScreen>
      <VStack space={4} w="90%" mx="auto">
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

        <HStack mt={4} space={2}>
          <Button
            onPress={signIn}
            isLoading={isSigningIn}
            isLoadingText="Signing In"
            colorScheme="orange"
            _text={{ fontFamily: "Inter-Bold" }}
            borderRadius="xl"
            px={8}
            size="lg"
            flex={1}
          >
            Sign In
          </Button>
        </HStack>
      </VStack>
    </BaseScreen>
  );
};

export default SignInScreen;
