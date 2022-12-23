import {
  Box,
  Button,
  Container,
  Stack,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import { LogoWithText } from "../components/LogoWithText";
import { GoogleIcon } from "../components/ProviderIcons";
import { useAppDispatch } from "../hooks/redux";
import { signInWithGoogle } from "../store/reducer/auth";

export const TeacherLoginPage = () => {
  const dispatch = useAppDispatch();

  return (
    <Box
      bgGradient={{ sm: "linear(to-r, orange.300, orange.500)" }}
      py={{ base: "12", md: "24" }}
      minHeight="100vh"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
    >
      <Container
        maxW="md"
        py={{ base: "0", sm: "8" }}
        px={{ base: "4", sm: "10" }}
        bg={useBreakpointValue({ base: "transparent", sm: "bg-surface" })}
        boxShadow={{ base: "none", sm: "xl" }}
        borderRadius={{ base: "none", sm: "xl" }}
      >
        <Stack spacing="8">
          <Stack spacing="6" align="center">
            <LogoWithText />
            <Stack spacing="3" textAlign="center">
              <Text color="muted">Log in to your account</Text>
            </Stack>
          </Stack>
          <Stack spacing="6">
            <Button
              onClick={() => {
                dispatch(signInWithGoogle("TEACHER"));
              }}
              variant="secondary"
              leftIcon={<GoogleIcon boxSize="5" />}
              iconSpacing="3"
            >
              Continue with Google
            </Button>
          </Stack>
          <Text fontSize="xs" color="subtle" textAlign="center">
            By continuing, you acknowledge that you have read, understood, and
            agree to our terms and condition
          </Text>
        </Stack>
      </Container>
    </Box>
  );
};
