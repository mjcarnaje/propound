import {
  Box,
  Button,
  Container,
  Heading,
  Stack,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import { Logo } from "../components/Logo";
import { GoogleIcon } from "../components/ProviderIcons";
import { useAppDispatch } from "../hooks/redux";
import { signInWithGoogle } from "../store/reducer/auth";

export const TeacherLoginPage = () => {
  const dispatch = useAppDispatch();

  return (
    <Box
      bgGradient={{ sm: "linear(to-r, purple.600, purple.700)" }}
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
            <Logo />
            <Stack spacing="3" textAlign="center">
              <Heading size="xs">Teacher Login</Heading>
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
          <Stack spacing="0.5" align="center">
            <Text fontSize="sm" color="muted">
              Having trouble logging in?
            </Text>
            <Button variant="link" colorScheme="purple" size="sm">
              Contact us
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
