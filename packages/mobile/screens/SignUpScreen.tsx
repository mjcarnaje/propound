import {
  Role,
  StudentCourse,
  StudentDocType,
  StudentYear,
} from "@propound/types";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, getDocs, query, setDoc, where } from "firebase/firestore";
import moment from "moment";
import {
  Button,
  Center,
  HStack,
  Input,
  Spinner,
  Text,
  useToast,
  VStack,
} from "native-base";
import React, { useState } from "react";
import { Image, TouchableOpacity } from "react-native";
import BaseScreen from "../components/BaseScreen";
import { auth, collections } from "../configs/firebase";
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
  const [inputForms, setInputForms] = useState<
    Partial<StudentDocType & { password: string }>
  >({
    email: "",
    password: "",
    photoURL: "",
    firstName: "",
    lastName: "",
    course: StudentCourse.BTLEdIndustrialArts,
    year: StudentYear.Freshman,
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
      setInputForms((prev) => ({ ...prev, photoURL }));
      setUploading(false);
    }
  };

  const onNext = async () => {
    const { email } = inputForms;
    setIsCheckingEmail(true);
    const q = query(
      collections.students,
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
        inputForms.email.trim(),
        inputForms.password.trim()
      );

      if (user) {
        const userRef = doc(collections.students, user.uid);

        const newUser: StudentDocType = {
          uid: user.uid,
          email: inputForms.email,
          enrolledGames: [],
          photoURL: inputForms.photoURL,
          course: inputForms.course,
          firstName: inputForms.firstName,
          lastName: inputForms.lastName,
          role: Role.Student,
          year: inputForms.year,
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
                value={inputForms.email}
                onChangeText={(text) =>
                  setInputForms({ ...inputForms, email: text })
                }
                borderRadius="xl"
                fontFamily="Inter-Regular"
                size="lg"
                py={3}
                px={3}
                _focus={{
                  borderColor: "orange.500",
                  backgroundColor: "orange.50",
                }}
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
                _focus={{
                  borderColor: "orange.500",
                  backgroundColor: "orange.50",
                }}
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
                ) : inputForms.photoURL ? (
                  <Image
                    style={{
                      width: "100%",
                      height: "100%",
                      resizeMode: "contain",
                    }}
                    source={{ uri: inputForms.photoURL }}
                  />
                ) : (
                  <Text fontFamily="Inter-Medium">Add Photo</Text>
                )}
              </Center>
            </TouchableOpacity>
            <Input
              placeholder="First Name"
              value={inputForms.firstName}
              onChangeText={(text) =>
                setInputForms({ ...inputForms, firstName: text })
              }
              borderRadius="xl"
              fontFamily="Inter-Regular"
              size="lg"
              py={3}
              px={3}
              _focus={{
                borderColor: "orange.500",
                backgroundColor: "orange.50",
              }}
            />
            <Input
              placeholder="Last Name"
              value={inputForms.lastName}
              onChangeText={(text) =>
                setInputForms({ ...inputForms, lastName: text })
              }
              borderRadius="xl"
              fontFamily="Inter-Regular"
              size="lg"
              py={3}
              px={3}
              _focus={{
                borderColor: "orange.500",
                backgroundColor: "orange.50",
              }}
            />

            <VStack w="full" space={1}>
              <Text fontSize={16} fontWeight="semibold">
                Course
              </Text>
              <Picker
                style={{ backgroundColor: "#f2f2f2" }}
                selectedValue={inputForms.course}
                onValueChange={(course) =>
                  setInputForms({ ...inputForms, course })
                }
              >
                {Object.values(StudentCourse).map((course) => (
                  <Picker.Item label={course} value={course} />
                ))}
              </Picker>
            </VStack>

            <VStack w="full" space={1}>
              <Text fontSize={16} fontWeight="semibold">
                Year
              </Text>
              <Picker
                style={{ backgroundColor: "#f2f2f2" }}
                selectedValue={inputForms.year}
                onValueChange={(year) => setInputForms({ ...inputForms, year })}
              >
                {Object.values(StudentYear).map((year) => (
                  <Picker.Item label={year} value={year} />
                ))}
              </Picker>
            </VStack>

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
