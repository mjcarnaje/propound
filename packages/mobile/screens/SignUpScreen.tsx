import { yupResolver } from "@hookform/resolvers/yup";
import { Role, StudentDocType, StudentYear } from "@propound/types";
import {
  getRefinedFirebaseErrorCode,
  getRefinedFirebaseErrorMessage,
  getYearLevel,
} from "@propound/utils";
import { Picker } from "@react-native-picker/picker";
import { StackNavigationProp } from "@react-navigation/stack";
import * as ImagePicker from "expo-image-picker";
import { createUserWithEmailAndPassword, UserCredential } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import moment from "moment";
import {
  Box,
  Button,
  Center,
  HStack,
  IInputProps,
  Input,
  Spinner,
  Text,
  VStack,
} from "native-base";
import React, { useState } from "react";
import { Control, useController, useForm } from "react-hook-form";
import { Image, TouchableOpacity } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Toast from "react-native-toast-message";
import * as yup from "yup";
import BaseScreen from "../components/BaseScreen";
import { auth, collections } from "../configs/firebase";
import { RootStackParamList } from "../navigation";
import { useAuthStore } from "../store/auth";
import useStorage from "../utils/useStorage";

interface SignUpInput {
  email: string;
  password: string;
  photoURL: string;
  firstName: string;
  lastName: string;
  courseSection: string;
  year: StudentYear;
}

const SignUpScreen: React.FC<
  StackNavigationProp<RootStackParamList, "SignUp">
> = (navigation) => {
  const { setUser } = useAuthStore();
  const { _uploadFile } = useStorage();
  const [uploading, setUploading] = useState(false);

  const {
    control,
    setValue,
    setError,
    watch,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<SignUpInput>({
    resolver: yupResolver(
      yup.object().shape({
        email: yup.string().email().required("Email is required"),
        password: yup.string().min(6).required("Password is required"),
        photoURL: yup.string(),
        firstName: yup.string().required("First name is required"),
        lastName: yup.string().required("Last name is required"),
        courseSection: yup.string().required("Course section is required"),
        year: yup.string().required("Year is required"),
      })
    ),
    defaultValues: {
      photoURL: "",
    },
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
      setValue("photoURL", photoURL);
      setUploading(false);
    }
  };

  const onSubmit = async (data: SignUpInput) => {
    let userCredential: UserCredential;

    try {
      userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email.trim(),
        data.password.trim()
      );
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        setError("email", {
          type: "manual",
          message: "Email already in use",
        });
        return;
      }
      Toast.show({
        type: "error",
        text1: getRefinedFirebaseErrorCode(error.code),
        text2: getRefinedFirebaseErrorMessage(error.message),
      });

      return;
    }

    try {
      if (userCredential.user) {
        const { user } = userCredential;
        const userRef = doc(collections.users, user.uid);
        const newUser: StudentDocType = {
          uid: user.uid,
          email: data.email,
          enrolledGames: [],
          photoURL: data.photoURL,
          courseSection: data.courseSection,
          firstName: data.firstName,
          lastName: data.lastName,
          role: Role.Student,
          year: data.year,
        };
        console.log({ newUser });
        await setDoc(userRef, newUser);
        setUser(newUser);
      }
    } catch (err) {
      Toast.show({
        type: "error",
        text1: err.code,
        text2: err.message,
      });
      console.log(err);
    }
  };

  return (
    <KeyboardAwareScrollView style={{ flexGrow: 1, backgroundColor: "white" }}>
      <BaseScreen>
        <VStack alignItems="center" space={4} w="90%" pb={16} mx="auto">
          <Center
            bg="gray.100"
            borderRadius="full"
            boxSize={176}
            overflow="hidden"
          >
            <TouchableOpacity onPress={pickImage}>
              {uploading ? (
                <Spinner size="sm" color="orange.600" />
              ) : watch("photoURL") ? (
                <Image
                  style={{
                    width: "100%",
                    height: "100%",
                    resizeMode: "contain",
                  }}
                  source={{ uri: watch("photoURL") }}
                />
              ) : (
                <Text fontFamily="Inter-Medium">Add Photo</Text>
              )}
            </TouchableOpacity>
          </Center>

          <SignUpInput label="First Name" control={control} name="firstName" />

          <SignUpInput label="Last Name" control={control} name="lastName" />

          <SignUpInput label="Email Address" control={control} name="email" />

          <SignUpInput
            label="Password"
            control={control}
            name="password"
            secureTextEntry
          />

          <SignUpPicker
            label="Year"
            control={control}
            name="year"
            options={Object.entries(StudentYear).map(([_, value]) => ({
              label: getYearLevel(value),
              value,
            }))}
          />

          <SignUpInput
            label="Course Section"
            control={control}
            name="courseSection"
          />

          <HStack mt={4} space={2}>
            <Button
              w="full"
              onPress={handleSubmit(onSubmit)}
              isLoading={isSubmitting}
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
      </BaseScreen>
    </KeyboardAwareScrollView>
  );
};

export default SignUpScreen;

interface SignUpInputProps extends IInputProps {
  label: string;
  control: Control<SignUpInput>;
  name: keyof SignUpInput;
}

const SignUpInput: React.FC<SignUpInputProps> = ({
  label,
  name,
  control,
  ...props
}) => {
  const { field, fieldState } = useController({
    control,
    defaultValue: "",
    name,
  });

  const hasError = !!fieldState.error;

  return (
    <VStack w="full" space={2}>
      <Text fontFamily="Inter-Medium">{label}</Text>
      <Input
        placeholder={label}
        value={field.value}
        onChangeText={field.onChange}
        borderRadius="xl"
        fontFamily="Inter-Regular"
        size="lg"
        py={3}
        px={3}
        _focus={{
          borderColor: "orange.500",
          backgroundColor: "orange.50",
        }}
        borderColor={hasError ? "red.500" : "gray.300"}
        {...props}
      />
      {hasError && (
        <Text color="red.500" fontSize={12}>
          {fieldState.error.message}
        </Text>
      )}
    </VStack>
  );
};

interface SignUpPickerProps extends SignUpInputProps {
  options: { label: string; value: string }[];
}

const SignUpPicker: React.FC<SignUpPickerProps> = ({
  label,
  name,
  control,
  options,
}) => {
  const { field, fieldState } = useController({
    control,
    defaultValue: "",
    name,
  });

  const hasError = !!fieldState.error;

  return (
    <VStack w="full" space={1}>
      <Text fontSize={16} fontWeight="semibold">
        {label}
      </Text>
      <Box
        borderRadius="xl"
        borderWidth={1}
        px={1}
        borderColor={hasError ? "red.500" : "gray.300"}
        mb={1}
      >
        <Picker
          style={{ fontFamily: "Inter-Regular" }}
          selectedValue={field.value}
          onValueChange={(year) => field.onChange(year)}
        >
          <Picker.Item label="None" value="" />
          {options.map((option) => (
            <Picker.Item
              key={option.value}
              label={option.label}
              value={option.value}
            />
          ))}
        </Picker>
      </Box>
      {hasError && (
        <Text color="red.500" fontSize={12}>
          {fieldState.error.message}
        </Text>
      )}
    </VStack>
  );
};
