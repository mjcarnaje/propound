import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { Button, HStack, Input, Text, useToast, VStack } from "native-base";
import React, { useState } from "react";
import BaseScreen from "../components/BaseScreen";
import { auth, collections } from "../configs/firebase";
import { useAuthStore } from "../store/auth";

const SignInScreen = () => {
  const { setUser } = useAuthStore();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const toast = useToast();
  const [inputForms, setInputForms] = useState({
    email: "",
    password: "",
  });

  const signIn = async () => {
    try {
      setIsSigningIn(true);

      const { user } = await signInWithEmailAndPassword(
        auth,
        inputForms.email.trim(),
        inputForms.password.trim()
      );

      if (user) {
        const studentRef = doc(collections.students, user.uid);
        const student = await getDoc(studentRef);

        if (student.exists()) {
          setUser(student.data());
        } else {
          toast.show({ title: "User not found" });
        }
      } else {
        toast.show({ title: "User not found" });
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
            value={inputForms.email}
            onChangeText={(text) =>
              setInputForms({ ...inputForms, email: text })
            }
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
            value={inputForms.password}
            onChangeText={(text) =>
              setInputForms({ ...inputForms, password: text })
            }
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
